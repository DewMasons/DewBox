const pool = require('../src/db');
const { hashPassword } = require('../src/utils/hash');

async function migratePasswords() {
    console.log('Starting password migration...');
    const connection = await pool.getConnection();

    try {
        // Fetch all users from the 'user' table
        const [users] = await connection.query('SELECT id, mobile, password, subscriber_id FROM user');
        console.log(`Found ${users.length} users to check.`);

        let updatedCount = 0;

        for (const user of users) {
            // Check if password is NOT hashed (bcrypt hashes start with $2)
            if (!user.password.startsWith('$2')) {
                console.log(`Hashing password for user: ${user.mobile}`);

                const hashedPassword = await hashPassword(user.password);

                // Update 'user' table
                await connection.query('UPDATE user SET password = ? WHERE id = ?', [hashedPassword, user.id]);

                // Update 'subscribers' table if linked
                if (user.subscriber_id) {
                    await connection.query('UPDATE subscribers SET password = ? WHERE id = ?', [hashedPassword, user.subscriber_id]);
                }

                // Update 'users' table (legacy/validation table)
                await connection.query('UPDATE users SET password = ? WHERE mobile = ?', [hashedPassword, user.mobile]);

                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} users.`);
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        connection.release();
    }
}

migratePasswords();
