# 🏦 Contribution System - Complete Documentation

## 📋 Overview

Two types of contributions with different behaviors:

| Type | Period | Commitment | Interest | Location |
|------|--------|------------|----------|----------|
| **ICA** | Days 2-11 | Yearly | ✅ Yes | Admin Wallet |
| **Piggy** | Days 12-31 | Monthly | ❌ No | User Wallet (tracked) |

---

## 🗓️ How It Works

### Date-Based Contribution Types

```
Day 1:      Monthly Fee (Reserved)
Days 2-11:  ICA Period (Investment Cooperative Account)
Days 12-31: Piggy Period (Piggy Savings)
```

### 📈 ICA (Investment Cooperative Account)
- ✅ **Yearly commitment** - Locked for 1 year
- ✅ **Earns interest** - Applied annually by admin
- ✅ **Transfers to admin wallet** - Immediately on contribution
- ✅ **Withdraw at year end** - After 12 months

**Example:**
```
User contributes ₦10,000 on Day 5
→ ₦10,000 deducted from user wallet
→ ₦10,000 added to admin wallet
→ User's ICA balance: ₦10,000
→ At year end with 10% interest: ₦11,000
```

### 🐷 Piggy Savings
- ✅ **Monthly savings** - Flexible withdrawals
- ❌ **No interest** - Simple savings
- ✅ **Stays in user wallet** - Just tracked, not transferred
- ✅ **Withdraw at month end** - After 30 days

**Example:**
```
User contributes ₦5,000 on Day 15
→ ₦5,000 stays in user wallet (tracked)
→ User's Piggy balance: ₦5,000
→ Can withdraw at month end
```

---

## ⚙️ User Settings

Users can change their contribution mode in Profile settings:

| Mode | Behavior | Days 2-11 | Days 12-31 |
|------|----------|-----------|------------|
| `auto` | Date-based (default) | ICA | Piggy |
| `all_ica` | Always ICA | ICA | ICA |

**Note:** `all_piggy` mode is NOT allowed (business rule)

---

## 🗄️ Database Schema

### Subscribers Table Additions
```sql
ALTER TABLE subscribers 
ADD COLUMN contribution_mode ENUM('auto', 'all_ica') DEFAULT 'auto',
ADD COLUMN ica_balance DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN piggy_balance DECIMAL(10, 2) DEFAULT 0.00;
```

### Contributions Table (New)
```sql
CREATE TABLE contributions (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    type ENUM('ICA', 'PIGGY') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    contribution_date DATE NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    interest_earned DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    createdAt DATETIME(6) NOT NULL,
    updatedAt DATETIME(6) NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);
```

### Transaction Table Update
```sql
ALTER TABLE transaction 
MODIFY COLUMN type ENUM('contribution','withdrawal','ica','piggy','ICA','PIGGY');
```

---

## 🔌 API Endpoints

### 👤 User Endpoints

#### **POST /contributions**
Create a new contribution

**Request:**
```json
{
  "amount": 5000,
  "description": "Monthly savings"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "ICA contribution successful",
  "data": {
    "type": "ICA",
    "amount": 5000,
    "description": "Yearly investment with interest",
    "year": 2025,
    "month": 11
  }
}
```

---

#### **GET /contributions/info**
Get current contribution type info

**Response:**
```json
{
  "status": "success",
  "data": {
    "type": "ICA",
    "mode": "auto",
    "dayOfMonth": 5,
    "description": "Investment Cooperative Account - Yearly commitment with interest"
  }
}
```

---

#### **GET /contributions/history**
Get user's contribution history

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "type": "ICA",
      "amount": 5000,
      "contribution_date": "2025-11-05",
      "year": 2025,
      "month": 11,
      "interest_earned": 0,
      "createdAt": "2025-11-05T10:30:00"
    }
  ]
}
```

---

#### **PATCH /contributions/settings**
Update contribution mode

**Request:**
```json
{
  "mode": "all_ica"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Contribution mode updated",
  "data": {
    "mode": "all_ica"
  }
}
```

---

### 🔐 Admin Endpoints

All admin endpoints require authentication and admin privileges.

#### **GET /admin/contributions/summary**
Get total ICA and Piggy contributions

**Response:**
```json
{
  "status": "success",
  "data": {
    "ica": {
      "total": 150000,
      "thisMonth": 25000
    },
    "piggy": {
      "total": 80000,
      "thisMonth": 15000
    }
  }
}
```

---

#### **GET /admin/users/balances**
Get all users' contribution balances

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "balance": 50000,
      "ica_balance": 30000,
      "piggy_balance": 10000,
      "contribution_mode": "auto"
    }
  ]
}
```

