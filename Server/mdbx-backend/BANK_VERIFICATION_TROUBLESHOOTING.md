# 🏦 Bank Account Verification Troubleshooting

## Issue: "Account verification unavailable"

This error appears when the bank account verification fails. Here are the common causes and solutions:

---

## 🔍 Common Causes

### 1. Paystack API Key Not Configured ⚠️ MOST COMMON

**Symptom:** Error message says "Verification service not configured"

**Solution:**
1. Get your live Paystack key from https://dashboard.paystack.com/#/settings/developer
2. Update `Server/mdbx-backend/.env`:
   ```env
   PAYSTACK_SECRET_KEY=sk_live_your_actual_key_here
   ```
3. Restart your server:
   ```bash
   npm run dev
   ```

---

### 2. Invalid Paystack API Key

**Symptom:** Error message says "Invalid Paystack API key"

**Solution:**
- Verify your key starts with `sk_live_` (for live mode)
- Check for extra spaces or characters
- Ensure you copied the complete key
- Try regenerating the key in Paystack dashboard

---

### 3. Invalid Account Details

**Symptom:** Error message says "Could not resolve account"

**Solution:**
- Verify the account number is exactly 10 digits
- Ensure you selected the correct bank
- Check if the account is active
- Try a different account to test

---

### 4. Paystack Service Down

**Symptom:** Generic "Unable to verify account" error

**Solution:**
- Check Paystack status: https://status.paystack.com/
- Wait a few minutes and try again
- Check your internet connection
- Verify server can reach Paystack API

---

## 🧪 Testing Bank Verification

### Test with cURL:

```bash
curl -X POST http://localhost:4000/banks/verify-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accountNumber": "0123456789",
    "bankCode": "058"
  }'
```

### Expected Success Response:

```json
{
  "status": true,
  "message": "Account number resolved",
  "data": {
    "account_number": "0123456789",
    "account_name": "JOHN DOE",
    "bank_id": 9
  }
}
```

### Expected Error Responses:

**API Key Not Configured:**
```json
{
  "status": false,
  "message": "Bank verification service not configured. Please contact administrator."
}
```

**Invalid API Key:**
```json
{
  "status": false,
  "message": "Invalid Paystack API key. Please contact administrator."
}
```

**Account Not Found:**
```json
{
  "status": false,
  "message": "Could not resolve account. Please check account number and bank."
}
```

---

## 🔧 Quick Fix Checklist

- [ ] **Check `.env` file has Paystack key**
  ```bash
  cat Server/mdbx-backend/.env | grep PAYSTACK
  ```

- [ ] **Verify key format**
  - Should start with `sk_live_` for live mode
  - Should be a long string (about 40+ characters)

- [ ] **Restart server after updating `.env`**
  ```bash
  cd Server/mdbx-backend
  npm run dev
  ```

- [ ] **Test with known valid account**
  - Use your own bank account for testing
  - Verify account number is correct

- [ ] **Check server logs**
  - Look for "Account verification error" messages
  - Check for API key errors

---

## 🔍 Debugging Steps

### 1. Check Environment Variable

```bash
# In Server/mdbx-backend directory
node -e "console.log('PAYSTACK_SECRET_KEY:', process.env.PAYSTACK_SECRET_KEY ? 'Set' : 'Not Set')"
```

### 2. Test Paystack Connection

```bash
# Test if Paystack API is reachable
curl -H "Authorization: Bearer YOUR_PAYSTACK_KEY" \
  https://api.paystack.co/bank
```

### 3. Check Server Logs

Look for these error messages:
- "Paystack API key not configured"
- "Invalid key"
- "Could not resolve"
- "Account verification error"

### 4. Verify Bank Code

Common Nigerian bank codes:
- Access Bank: 044
- GTBank: 058
- First Bank: 011
- UBA: 033
- Zenith Bank: 057

Full list: https://paystack.com/docs/api/#miscellaneous-bank

---

## 💡 Pro Tips

### For Development:
1. Use Paystack test mode first (`sk_test_...`)
2. Test with Paystack test accounts
3. Switch to live mode only when ready

### For Production:
1. Always use live keys (`sk_live_...`)
2. Monitor verification success rate
3. Set up error alerts
4. Have fallback for verification failures

### User Experience:
1. Show clear error messages
2. Allow users to proceed even if verification fails
3. Provide manual verification option
4. Display verification status clearly

---

## 🆘 Still Having Issues?

### Check These:

1. **Server Running?**
   ```bash
   curl http://localhost:4000/banks
   ```

2. **Database Connected?**
   - Check server startup logs
   - Verify database credentials

3. **CORS Issues?**
   - Check browser console for CORS errors
   - Verify `FRONTEND_URL` in `.env`

4. **Network Issues?**
   - Can server reach Paystack API?
   - Check firewall settings
   - Verify DNS resolution

### Get Help:

**Paystack Support:**
- Email: support@paystack.com
- Phone: +234 1 888 3888
- Docs: https://paystack.com/docs

**Check Logs:**
```bash
# Server logs
cd Server/mdbx-backend
npm run dev

# Look for errors in console
```

---

## 📝 Error Message Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Verification service not configured" | API key not set | Update `.env` with Paystack key |
| "Invalid Paystack API key" | Wrong or expired key | Get new key from dashboard |
| "Could not resolve account" | Invalid account details | Check account number and bank |
| "Unable to verify account" | Network/API issue | Check Paystack status, retry |
| "Account verification unavailable" | Generic error | Check server logs for details |

---

**Last Updated:** November 23, 2025
