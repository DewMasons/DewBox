const pool = require('../src/db');

async function listMobiles() {
    const [users] = await pool.query('SELECT mobile, name FROM user ORDER BY name');
    console.log('Mobile numbers in database:\n');
    users.forEach(u => {
        console.log(`  ${u.mobile.padEnd(20)} - ${u.name}`);
    });
    await pool.end();
}

listMobiles();
