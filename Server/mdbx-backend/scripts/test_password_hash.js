const bcrypt = require('bcryptjs');

async function testPasswordHash() {
    const storedHash = '$2b$10$2IOWs3c9A7NrgA4PtfrrAuVsiPaxbTzxb.qYW0YBodUnbxFA0d4Q6';
    const testPasswords = [
        'Adunni<3',
        'Adunni&lt;3',
        'Adunni\u003c3',
        'adunni<3',
        'ADUNNI<3',
        'Adunni<3 ',
        ' Adunni<3',
        'Adunni',
    ];

    console.log('Testing password hash against various inputs...\n');
    console.log('Stored hash:', storedHash);
    console.log('\nTesting passwords:');

    for (const password of testPasswords) {
        const isMatch = await bcrypt.compare(password, storedHash);
        console.log(`  "${password}" (length: ${password.length}) -> ${isMatch ? '✅ MATCH' : '❌ no match'}`);
    }

    console.log('\n💡 If none match, the password in the database is different from what you\'re testing.');
    console.log('   Use reset_user_password.js to set a new password.');
}

testPasswordHash();
