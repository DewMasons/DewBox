# Database Seeding Script

## Overview
This script clears the database and seeds it with test users. **It can only be run once** to prevent accidental data loss.

## Features
- ✅ Clears all existing data from the database
- ✅ Adds 3 test users with realistic data
- ✅ Creates a lock mechanism to prevent re-running
- ✅ After first run, users can only be added via the registration page

## Usage

### Run the script:
```bash
cd Server/mdbx-backend
node scripts/seed-test-users.js
```

## Test User Credentials

After running the script, you can login with these credentials:

### User 1 - John Doe
- **Email:** john.doe@test.com
- **Mobile:** 08012345678
- **Password:** Test123!
- **Balance:** ₦50,000
- **Esusu Balance:** ₦25,000

### User 2 - Jane Smith
- **Email:** jane.smith@test.com
- **Mobile:** 08087654321
- **Password:** Test123!
- **Balance:** ₦75,000
- **Esusu Balance:** ₦40,000

### User 3 - Michael Johnson
- **Email:** michael.j@test.com
- **Mobile:** 08098765432
- **Password:** Test123!
- **Balance:** ₦100,000
- **Esusu Balance:** ₦60,000

## Security Features

### One-Time Execution
The script creates a `script_lock` table that prevents it from running more than once:
- First run: ✅ Clears database and adds test users
- Subsequent runs: ❌ Blocked with error message

### Lock Mechanism
```sql
CREATE TABLE script_lock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lock_name VARCHAR(100) UNIQUE NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMP NULL,
  locked_by VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## What Gets Cleared

The script clears data from these tables:
1. `transaction` - All transaction records
2. `users` - Validation table
3. `user` - Main user table
4. `subscribers` - Subscriber information

## Adding More Users

After the script has been run once, new users can only be added through:
- ✅ Registration page (`/register`)
- ❌ Direct database scripts (blocked)

## Troubleshooting

### Script Already Run
```
❌ Script has already been run!
⚠️  Test users can only be added once via script.
💡 Use the registration page to add new users.
```
**Solution:** This is intentional. Use the registration page to add more users.

### Database Connection Error
```
❌ Error seeding database:
```
**Solution:** 
1. Check your `.env` file has correct database credentials
2. Ensure the database server is running
3. Verify the database exists

### Missing Dependencies
```
Error: Cannot find module 'bcrypt'
```
**Solution:**
```bash
npm install
```

## Unlocking the Script (Development Only)

⚠️ **WARNING:** Only do this in development if you need to re-seed the database.

```sql
-- Check lock status
SELECT * FROM script_lock WHERE lock_name = 'seed_users';

-- Unlock (use with caution!)
UPDATE script_lock SET is_locked = FALSE WHERE lock_name = 'seed_users';

-- Or delete the lock entirely
DELETE FROM script_lock WHERE lock_name = 'seed_users';
```

## Database Schema

The script expects these tables to exist:
- `subscribers` - User profile information
- `user` - Main user authentication
- `users` - Validation table
- `transaction` - Transaction history

## Environment Variables Required

```env
DB_HOST=your-database-host
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
DB_SSL=true
```

## Script Flow

1. **Connect** to database
2. **Check** for existing lock
3. **Clear** all data (if not locked)
4. **Create** lock table
5. **Insert** test users
6. **Lock** script to prevent future runs
7. **Display** credentials

## Production Considerations

- ⚠️ Never run this script in production
- ⚠️ Always backup your database before running
- ⚠️ The lock mechanism prevents accidental re-runs
- ✅ Use proper user registration flow in production

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify database connection
3. Ensure all dependencies are installed
4. Check that tables exist in the database
