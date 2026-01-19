const express = require('express');
const authenticateToken = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Test route to verify admin routes are loading
router.get('/test', (req, res) => {
  res.json({ status: 'success', message: 'Admin routes are working!' });
});

// Admin middleware
const isAdmin = async (req, res, next) => {
  const adminId = process.env.ADMIN_USER_ID;
  
  if (!adminId) {
    return res.status(500).json({ status: 'error', message: 'Admin not configured' });
  }
  
  if (req.user.id !== adminId) {
    return res.status(403).json({ status: 'error', message: 'Access denied. Admin only.' });
  }
  
  next();
};

// Get all contributions summary
router.get('/contributions/summary', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [icaTotal] = await pool.query(
      'SELECT SUM(amount) as total FROM contributions WHERE type = "ICA"'
    );
    
    const [piggyTotal] = await pool.query(
      'SELECT SUM(amount) as total FROM contributions WHERE type = "PIGGY"'
    );
    
    const [monthlyICA] = await pool.query(
      'SELECT SUM(amount) as total FROM contributions WHERE type = "ICA" AND MONTH(createdAt) = MONTH(CURDATE()) AND YEAR(createdAt) = YEAR(CURDATE())'
    );
    
    const [monthlyPiggy] = await pool.query(
      'SELECT SUM(amount) as total FROM contributions WHERE type = "PIGGY" AND MONTH(createdAt) = MONTH(CURDATE()) AND YEAR(createdAt) = YEAR(CURDATE())'
    );

    res.json({
      status: 'success',
      data: {
        ica: {
          total: icaTotal[0].total || 0,
          thisMonth: monthlyICA[0].total || 0
        },
        piggy: {
          total: piggyTotal[0].total || 0,
          thisMonth: monthlyPiggy[0].total || 0
        }
      }
    });
  } catch (err) {
    console.error('Admin summary error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to get summary' });
  }
});

// Get all users' contribution balances
router.get('/users/balances', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.balance, s.ica_balance, s.piggy_balance, s.contribution_mode 
       FROM user u 
       LEFT JOIN subscribers s ON u.subscriber_id = s.id 
       ORDER BY s.ica_balance DESC`
    );

    res.json({
      status: 'success',
      data: users
    });
  } catch (err) {
    console.error('Admin users balances error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to get users balances' });
  }
});

// Calculate and apply yearly ICA interest
router.post('/ica/apply-interest', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { interestRate } = req.body;
    const rate = interestRate || 10; // Default 10% yearly

    // Get all users with ICA balance
    const [users] = await pool.query(
      'SELECT userId, ica_balance FROM subscribers WHERE ica_balance > 0'
    );

    let totalInterest = 0;
    const updates = [];

    for (const user of users) {
      const interest = (parseFloat(user.ica_balance) * rate) / 100;
      totalInterest += interest;
      
      // Update ICA balance with interest
      await pool.query(
        'UPDATE subscribers SET ica_balance = ica_balance + ? WHERE userId = ?',
        [interest, user.userId]
      );
      
      // Record interest in contributions
      await pool.query(
        `INSERT INTO contributions (id, userId, type, amount, status, contribution_date, year, month, interest_earned, createdAt) 
         VALUES (UUID(), ?, 'ICA', ?, 'completed', CURDATE(), YEAR(CURDATE()), MONTH(CURDATE()), ?, NOW(6))`,
        [user.userId, interest, interest]
      );
      
      updates.push({ userId: user.userId, interest });
    }

    res.json({
      status: 'success',
      message: `Interest applied to ${users.length} users`,
      data: {
        rate: `${rate}%`,
        totalInterest,
        usersUpdated: users.length,
        updates
      }
    });
  } catch (err) {
    console.error('Apply interest error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to apply interest' });
  }
});

// Get admin wallet balance
router.get('/wallet', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [admin] = await pool.query('SELECT balance FROM user WHERE id = ?', [req.user.id]);
    
    res.json({
      status: 'success',
      data: {
        balance: admin[0]?.balance || 0
      }
    });
  } catch (err) {
    console.error('Admin wallet error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to get admin wallet' });
  }
});

// Run database migration to add esusu_balance column (temporary - no auth for testing)
router.get('/migrate/esusu-balance-test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Check if column already exists
      const [columns] = await connection.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'subscribers' AND COLUMN_NAME = 'esusu_balance'"
      );

      if (columns.length > 0) {
        connection.release();
        return res.json({
          status: 'success',
          message: 'esusu_balance column already exists',
          alreadyExists: true
        });
      }

      // Add the column
      await connection.query(
        "ALTER TABLE subscribers ADD COLUMN esusu_balance DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Esusu contribution balance'"
      );
      
      // Update existing records
      await connection.query(
        "UPDATE subscribers SET esusu_balance = 0.00 WHERE esusu_balance IS NULL"
      );

      connection.release();

      res.json({
        status: 'success',
        message: 'esusu_balance column added successfully',
        alreadyExists: false
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to run migration',
      error: err.message 
    });
  }
});

// Run database migration to add esusu_balance column
router.post('/migrate/esusu-balance', authenticateToken, isAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Check if column already exists
      const [columns] = await connection.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'subscribers' AND COLUMN_NAME = 'esusu_balance'"
      );

      if (columns.length > 0) {
        return res.json({
          status: 'success',
          message: 'esusu_balance column already exists',
          alreadyExists: true
        });
      }

      // Add the column
      await connection.query(
        "ALTER TABLE subscribers ADD COLUMN esusu_balance DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Esusu contribution balance'"
      );
      
      // Update existing records
      await connection.query(
        "UPDATE subscribers SET esusu_balance = 0.00 WHERE esusu_balance IS NULL"
      );

      connection.release();

      res.json({
        status: 'success',
        message: 'esusu_balance column added successfully',
        alreadyExists: false
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to run migration',
      error: err.message 
    });
  }
});

module.exports = router;
