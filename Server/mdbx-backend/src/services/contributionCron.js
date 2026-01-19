const cron = require('node-cron');
const pool = require('../db');

/**
 * Process automatic contributions for all active contribution plans
 * 
 * NOTE: This feature is currently disabled as it requires database schema updates.
 * The contributions table needs these additional columns:
 * - nextDueDate (DATE)
 * - mode (VARCHAR - monthly/quarterly/yearly)  
 * - totalPaid (DECIMAL)
 */
async function processAutomaticContributions() {
  console.log('🔄 Running automatic contribution processing...');
  
  try {
    console.log('⚠️ Automatic contributions feature not yet fully implemented');
    console.log('📊 Skipping automatic contribution processing');
    console.log('ℹ️ Manual contributions are still working normally');
    
    // Feature disabled - requires database schema updates
    return;
    
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
  console.log('ℹ️ Automatic contributions feature is currently disabled');
  
  // Optional: Run immediately on startup for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Development mode: Cron job ready');
  }
}

module.exports = {
  initializeContributionCron,
  processAutomaticContributions
};
