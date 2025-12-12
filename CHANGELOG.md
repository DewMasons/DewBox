# Changelog - December 12, 2025

## Security & Authentication Fixes

### Password Hashing Issue Fixed
- **Problem:** Subscribers table had 24 records with plain text passwords
- **Solution:** All passwords now properly hashed using bcrypt
- **Affected:** Mobile numbers 2348153478944 and 2348146007275
- **Password found:** `Ephata@John1010B` (now hashed)

### Mobile Number Normalization
- **Problem:** Inconsistent mobile number formats (some with `0` prefix, others with `234`)
- **Solution:** All mobile numbers normalized to `234XXXXXXXXXX` format
- **Impact:** Login now works consistently regardless of input format
- **Updated:** 3 users in `user` table, 3 in `users` table, 3 in `subscribers` table

### Test Account Passwords Set
- John Doe (2348012345678): `Test123!`
- Jane Smith (2348087654321): `Test123!`
- Michael Johnson (2348098765432): `Test123!`

## Feature Updates

### Contribution Cycle - Registration-Based
- **Old System:** ICA period was days 2-11 for all users
- **New System:** Each user's ICA period starts from their registration day
- **Benefits:**
  - Fair 10-day ICA period for everyone
  - No rush at month start
  - Better cash flow distribution
  - Predictable personal cycles

### Database Schema Updates
- Added `createdAt` timestamp to `user` table
- Added `createdAt` timestamp to `subscribers` table
- Automatically set on registration

## Frontend

### Build
- ✅ Production build successful
- Bundle size: 849.86 kB (gzipped: 269.61 kB)
- CSS: 105.89 kB (gzipped: 36.16 kB)

### 404 Protection
- Already implemented with catch-all route
- Redirects to dashboard if authenticated
- Redirects to signin if not authenticated

## API Updates

### GET /contributions/info
Now returns additional fields:
- `registrationDay`: User's registration day of month
- `icaPeriod`: User's personal ICA period (e.g., "Day 12 to Day 21")
- `piggyPeriod`: User's personal PIGGY period

## Scripts Added

### Security Scripts
- `check_all_tables_passwords.js` - Check for unhashed passwords
- `fix_subscribers_passwords.js` - Fix unhashed passwords
- `normalize_mobile_numbers.js` - Normalize mobile number formats
- `set_test_passwords.js` - Set known passwords for test accounts

### Testing Scripts
- `test_auth_flow.js` - Test registration and login flow
- `test_contribution_cycle.js` - Test contribution cycle logic
- `test-deployment.js` - Pre-deployment readiness check

### Utility Scripts
- `add_registration_date.js` - Add createdAt columns
- `list_mobiles.js` - List all mobile numbers
- `check_user_password.js` - Verify user passwords

## Documentation

### New Documents
- `PASSWORD_FIX_REPORT.md` - Password hashing fix details
- `USER_PASSWORDS.md` - Known user credentials
- `LOGIN_CREDENTIALS.md` - All user login information
- `CONTRIBUTION_CYCLE_UPDATE.md` - Contribution cycle changes
- `CONTRIBUTION_QUICK_REFERENCE.md` - Quick reference guide

## Known Credentials

### Main Users
- JOSHUA OLUDIMU: 2349116896136 / `Flugel@07`
- Hakeem Oludimu: 2348153478944 / `Ephata@John1010B`

### Test Users
- All test accounts: password `Test123!`

## Deployment Status
✅ Ready for production deployment
