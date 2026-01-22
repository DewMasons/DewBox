const Contribution = require('../models/contribution');
const db = require('../db');

class ContributionService {
  /**
   * Determine contribution type based on user's registration date
   * Days 2-11: ICA period
   * Days 12-31: PIGGY period
   * Day 1: Reserved for FEE
   */
  static getContributionType(userSettings, registrationDate) {
    const today = new Date();
    const regDate = new Date(registrationDate);
    
    // If user has "all_ica" mode, always return ICA
    if (userSettings.contribution_mode === 'all_ica') {
      return 'ICA';
    }
    
    const regDay = regDate.getDate();
    const currentDay = today.getDate();
    
    // Day 1 is reserved for fees
    if (currentDay === 1) {
      return 'FEE';
    }
    
    // Calculate ICA period: registration day to (registration day + 9)
    let icaStartDay = regDay;
    let icaEndDay = regDay + 9;
    
    // Normalize for month boundaries
    if (icaEndDay > 31) {
      icaEndDay = icaEndDay - 31;
    }
    
    // Check if today falls in ICA period
    if (icaStartDay <= icaEndDay) {
      if (currentDay >= icaStartDay && currentDay <= icaEndDay) {
        return 'ICA';
      }
    } else {
      // Wrapped case: ICA period crosses month boundary
      if (currentDay >= icaStartDay || currentDay <= icaEndDay) {
        return 'ICA';
      }
    }
    
    // Otherwise, it's PIGGY period
    return 'PIGGY';
  }

  /**
   * Process a contribution
   * - ICA: Transfers to admin wallet, locked for 1 year
   * - PIGGY: Stays in user wallet, tracked separately
   * - FEE: Transfers to admin wallet, service fee
   */
  static async processContribution(userId, amount, type = null, description = null) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get user info
      const [userRows] = await connection.query(
        `SELECT u.*, s.contribution_mode, s.ica_balance, s.piggy_balance, s.createdAt as registrationDate 
         FROM user u 
         LEFT JOIN subscribers s ON u.subscriber_id = s.id 
         WHERE u.id = ?`,
        [userId]
      );
      
      if (userRows.length === 0) {
        throw new Error('User not found');
      }
      
      const user = userRows[0];
      
      // Determine contribution type if not specified
      const contributionType = type || this.getContributionType(
        user, 
        user.registrationDate || user.createdAt
      );
      
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      // Check if user has sufficient balance
      if (parseFloat(user.balance) < parseFloat(amount)) {
        throw new Error('Insufficient balance');
      }

      // Process based on contribution type
      if (contributionType === 'ICA') {
        // ICA: Transfer to admin wallet, locked for 1 year with interest
        const adminId = process.env.ADMIN_USER_ID;
        
        if (!adminId) {
          throw new Error('Admin user not configured');
        }
        
        // Deduct from user wallet
        await connection.query(
          'UPDATE user SET balance = balance - ? WHERE id = ?',
          [amount, userId]
        );
        
        // Add to admin wallet
        await connection.query(
          'UPDATE user SET balance = balance + ? WHERE id = ?',
          [amount, adminId]
        );
        
        // Update user's ICA balance
        await connection.query(
          'UPDATE subscribers SET ica_balance = ica_balance + ? WHERE userId = ?',
          [amount, userId]
        );
        
      } else if (contributionType === 'PIGGY') {
        // PIGGY: Money stays in user wallet, just track it
        await connection.query(
          'UPDATE subscribers SET piggy_balance = piggy_balance + ? WHERE userId = ?',
          [amount, userId]
        );
        
      } else if (contributionType === 'FEE') {
        // FEE: Transfer to admin wallet
        const adminId = process.env.ADMIN_USER_ID;
        
        if (!adminId) {
          throw new Error('Admin user not configured');
        }
        
        // Deduct from user wallet
        await connection.query(
          'UPDATE user SET balance = balance - ? WHERE id = ?',
          [amount, userId]
        );
        
        // Add to admin wallet
        await connection.query(
          'UPDATE user SET balance = balance + ? WHERE id = ?',
          [amount, adminId]
        );
      }

      // Create contribution record
      const contributionId = await this.createContributionRecord(
        connection,
        userId,
        contributionType,
        amount,
        year,
        month,
        description
      );

      await connection.commit();
      connection.release();

