const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAllTables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('Connected to database\n');
    
    const allPlainPasswords = [];

    // Check USER table
    console.log('=== USER TABLE ===');
    try {
        const [users] = await connection.query('SELECT id, mobile, name, password FROM user');
        console.log(`Found ${users.length} records`);
        
        users.forEach(user => {
            const isHashed = user.password && user.password.startsWith('$2');
            if (!isHashed) {
                console.log(`❌ Plain password: ${user.mobile} = "${user.password}"`);
                allPlainPasswords.push({ table: 'user', mobile: user.mobile, password: user.password });
            }
        });
        console.log(`✅ All ${users.length} passwords are hashed\n`);
    } catch (err) {
        console.log(`Error: ${err.message}\n`);
    }

    // Check USERS table (plural)
    console.log('=== USERS TABLE (plural) ===');
    try {
        const [users] = await connection.query('SELECT id, mobile, password FROM users');
        console.log(`Found ${users.length} records`);
        
        users.forEach(user => {
            const isHashed = user.password && user.password.startsWith('$2');
            if (!isHashed) {
                console.log(`❌ Plain password: ${user.mobile} = "${user.password}"`);
                allPlainPasswords.push({ table: 'users', mobile: user.mobile, password: user.password });
            }
        });
        
        if (allPlainPasswords.filter(p => p.table === 'users').length === 0) {
            console.log(`✅ All ${users.length} passwords are hashed\n`);
        }
    } catch (err) {
        console.log(`Table doesn't exist or error: ${err.message}\n`);
    }

    // Check SUBSCRIBERS table
    console.log('=== SUBSCRIBERS TABLE ===');
    try {
        const [subs] = await connection.query('SELECT id, mobile, password FROM subscribers');
        console.log(`Found ${subs.length} records`);
        
        subs.forEach(sub => {
            const isHashed = sub.password && sub.password.startsWith('$2');
            if (!isHashed) {
                console.log(`❌ Plain password: ${sub.mobile} = "${sub.password}"`);
                allPlainPasswords.push({ table: 'subscribers', mobile: sub.mobile, password: sub.password });
            }
        });
        
        if (allPlainPasswords.filter(p => p.table === 'subscribers').length === 0) {
            console.log(`✅ All ${subs.length} passwords are hashed\n`);
        }
    } catch (err) {
        console.log(`Table doesn't exist or error: ${err.message}\n`);
    }

    // Final summary
    console.log('\n========== FINAL SUMMARY ==========');
    if (allPlainPasswords.length === 0) {
        console.log('✅ ALL PASSWORDS ARE PROPERLY HASHED!');
    } else {
        console.log(`❌ FOUND ${allPlainPasswords.length} PLAIN TEXT PASSWORDS:\n`);
        allPlainPasswords.forEach(p => {
            console.log(`Table: ${p.table}`);
            console.log(`Mobile: ${p.mobile}`);
            console.log(`Password: "${p.password}"`);
            console.log('---');
        });
    }

    await connection.end();
}

checkAllTables().catch(console.error);
