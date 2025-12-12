const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUserPassword() {
    const mobile = '2349116896136';
    const testPasswords = [
        'Adunni<3',
        'adunni<3',
        'Adunni',
        'password',
        'Password123',
        'Ephata@John1010B',
        '123456',
        'test123',
    ];

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log(`Checking password for mobile: ${mobile}\n`);

    // Get user from database
    const [users] = await connection.query('SELECT id, mobile, name, password FROM user WHERE mobile = ?', [mobile]);

    if (users.length === 0) {
        console.log('❌ User not found!');
        await connection.end();
        return;
    }

    const user = users[0];
    console.log('User found:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Mobile: ${user.mobile}`);
    console.log(`  Password hash: ${user.password}`);
    console.log(`  Hash starts with $2: ${user.password.startsWith('$2')}`);
    console.log('\nTesting common passwords...\n');

    let foundMatch = false;
    for (const pwd of testPasswords) {
        const isMatch = await bcrypt.compare(pwd, user.password);
        console.log(`  "${pwd}" -> ${isMatch ? '✅ MATCH!' : '❌ no match'}`);
        if (isMatch) {
            foundMatch = true;
            console.log(`\n🎉 PASSWORD FOUND: "${pwd}"\n`);
        }
    }

    if (!foundMatch) {
        console.log('\n❌ None of the test passwords matched.');
        console.log('\nWould you like to reset the password? Run:');
        console.log(`  node scripts/reset_user_password.js ${mobile} "NewPassword123"`);
    }

    await connection.end();
}

checkUserPassword().catch(console.error);
