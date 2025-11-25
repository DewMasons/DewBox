const cron = require('node-cron');
const pool = require('../db');

/**
 * Process automatic contributions for all active contribution plans
 */
async function processAutomaticContributions() {
  console.log('🔄 Running automatic contribution processing...');
  
  try {
    // Get all active contributions that are due today
    const [contributions] = await pool.query(`
      SELECT c.*, u.balance, u.email, u.name
      FROM contributions c
      JOIN users u ON c.userId = u.id
      WHERE c.status = 'active'
      AND c.nextDueDate <= CURDATE()
    `);

    console.log(`📊 Found ${contributions.length} contributions to process`);

    let successCount = 0;
    let failureCount = 0;

    for (const contribution of contributions) {
      try {
        // Check if user has sufficient balance
        if (contribution.balance < contribution.amount) {
          console.log(`⚠️ Insufficient balance for user ${contribution.userId} (${contribution.email})`);
          
          // Update contribution status to paused
          await pool.query(
            'UPDATE contributions SET status = ? WHERE id = ?',
            ['paused', contribution.id]
          );
          
          failureCount++;
          continue;
        }

        // Deduct contribution amount from user balance
        await pool.query(
          'UPDATE users SET balance = balance - ? WHERE id = ?',
          [contribution.amount, contribution.userId]
        );

        // Create transaction record
        await pool.query(
          `INSERT INTO transactions (userId, type, amount, status, description, reference, createdAt)
           VALUES (?, 'contribution', ?, 'completed', ?, ?, NOW())`,
          [
            contribution.userId,
            contribution.amount,
            `Automatic ${contribution.mode} contribution`,
            `AUTO_CONTRIB_${Date.now()}_${contribution.id}`
          ]
        );

        // Update contribution record
        const nextDueDate = calculateNextDueDate(contribution.nextDueDate, contribution.mode);
        await pool.query(
          `UPDATE contributions 
           SET totalPaid = totalPaid + ?, 
               nextDueDate = ?,
               updatedAt = NOW()
           WHERE id = ?`,
          [contribution.amount, nextDueDate, contribution.id]
        );

        console.log(`✅ Processed contribution for ${contribution.email}: ₦${contribution.amount}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error processing contribution ${contribution.id}:`, error.message);
        failureCount++;
      }
    }

    console.log(`✨ Contribution processing complete: ${successCount} successful, ${failureCount} failed`);

  } catch (error) {
    console.error('❌ Error in automatic contribution processing:', error);
  }
}

/**
 * Calculate next due date based on contribution mode
 */
function calculateNextDueDate(currentDueDate, mode) {
  const date = new Date(currentDueDate);
  
  switch (mode) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  
  return date.toISOString().split('T')[0];
}

/**
 * Initialize contribution cron job
 * Runs every day at 12:00 AM (midnight)
 */
function initializeContributionCron() {
  // Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', () => {
    console.log('⏰ Cron job triggered: Processing automatic contributions');
    processAutomaticContributions();
  });

  console.log('✅ Contribution cron job initialized (runs daily at 00:00)');
  
  // Optional: Run immediately on startup for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Development mode: Running contribution check on startup');
    // Uncomment to test immediately:
    // processAutomaticContributions();
  }
}

module.exports = {
  initializeContributionCron,
  processAutomaticContributions
};