      return {
        success: true,
        contributionId,
        type: contributionType,
        amount: parseFloat(amount),
        year,
        month
      };
      
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  /**
   * Create contribution record in database
   */
  static async createContributionRecord(connection, userId, type, amount, year, month, description) {
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    
    await connection.query(
      `INSERT INTO contributions 
      (id, userId, type, amount, status, contribution_date, year, month, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 'completed', CURDATE(), ?, ?, ?, NOW(6), NOW(6))`,
      [id, userId, type, amount, year, month, description]
    );

    return id;
  }

  /**
   * Get user's contribution summary
   */
  static async getUserSummary(userId) {
    const summary = await Contribution.getUserSummary(userId);
    
    // Format summary by type
    const result = {
      piggy: { total: 0, ytd: 0, mtd: 0, count: 0 },
      ica: { total: 0, ytd: 0, mtd: 0, count: 0 },
      fee: { total: 0, ytd: 0, mtd: 0, count: 0 }
    };

    summary.forEach(item => {
      const key = item.type.toLowerCase();
      if (result[key]) {
        result[key] = {
          total: parseFloat(item.total || 0),
          ytd: parseFloat(item.ytd || 0),
          mtd: parseFloat(item.mtd || 0),
          count: parseInt(item.count || 0)
        };
      }
    });

    return result;
  }

  /**
   * Apply interest to ICA contributions (Admin only)
   */
  static async applyInterestToICA(interestRate) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get all users with ICA balance
      const [users] = await connection.query(
        `SELECT s.userId, s.ica_balance, u.name, u.email 
         FROM subscribers s 
         JOIN user u ON s.userId = u.id 
         WHERE s.ica_balance > 0`
      );

      const updates = [];
      let totalInterest = 0;

      for (const user of users) {
        const interest = parseFloat(user.ica_balance) * (interestRate / 100);
        const newBalance = parseFloat(user.ica_balance) + interest;

        // Update ICA balance
        await connection.query(
          'UPDATE subscribers SET ica_balance = ? WHERE userId = ?',
          [newBalance, user.userId]
        );

        // Record interest in contributions
        const { v4: uuidv4 } = require('uuid');
        await connection.query(
          `INSERT INTO contributions 
          (id, userId, type, amount, status, contribution_date, year, month, interest_earned, description, createdAt, updatedAt)
          VALUES (?, ?, 'ICA', 0, 'completed', CURDATE(), YEAR(NOW()), MONTH(NOW()), ?, 'Interest applied', NOW(6), NOW(6))`,
          [uuidv4(), user.userId, interest]
        );

        updates.push({
          userId: user.userId,
          name: user.name,
          email: user.email,
          previousBalance: parseFloat(user.ica_balance),
          interest: parseFloat(interest.toFixed(2)),
          newBalance: parseFloat(newBalance.toFixed(2))
        });

        totalInterest += interest;
      }

      await connection.commit();
      connection.release();

      return {
        success: true,
        rate: `${interestRate}%`,
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        usersUpdated: users.length,
        updates
      };
      
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  /**
   * Get contribution info for today
   */
  static async getContributionInfo(userId) {
    const [userRows] = await db.query(
      `SELECT s.contribution_mode, s.createdAt as registrationDate, u.createdAt as userCreatedAt 
       FROM subscribers s 
       LEFT JOIN user u ON s.userId = u.id 
       WHERE s.userId = ?`,
      [userId]
    );
    
    const userSettings = userRows[0] || { contribution_mode: 'auto' };
    const registrationDate = userSettings.registrationDate || userSettings.userCreatedAt || new Date();
    const contributionType = this.getContributionType(userSettings, registrationDate);
    
    const dayOfMonth = new Date().getDate();
    const regDay = new Date(registrationDate).getDate();
    
    const icaStartDay = regDay;
    const icaEndDay = (regDay + 9) > 31 ? (regDay + 9 - 31) : (regDay + 9);

    const descriptions = {
      ICA: 'Investment Cooperative Account - Join an investment cooperative group. Rotating collection',
      PIGGY: 'Piggy Savings - Flexible savings in your wallet',
      FEE: 'Platform Fee - Service charge'
    };

    return {
      type: contributionType,
      mode: userSettings.contribution_mode,
      dayOfMonth,
      registrationDay: regDay,
      icaPeriod: `Day ${icaStartDay} to Day ${icaEndDay}`,
      piggyPeriod: `Day ${icaEndDay + 1} onwards`,
      feePeriod: 'Day 1',
      description: descriptions[contributionType]
    };
  }
}

module.exports = ContributionService;
