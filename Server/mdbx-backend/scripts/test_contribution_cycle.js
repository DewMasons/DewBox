const pool = require('../src/db');

// Simulate the contribution type logic
function getContributionType(userSettings, registrationDate) {
  const today = new Date();
  const regDate = new Date(registrationDate);
  
  // If user has "all_ica" mode, always return ICA
  if (userSettings.contribution_mode === 'all_ica') {
    return 'ICA';
  }
  
  // Calculate days since registration in current month cycle
  const regDay = regDate.getDate();
  const currentDay = today.getDate();
  
  // Calculate the user's personal month cycle
  // ICA period: registration day to (registration day + 9)
  // PIGGY period: (registration day + 10) to end of cycle
  
  let icaStartDay = regDay;
  let icaEndDay = regDay + 9;
  
  // Normalize for month boundaries
  if (icaEndDay > 31) {
    icaEndDay = icaEndDay - 31;
  }
  
  // Check if today falls in ICA period
  if (icaStartDay <= icaEndDay) {
    // Normal case: ICA period doesn't wrap around month
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

async function testContributionCycle() {
    console.log('=== CONTRIBUTION CYCLE TEST ===\n');
    console.log(`Today's Date: ${new Date().toDateString()}`);
    console.log(`Current Day of Month: ${new Date().getDate()}\n`);
    
    // Test scenarios
    const testCases = [
        { regDate: '2025-12-01', name: 'Registered on 1st' },
        { regDate: '2025-12-05', name: 'Registered on 5th' },
        { regDate: '2025-12-12', name: 'Registered on 12th (today)' },
        { regDate: '2025-12-15', name: 'Registered on 15th' },
        { regDate: '2025-12-25', name: 'Registered on 25th' },
        { regDate: '2025-11-28', name: 'Registered on 28th (last month)' },
    ];
    
    console.log('TEST SCENARIOS:\n');
    
    testCases.forEach(test => {
        const regDate = new Date(test.regDate);
        const regDay = regDate.getDate();
        const icaStartDay = regDay;
        let icaEndDay = regDay + 9;
        
        if (icaEndDay > 31) {
            icaEndDay = icaEndDay - 31;
        }
        
        const contributionType = getContributionType({ contribution_mode: 'auto' }, test.regDate);
        
        console.log(`${test.name}:`);
        console.log(`  Registration Day: ${regDay}`);
        console.log(`  ICA Period: Day ${icaStartDay} to Day ${icaEndDay}`);
        console.log(`  Current Type: ${contributionType}`);
        console.log('');
    });
    
    // Check actual users
    console.log('\n=== ACTUAL USERS ===\n');
    
    const [users] = await pool.query(`
        SELECT u.id, u.name, u.mobile, u.createdAt, s.contribution_mode 
        FROM user u 
        LEFT JOIN subscribers s ON u.subscriber_id = s.id
    `);
    
    users.forEach(user => {
        const regDate = user.createdAt;
        const regDay = new Date(regDate).getDate();
        const icaStartDay = regDay;
        let icaEndDay = regDay + 9;
        
        if (icaEndDay > 31) {
            icaEndDay = icaEndDay - 31;
        }
        
        const contributionType = getContributionType(
            { contribution_mode: user.contribution_mode || 'auto' }, 
            regDate
        );
        
        console.log(`${user.name} (${user.mobile}):`);
        console.log(`  Registered: ${new Date(regDate).toDateString()}`);
        console.log(`  Registration Day: ${regDay}`);
        console.log(`  ICA Period: Day ${icaStartDay} to Day ${icaEndDay}`);
        console.log(`  Current Type: ${contributionType}`);
        console.log('');
    });
    
    await pool.end();
}

testContributionCycle();
