const pool = require('../src/db');
const { hashPassword } = require('../src/utils/hash');

async function migrateData() {
    console.log('Starting data migration (Passwords & Phone Numbers)...');
    const connection = await pool.getConnection();

    try {
        // Fetch all users
        const [users] = await connection.query('SELECT id, mobile, password, subscriber_id FROM user');
        console.log(`Found ${users.length} users to check.`);

        let passwordUpdates = 0;
        let phoneUpdates = 0;

        for (const user of users) {
            let needsUpdate = false;
            let newPassword = user.password;
            let newMobile = user.mobile;

            // 1. Check Password (Hash if not hashed)
            if (!user.password.startsWith('$2')) {
                console.log(`Hashing password for user: ${user.mobile}`);
                newPassword = await hashPassword(user.password);
                needsUpdate = true;
                passwordUpdates++;
            }

            // 2. Check Phone Number (Normalize to 234...)
            // Remove non-digits
            let cleanMobile = user.mobile.replace(/\D/g, '');
            // Convert 0... to 234...
            if (cleanMobile.startsWith('0')) {
                cleanMobile = '234' + cleanMobile.slice(1);
            }

            if (cleanMobile !== user.mobile) {
                console.log(`Normalizing phone for user: ${user.mobile} -> ${cleanMobile}`);
                newMobile = cleanMobile;
                needsUpdate = true;
                phoneUpdates++;
            }

            if (needsUpdate) {
                // Update 'user' table
                await connection.query('UPDATE user SET password = ?, mobile = ? WHERE id = ?', [newPassword, newMobile, user.id]);

                // Update 'subscribers' table if linked
                if (user.subscriber_id) {
                    await connection.query('UPDATE subscribers SET password = ?, mobile = ? WHERE id = ?', [newPassword, newMobile, user.subscriber_id]);
                }

                // Update 'users' table (legacy/validation table)
                // Note: We use the OLD mobile to find the record, then update it
                await connection.query('UPDATE users SET password = ?, mobile = ? WHERE mobile = ?', [newPassword, newMobile, user.mobile]);
            }
        }

        console.log('------------------------------------------------');
        console.log(`Migration complete.`);
        console.log(`Passwords hashed: ${passwordUpdates}`);
        console.log(`Phones normalized: ${phoneUpdates}`);
        console.log('------------------------------------------------');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        connection.release();
    }
}

migrateData();
