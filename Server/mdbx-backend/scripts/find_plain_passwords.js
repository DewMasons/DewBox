const mysql = require('mysql2/promise');
require('dotenv').config();

async function findPlainPasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('Connected to database\n');

    // Check user table
    const [users] = await connection.query('SELECT id, mobile, name, password FROM user');
    
    console.log('USER TABLE RESULTS:');
    console.log('==================');
    
    const plainPasswords = [];
    
    for (const user of users) {
        const isHashed = user.password && user.password.startsWith('$2');
        console.log(`\nUser ID: ${user.id}`);
        console.log(`Name: ${user.name || 'N/A'}`);
        console.log(`Mobile: ${user.mobile}`);
        console.log(`Password: ${user.password}`);
        console.log(`Is Hashed: ${isHashed ? 'YES' : 'NO'}`);
        
        if (!isHashed) {
            plainPasswords.push({
                id: user.id,
                mobile: user.mobile,
                name: user.name,
                password: user.password
            });
        }
    }
    
    console.log('\n\n===================');
    console.log('SUMMARY');
    console.log('===================');
    console.log(`Total users: ${users.length}`);
    console.log(`Plain text passwords: ${plainPasswords.length}`);
    
    if (plainPasswords.length > 0) {
        console.log('\nPLAIN TEXT PASSWORDS FOUND:');
        plainPasswords.forEach(p => {
            console.log(`  Mobile: ${p.mobile} | Password: "${p.password}"`);
        });
    }
    
    await connection.end();
}

findPlainPasswords().catch(console.error);
