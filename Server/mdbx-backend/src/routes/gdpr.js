const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const db = require('../db');
const bcrypt = require('bcryptjs');
const { auditGDPRAction } = require('../middleware/auditLogger');

/**
 * GDPR Compliance Routes
 * Implements user data rights under GDPR Articles 15-22
 */

// Right to Access (Article 15) - Export all user data
router.get('/data-export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Gather all user data
    const [userData] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    const [subscriberData] = await db.query('SELECT * FROM subscribers WHERE userId = ?', [userId]);
    const [transactions] = await db.query('SELECT * FROM transaction WHERE userId = ?', [userId]);
    const [contributions] = await db.query('SELECT * FROM contributions WHERE userId = ?', [userId]);
    const [wallets] = await db.query(
      'SELECT * FROM wallets WHERE subscriber_id IN (SELECT subscriber_id FROM user WHERE id = ?)',
      [userId]
    );
    const [consents] = await db.query('SELECT * FROM user_consents WHERE user_id = ?', [userId]);
    const [auditLogs] = await db.query(
      'SELECT * FROM audit_log WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1000',
      [userId]
    );
    
    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      data: {
        personal_info: userData[0],
        subscriber_info: subscriberData[0],
        transactions: transactions,
        contributions: contributions,
        wallets: wallets,
        consents: consents,
        recent_activity: auditLogs
      },
      metadata: {
        total_transactions: transactions.length,
        total_contributions: contributions.length,
        account_created: userData[0]?.createdAt,
        last_login: userData[0]?.last_login
      }
    };
    
    // Audit the data export
    await auditGDPRAction('DATA_EXPORT', userId, { format: 'json' }, req);
    
    res.json({
      success: true,
      message: 'Data export completed',
      data: exportData
    });
  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Right to Erasure (Article 17) - Delete account
router.delete('/delete-account', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const userId = req.user.id;
    const { password, confirmation } = req.body;
    
    // Verify password
    const [user] = await connection.query('SELECT password, balance FROM user WHERE id = ?', [userId]);
    
    if (!user[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(password, user[0].password);
    
    if (!isValid || confirmation !== 'DELETE MY ACCOUNT') {
      return res.status(403).json({ 
        error: 'Invalid confirmation. Please enter your password and type "DELETE MY ACCOUNT"' 
      });
    }
    
    await connection.beginTransaction();
    
    // Check for active financial obligations
    if (parseFloat(user[0].balance) > 0) {
      throw new Error('Cannot delete account with positive balance. Please withdraw funds first.');
    }
    
    // Anonymize user data (financial records must be retained for 7 years)
    await connection.query(
      `UPDATE user SET 
        name = 'DELETED_USER',
        email = CONCAT('deleted_', id, '@anonymized.local'),
        mobile = CONCAT('DELETED_', id),
        password = NULL,
        deleted_at = NOW(),
        deletion_reason = 'USER_REQUEST'
      WHERE id = ?`,
      [userId]
    );
    
    await connection.query(
      `UPDATE subscribers SET 
        firstname = 'DELETED',
        surname = 'USER',
        address1 = NULL,
        dob = NULL,
        alternatePhone = NULL,
        nextOfKinName = NULL,
        nextOfKinContact = NULL,
        deleted_at = NOW()
      WHERE userId = ?`,
      [userId]
    );
    
    // Log GDPR deletion
    await auditGDPRAction('ACCOUNT_DELETION', userId, { 
      reason: 'USER_REQUEST',
      timestamp: new Date(),
      ip: req.ip
    }, req);
    
    await connection.commit();
    connection.release();
    
    res.json({ 
      success: true,
      message: 'Account deleted successfully. Financial records have been anonymized and will be retained for regulatory compliance.' 
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Account deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Right to Rectification (Article 16) - Update personal data
router.patch('/update-data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    // Validate and sanitize updates
    const allowedFields = ['name', 'email', 'mobile', 'address1', 'city', 'state', 'country'];
    const sanitizedUpdates = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = updates[key];
      }
    });
    
    if (Object.keys(sanitizedUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    // Update user data
    const setClause = Object.keys(sanitizedUpdates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(sanitizedUpdates), userId];
    
    await db.query(`UPDATE user SET ${setClause} WHERE id = ?`, values);
    
    // Audit the update
    await auditGDPRAction('DATA_RECTIFICATION', userId, { updated_fields: Object.keys(sanitizedUpdates) }, req);
    
    res.json({ 
      success: true,
      message: 'Data updated successfully',
      updated_fields: Object.keys(sanitizedUpdates)
    });
  } catch (error) {
    console.error('Data update error:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

// Right to Data Portability (Article 20) - Export in machine-readable format
router.get('/data-portability', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const format = req.query.format || 'json'; // json or csv
    
    // Get all user data
    const [userData] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    const [transactions] = await db.query('SELECT * FROM transaction WHERE userId = ?', [userId]);
    const [contributions] = await db.query('SELECT * FROM contributions WHERE userId = ?', [userId]);
    
    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV({ user: userData[0], transactions, contributions });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="user_data_${userId}.csv"`);
      res.send(csv);
    } else {
      // JSON format
      res.json({
        user: userData[0],
        transactions,
        contributions
      });
    }
    
    await auditGDPRAction('DATA_PORTABILITY', userId, { format }, req);
  } catch (error) {
    console.error('Data portability error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Consent management
router.post('/consent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { consent_type, consent_given } = req.body;
    
    const validTypes = ['terms_of_service', 'privacy_policy', 'marketing', 'analytics', 'data_processing'];
    
    if (!validTypes.includes(consent_type)) {
      return res.status(400).json({ error: 'Invalid consent type' });
    }
    
    const { v4: uuidv4 } = require('uuid');
    
    await db.query(
      `INSERT INTO user_consents (id, user_id, consent_type, consent_given, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), userId, consent_type, consent_given, req.ip, req.get('user-agent')]
    );
    
    await auditGDPRAction('CONSENT_UPDATED', userId, { consent_type, consent_given }, req);
    
    res.json({ success: true, message: 'Consent recorded' });
  } catch (error) {
    console.error('Consent error:', error);
    res.status(500).json({ error: 'Failed to record consent' });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  // Simple CSV conversion (can be enhanced)
  let csv = 'Type,ID,Date,Amount,Status\n';
  
  data.transactions.forEach(tx => {
    csv += `Transaction,${tx.id},${tx.createdAt},${tx.amount},${tx.status}\n`;
  });
  
  data.contributions.forEach(contrib => {
    csv += `Contribution,${contrib.id},${contrib.contribution_date},${contrib.amount},${contrib.status}\n`;
  });
  
  return csv;
}

module.exports = router;
