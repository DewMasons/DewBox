# MyDewbox - Financial Management Platform

A modern, full-stack financial management application with savings tracking, contributions, and payment processing.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Paystack Account (for payments)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd DewBox

# Install backend dependencies
cd Server/mdbx-backend
npm install

# Install frontend dependencies
cd ../../Client/MyDewbox
npm install
```

### Environment Setup

**Backend** (`Server/mdbx-backend/.env`):
```env
# Server
PORT=4000
NODE_ENV=production

# Database (Railway MySQL)
DB_HOST=your_railway_host
DB_PORT=43916
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=railway

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Paystack (LIVE MODE)
PAYSTACK_SECRET_KEY=sk_live_your_actual_live_key

# Frontend URL
FRONTEND_URL=https://your-frontend-url.com

# Admin
ADMIN_USER_ID=your_admin_user_id
```

**Frontend** (`Client/MyDewbox/.env.production`):
```env
VITE_API_URL=https://your-backend-url.com
```

### Database Setup

```bash
cd Server/mdbx-backend

# Run contribution system setup
node scripts/run-contribution-setup.js

# Verify setup
node scripts/verify-contribution-setup.js
```

### Start Application

```bash
# Backend
cd Server/mdbx-backend
npm run dev

# Frontend (new terminal)
cd Client/MyDewbox
npm run dev
```

---

## 📋 Features

### 💰 Financial Management
- **Wallet System**: Main balance for transactions
- **Deposits**: Fund wallet via Paystack
- **Withdrawals**: Transfer to bank accounts
- **Transfers**: Send money to other users

### 🐷 Savings System
- **Piggy Savings**: Monthly savings (stays in wallet)
- **ICA (Investment Cooperative)**: Yearly savings with interest
- **Auto-Detection**: System determines type based on date
- **Progress Tracking**: Visual progress bars and goals

### 📊 Dashboard
- Real-time balance overview
- Savings breakdown (Piggy + ICA)
- Recent activity feed
- Quick actions

### 🔐 Security
- JWT authentication
- Password-protected transactions
- Secure API endpoints
- CORS protection

### 🎨 UI/UX
- Modern, responsive design
- Dark/Light theme support
- Smooth animations
- Mobile-optimized

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- React Query
- React Hook Form
- Framer Motion

**Backend:**
- Node.js
- Express
- MySQL
- JWT
- Bcrypt

**Payment:**
- Paystack API

### Project Structure

```
DewBox/
├── Client/MyDewbox/          # Frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services
│   │   ├── store/            # State management
│   │   └── utils/            # Utilities
│   └── public/
│
├── Server/mdbx-backend/      # Backend
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Data models
│   │   ├── middleware/       # Auth, error handling
│   │   └── services/         # External services
│   └── scripts/              # Setup scripts
│
└── README.md                 # This file
```

---

## 💾 Database Schema

### Key Tables

**user** - User accounts
```sql
id, name, email, mobile, password, balance, subscriber_id
```

**subscribers** - Extended user info
```sql
id, firstname, surname, mobile, address, 
contribution_mode, ica_balance, piggy_balance
```

**contributions** - Savings records
```sql
id, userId, type (ICA/PIGGY), amount, 
contribution_date, year, month, interest_earned
```

**transaction** - All transactions
```sql
id, type, amount, currency, status, userId, createdAt
```

---

## 🎯 Contribution System

### How It Works

**ICA (Investment Cooperative Account)**
- **Period**: Days 2-11 of each month
- **Type**: Yearly commitment
- **Interest**: Yes (applied by admin)
- **Location**: Transfers to admin wallet

**Piggy Savings**
- **Period**: Days 12-31 of each month
- **Type**: Monthly savings
- **Interest**: No
- **Location**: Stays in user wallet (tracked)

### User Settings
- **Auto Mode** (default): Date-based selection
- **All ICA Mode**: All contributions go to ICA

### Admin Features
- View all contributions
- Apply yearly interest to ICA
- Manage user balances
- Monitor system health

---

## 🔌 API Endpoints

### Authentication
```
POST /auth/register    - Register new user
POST /auth/login       - Login user
GET  /auth/check       - Verify token
```

### Users
```
GET    /users/me          - Get current user
GET    /users/subscriber  - Get subscriber info
PATCH  /users/profile     - Update profile
```

### Transactions
```
GET  /users/transactions           - Get transaction history
POST /users/transactions           - Create transaction
GET  /users/transactions/verify/:ref - Verify payment
```

### Contributions
```
POST  /contributions          - Make contribution
GET   /contributions/info     - Get current type info
GET   /contributions/history  - Get contribution history
PATCH /contributions/settings - Update contribution mode
```

### Admin (Protected)
```
GET  /admin/contributions/summary  - Get totals
GET  /admin/users/balances         - Get all user balances
POST /admin/ica/apply-interest     - Apply yearly interest
GET  /admin/wallet                 - Get admin wallet
```

### Banks
```
GET  /banks                    - Get bank list
POST /banks/verify-account     - Verify bank account
```

---

## 🚨 Critical Setup Steps

### 1. Paystack Configuration

**⚠️ IMPORTANT: Business Upgrade Required**

For withdrawals to work, your Paystack account must be upgraded to **Registered Business**.

**Required Documents:**
- CAC Certificate (Business Registration)
- TIN Certificate (Tax ID)
- Valid Government ID
- Proof of Address
- Bank Account Details

**Steps:**
1. Login to https://dashboard.paystack.com/
2. Go to Settings → Business Profile
3. Upload all required documents
4. Submit for verification (1-3 business days)
5. Once approved, withdrawals will work

**See**: `Server/mdbx-backend/PAYSTACK_BUSINESS_UPGRADE_REQUIRED.md`

### 2. Admin User Setup

```bash
# Get your user ID from database
mysql> SELECT id, name, email FROM user WHERE email = 'your@email.com';

