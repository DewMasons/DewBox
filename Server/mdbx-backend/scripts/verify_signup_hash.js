const authService = require('../src/services/authService');
const pool = require('../src/db');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'verify_signup_output.txt');

function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

async function verifySignupHash() {
    fs.writeFileSync(logFile, 'Verifying signup password hashing...\n');
    log('Verifying signup password hashing...');

    const testUser = {
        mobile: '2349999999999', // Test number
        password: 'TestPassword123!',
        firstname: 'Test',
        surname: 'User',
        email: 'test.hash@example.com',
        address1: '123 Test St',
        country: 'Nigeria',
        state: 'Lagos',
        city: 'Ikeja',
        gender: 'Male',
        dob: '1990-01-01',
        currency: 'NGN',
        alternatePhone: '2348888888888',
        referral: '',
        referralPhone: '',
        nextOfKinName: 'Kin Name',
        nextOfKinContact: '2347777777777',
        othername: ''
    };

    try {
        // 1. Clean up potential existing test user
        log('Cleaning up existing test user...');
        await pool.query('DELETE FROM user WHERE mobile = ?', [testUser.mobile]);
        await pool.query('DELETE FROM subscribers WHERE mobile = ?', [testUser.mobile]);
        await pool.query('DELETE FROM users WHERE mobile = ?', [testUser.mobile]);

        // 2. Create user via AuthService (which should hash the password)
        log('Creating test user...');
        const { user } = await authService.createUser(testUser);

        log('User created: ' + user.id);

        // 3. Verify returned user object
        if (user.password && !user.password.startsWith('$2')) {
            log('FAIL: Returned user password is NOT hashed: ' + user.password);
        } else {
            log('PASS: Returned user password appears hashed.');
        }

        // 4. Verify database record
        const [rows] = await pool.query('SELECT password FROM user WHERE mobile = ?', [testUser.mobile]);
        if (rows.length === 0) {
            log('FAIL: User not found in DB.');
        } else {
            const dbPassword = rows[0].password;
            if (dbPassword.startsWith('$2')) {
                log('PASS: Database password is hashed: ' + dbPassword);
            } else {
                log('FAIL: Database password is NOT hashed: ' + dbPassword);
            }
        }

        // Cleanup
        log('Cleaning up...');
        await pool.query('DELETE FROM user WHERE mobile = ?', [testUser.mobile]);
        await pool.query('DELETE FROM subscribers WHERE mobile = ?', [testUser.mobile]);
        await pool.query('DELETE FROM users WHERE mobile = ?', [testUser.mobile]);

        log('Verification complete.');
        process.exit(0);
    } catch (error) {
        log('Verification failed: ' + error.message);
        process.exit(1);
    } finally {
        pool.end();
    }
}

verifySignupHash();
