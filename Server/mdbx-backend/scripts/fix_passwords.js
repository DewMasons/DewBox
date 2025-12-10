const pool = require('../src/db');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function fixPasswords() {
    console.log('Starting password fix...');
    const connection = await pool.getConnection();

    try {
        const [users] = await connection.query('SELECT id, mobile, password, subscriber_id FROM user');
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            // Check if password is NOT a bcrypt hash
            if (!user.password.startsWith('$2')) {
                console.log(`Fixing password for user: ${user.mobile} (Current: ${user.password})`);

                const hashedPassword = await hashPassword(user.password);

                // Update 'user' table
                await connection.query('UPDATE user SET password = ? WHERE id = ?', [hashedPassword, user.id]);
                console.log('Updated user table.');

                // Update 'subscribers' table
                if (user.subscriber_id) {
                    await connection.query('UPDATE subscribers SET password = ? WHERE id = ?', [hashedPassword, user.subscriber_id]);
                    console.log('Updated subscribers table.');
                }

                // Update 'users' table
                await connection.query('UPDATE users SET password = ? WHERE mobile = ?', [hashedPassword, user.mobile]);
                console.log('Updated users table.');
            } else {
                console.log(`User ${user.mobile} already has hashed password.`);
            }
        }

        console.log('Password fix complete.');
        process.exit(0);
    } catch (error) {
        console.error('Fix failed:', error);
        process.exit(1);
    } finally {
        connection.release();
    }
}

fixPasswords();
