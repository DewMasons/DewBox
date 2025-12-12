const mysql = require('mysql2/promise');
require('dotenv').config();

async function getAllUserPasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('=== ALL USER ACCOUNTS ===\n');

    const [users] = await connection.query('SELECT id, name, mobile, email, password FROM user ORDER BY name');

    console.log(`Total users: ${users.length}\n`);

    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Mobile: ${user.mobile}`);
        console.log(`   Email: ${user.email || 'N/A'}`);
        console.log(`   Password Hash: ${user.password}`);
        console.log(`   Is Hashed: ${user.password && user.password.startsWith('$2') ? 'YES' : 'NO'}`);
        console.log('');
    });

    // Note: We can't reverse bcrypt hashes, so we can only show what we know from backup files
    console.log('=== KNOWN PASSWORDS (from backup files) ===\n');
    console.log('Mobile: 2349116896136 (JOSHUA OLUDIMU)');
    console.log('Password: "Flugel@07"');
    console.log('');
    console.log('Mobile: 2348153478944, 2348146007275 (Subscribers)');
    console.log('Password: "Ephata@John1010B" (now hashed)');
    console.log('');
    console.log('Note: Other passwords were set during registration and cannot be retrieved from hashes.');

    await connection.end();
}

getAllUserPasswords().catch(console.error);
