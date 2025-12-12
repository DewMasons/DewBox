# Login Credentials - All Users

## Active User Accounts

### 1. JOSHUA OLUDIMU
- **Mobile:** `2349116896136`
- **Password:** `Flugel@07`
- **Email:** joshuaoludimutric007@gmail.com

### 2. Hakeem Oludimu (Account 1)
- **Mobile:** `2349014845195`
- **Password:** Unknown (set during registration)
- **Email:** hakeem.oludimu@gmail.com

### 3. Hakeem Oludimu (Account 2)
- **Mobile:** `2348153478944`
- **Password:** `Ephata@John1010B`
- **Email:** sunkkyoludimu@gmail.com

### 4. Test User
- **Mobile:** `2349999999999`
- **Password:** Unknown (test account)
- **Email:** test.hash@example.com

### 5. John Doe (Test Account)
- **Mobile:** `2348012345678`
- **Password:** `Test123!`
- **Email:** john.doe@test.com

### 6. Jane Smith (Test Account)
- **Mobile:** `2348087654321`
- **Password:** `Test123!`
- **Email:** jane.smith@test.com

### 7. Michael Johnson (Test Account)
- **Mobile:** `2348098765432`
- **Password:** `Test123!`
- **Email:** michael.j@test.com

## Quick Login Examples

### Using Mobile Number
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile": "2348098765432", "password": "Test123!"}'
```

### Frontend Login
```javascript
const response = await fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mobile: '2348098765432',
    password: 'Test123!'
  })
});
```

## Mobile Number Format

All mobile numbers are now normalized to the format: `234XXXXXXXXXX`

Examples:
- `08012345678` → `2348012345678`
- `+2348012345678` → `2348012345678`
- `2348012345678` → `2348012345678` (already normalized)

## Notes

1. **Mobile numbers** are normalized on login, so you can use either format
2. **Passwords** are case-sensitive
3. **Test accounts** all use password: `Test123!`
4. **JWT tokens** expire after 7 days

## Date Updated: December 12, 2025
