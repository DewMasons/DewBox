const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verifyPassword() {
    const mobile = '2349116896136';
    const passwordToTest = 'Flugel@07';

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const [users] = await connection.query('SELECT id, mobile, name, password FROM user WHERE mobile = ?', [mobile]);

    if (users.length === 0) {
        console.log('❌ User not found!');
        await connection.end();
        return;
    }

    const user = users[0];
    console.log(`Testing password for: ${user.name} (${user.mobile})`);
    console.log(`Password to test: "${passwordToTest}"`);
    
    const isMatch = await bcrypt.compare(passwordToTest, user.password);
    
    if (isMatch) {
        console.log(`\n✅ PASSWORD CORRECT: "${passwordToTest}"\n`);
    } else {
        console.log(`\n❌ Password "${passwordToTest}" does NOT match\n`);
    }

    await connection.end();
}

verifyPassword().catch(console.error);
