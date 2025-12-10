const pool = require('../src/db');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'db_check_output.txt');

function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

async function checkDb() {
    fs.writeFileSync(logFile, 'Starting DB check...\n');

    const timeout = setTimeout(() => {
        log('Timeout: Database connection took too long.');
        process.exit(1);
    }, 5000);

    try {
        log('Checking database connection...');
        const connection = await pool.getConnection();
        log('Database connected successfully.');
        connection.release();

        log('Fetching users...');
        const [rows] = await pool.query('SELECT * FROM user LIMIT 10');
        log('Users found: ' + rows.length);
        log(JSON.stringify(rows, null, 2));

        clearTimeout(timeout);
        process.exit(0);
    } catch (error) {
        log('Database check failed: ' + error.message);
        clearTimeout(timeout);
        process.exit(1);
    }
}

checkDb();
