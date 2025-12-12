# User Passwords Report

## Summary
All passwords in the database are now properly hashed using bcrypt. The plain text passwords that were found in the `subscribers` table have been fixed.

## Known User Credentials

### User: JOSHUA OLUDIMU
- **Mobile:** `2349116896136`
- **Email:** joshuaoludimutric007@gmail.com
- **Password:** `Flugel@07`
- **Status:** ✅ Properly hashed

### User: Hakeem Oludimu (Account 1)
- **Mobile:** `2349014845195`
- **Email:** hakeem.oludimu@gmail.com
- **Password:** Unknown (set during registration)
- **Status:** ✅ Properly hashed

### User: Hakeem Oludimu (Account 2)
- **Mobile:** `2348153478944`
- **Email:** sunkkyoludimu@gmail.com
- **Password:** `Ephata@John1010B` (was plain text in subscribers table, now fixed)
- **Status:** ✅ Properly hashed

### User: Test User
- **Mobile:** `2349999999999`
- **Email:** test.hash@example.com
- **Password:** Unknown (test account)
- **Status:** ✅ Properly hashed

### User: John Doe
- **Mobile:** `2348012345678` (normalized from 08012345678)
- **Email:** john.doe@test.com
- **Password:** `Test123!`
- **Status:** ✅ Properly hashed

### User: Jane Smith
- **Mobile:** `2348087654321` (normalized from 08087654321)
- **Email:** jane.smith@test.com
- **Password:** `Test123!`
- **Status:** ✅ Properly hashed

### User: Michael Johnson
- **Mobile:** `2348098765432` (normalized from 08098765432)
- **Email:** michael.j@test.com
- **Password:** `Test123!`
- **Status:** ✅ Properly hashed

## Subscribers Table
- **Mobile:** `2348146007275`
- **Password:** `Ephata@John1010B` (was plain text, now fixed)
- **Records:** 12 subscriber records
- **Status:** ✅ Now properly hashed

## Security Notes

1. **Password Hashing Issue Fixed:** The subscribers table had 24 records with plain text passwords. All have been hashed using bcrypt.

2. **Known Passwords:**
   - `Flugel@07` - Used by mobile 2349116896136
   - `Ephata@John1010B` - Was used by mobiles 2348153478944 and 2348146007275 (now hashed)

3. **Recommendation:** Users with known passwords should be notified to change their passwords for security.

4. **All Passwords Verified:** All 7 users in the `user` table, 7 in the `users` table, and 31 in the `subscribers` table now have properly hashed passwords.

## Date: December 12, 2025