# Add to .env
ADMIN_USER_ID=your_user_id_here
```

### 3. Database Migration

```bash
cd Server/mdbx-backend

# Setup contribution system
node scripts/run-contribution-setup.js

# Verify
node scripts/verify-contribution-setup.js
```

---

## 🌐 Deployment

### Backend (Railway/Heroku)

1. **Set Environment Variables**
   - All variables from `.env.example`
   - Use production database credentials
   - Set `NODE_ENV=production`

2. **Deploy**
   ```bash
   git push railway main
   # or
   git push heroku main
   ```

3. **Run Migrations**
   ```bash
   railway run node scripts/run-contribution-setup.js
   # or
   heroku run node scripts/run-contribution-setup.js
   ```

### Frontend (Vercel/Netlify)

1. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

3. **Deploy**
   ```bash
   npm run build
   vercel --prod
   # or
   netlify deploy --prod
   ```

---

## 🧪 Testing

### Backend
```bash
cd Server/mdbx-backend

# Test database connection
node scripts/test-db-connection.js

# Verify contribution setup
node scripts/verify-contribution-setup.js
```

### Frontend
```bash
cd Client/MyDewbox

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Troubleshooting

### Common Issues

**"Account verification unavailable"**
- Paystack API key not configured
- Check `.env` has correct `PAYSTACK_SECRET_KEY`

**"Withdrawal service requires business verification"**
- Paystack account needs upgrade to Registered Business
- See `PAYSTACK_BUSINESS_UPGRADE_REQUIRED.md`

**"Unknown column 'contribution_mode'"**
- Database not set up
- Run `node scripts/run-contribution-setup.js`

**"Invalid password"**
- User entered wrong password for transaction
- Password is required for withdrawals/transfers

**Database connection failed**
- Check database credentials in `.env`
- Verify database server is running
- Check firewall/network settings

---

## 📊 Monitoring

### Key Metrics
- Transaction success rate
- User registration rate
- Contribution frequency
- Withdrawal processing time
- API response times

### Logs
```bash
# Backend logs
cd Server/mdbx-backend
npm run dev  # Watch console

# Check Paystack dashboard
https://dashboard.paystack.com/
```

---

## 🔒 Security Best Practices

1. **Never commit sensitive data**
   - Keep `.env` in `.gitignore`
   - Use environment variables
   - Rotate keys regularly

2. **Use HTTPS in production**
   - Enable SSL/TLS
   - Set secure cookies
   - Use CORS properly

3. **Validate all inputs**
   - Frontend validation
   - Backend validation
   - SQL injection prevention

4. **Monitor for suspicious activity**
   - Failed login attempts
   - Large transactions
   - Unusual patterns

---

## 📞 Support

### Documentation
- Contribution System: `Server/mdbx-backend/CONTRIBUTION_SYSTEM.md`
- Paystack Setup: `Server/mdbx-backend/PAYSTACK_LIVE_SETUP.md`
- Withdrawal System: `Server/mdbx-backend/WITHDRAWAL_SYSTEM_COMPLETE.md`

### External Resources
- Paystack Docs: https://paystack.com/docs
- Railway Docs: https://docs.railway.app
- React Query: https://tanstack.com/query

---

## 📝 License

Proprietary - All rights reserved

---

## 🎉 Credits

Built with ❤️ using modern web technologies

---

**Last Updated**: November 23, 2025  
**Version**: 1.0.0  
**Status**: Production Ready 🚀
