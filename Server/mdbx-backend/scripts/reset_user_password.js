const pool = require('../src/db');
const { hashPassword } = require('../src/utils/hash');

async function resetUserPassword() {
    const mobile = process.argv[2];
    const newPassword = process.argv[3];

    if (!mobile || !newPassword) {
        console.log('Usage: node reset_user_password.js <mobile> <new_password>');
        console.log('Example: node reset_user_password.js 2349116896136 "Adunni<3"');
        process.exit(1);
    }

    try {
        // Check if user exists
        const [users] = await pool.query('SELECT id, mobile, firstname, surname FROM user WHERE mobile = ?', [mobile]);

        if (users.length === 0) {
            console.log(`❌ User not found with mobile: ${mobile}`);
            process.exit(1);
        }

        const user = users[0];
        console.log(`\n📱 Found user: ${user.firstname} ${user.surname} (${user.mobile})`);
        console.log(`🔑 New password: ${newPassword}`);

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);
        console.log(`🔐 Hashed password: ${hashedPassword}`);

        // Update the password
        await pool.query('UPDATE user SET password = ? WHERE mobile = ?', [hashedPassword, mobile]);

        console.log(`\n✅ Password successfully reset for user ${mobile}`);
        console.log(`\nYou can now login with:`);
        console.log(`  Mobile: ${mobile}`);
        console.log(`  Password: ${newPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting password:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

resetUserPassword();