---

#### **POST /admin/ica/apply-interest**
Apply yearly interest to ICA accounts

**Request:**
```json
{
  "interestRate": 10
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Interest applied to 25 users",
  "data": {
    "rate": "10%",
    "totalInterest": 15000,
    "usersUpdated": 25,
    "updates": [
      {
        "userId": "user-uuid",
        "interest": 3000
      }
    ]
  }
}
```

---

#### **GET /admin/wallet**
Get admin wallet balance

**Response:**
```json
{
  "status": "success",
  "data": {
    "balance": 500000
  }
}
```

---

## 🚀 Setup Instructions

### 1. Run Database Setup
```bash
cd Server/mdbx-backend
node scripts/run-contribution-setup.js
```

This will:
- Add `contribution_mode`, `ica_balance`, `piggy_balance` columns to `subscribers` table
- Create `contributions` table
- Update `transaction` table to support ICA/PIGGY types
- Initialize existing subscribers with default values

### 2. Configure Admin User
Add to `.env`:
```env
ADMIN_USER_ID=your_actual_user_id
```

Get your user ID from the database:
```sql
SELECT id, name, email FROM user WHERE email = 'your@email.com';
```

### 3. Restart Server
```bash
npm run dev
```

---

## 🎨 Frontend Integration

The Contribute page (`Client/MyDewbox/src/pages/Contribute.jsx`) automatically:

1. **Fetches contribution info** on load
2. **Displays current type** (ICA or Piggy)
3. **Shows appropriate UI**:
   - Blue theme for ICA
   - Yellow theme for Piggy
4. **Explains the difference** to users
5. **Handles success states** with type-specific messages

### UI Features:
- 📊 Real-time type detection
- 🎨 Color-coded cards (Blue = ICA, Yellow = Piggy)
- ℹ️ Detailed descriptions
- ✅ Success animations
- 🔄 Auto-refresh after contribution

---

## 💰 Interest Calculation

Admin can apply yearly interest to all ICA accounts:

```javascript
// Example: Apply 10% interest
POST /admin/ica/apply-interest
{
  "interestRate": 10
}

// Result:
// User with ₦10,000 ICA balance
// → Receives ₦1,000 interest
// → New ICA balance: ₦11,000
```

**Process:**
1. Fetches all users with ICA balance > 0
2. Calculates interest: `balance * (rate / 100)`
3. Updates ICA balance
4. Records interest in contributions table
5. Returns summary of all updates

---

## 📝 Important Notes

- ⚠️ **Day 1 is reserved** for monthly fees
- 💸 **ICA transfers immediately** to admin wallet
- 🏦 **Piggy stays in user wallet** (just tracked)
- 🚫 **No "all_piggy" mode** allowed
- 📈 **Interest only on ICA** contributions
- 🔒 **Admin routes protected** by middleware
- 📊 **All transactions recorded** in database

---

## 🧪 Testing

### Test ICA Contribution (Days 2-11)
```bash
curl -X POST http://localhost:4000/contributions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "description": "Test ICA"}'
```

### Test Piggy Contribution (Days 12-31)
```bash
curl -X POST http://localhost:4000/contributions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 3000, "description": "Test Piggy"}'
```

### Check Contribution Info
```bash
curl http://localhost:4000/contributions/info \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🆘 Troubleshooting

### Issue: "Insufficient balance"
- Check user wallet balance
- Ensure amount is available

### Issue: "Admin not configured"
- Set `ADMIN_USER_ID` in `.env`
- Restart server

### Issue: "Access denied. Admin only"
- Verify you're using admin user token
- Check `ADMIN_USER_ID` matches your user ID

### Issue: Columns don't exist
- Run setup script: `node scripts/run-contribution-setup.js`
- Check database connection

---

**Last Updated:** November 23, 2025
