const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '../views/apiDocs.html');
  
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    // Fallback inline HTML
    res.send(generateAPIDocsHTML());
  }
});

function generateAPIDocsHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MyDewbox API Documentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .header {
      text-align: center;
      color: white;
      padding: 60px 20px;
      margin-bottom: 40px;
    }
    .header h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 15px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .header p { font-size: 1.2rem; opacity: 0.95; }
    .status {
      background: #10b981;
      color: white;
      padding: 10px 25px;
      border-radius: 25px;
      display: inline-block;
      margin-top: 20px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    }
    
    .nav {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      position: sticky;
      top: 20px;
      z-index: 100;
    }
    .nav h3 { color: #667eea; margin-bottom: 15px; }
    .nav-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .nav-link {
      padding: 8px 16px;
      background: #f3f4f6;
      border-radius: 8px;
      text-decoration: none;
      color: #667eea;
      font-weight: 600;
      transition: all 0.3s;
    }
    .nav-link:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
    
    .card {
      background: white;
      border-radius: 16px;
      padding: 35px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .card h2 {
      color: #667eea;
      font-size: 2rem;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .card-desc {
      color: #6b7280;
      margin-bottom: 25px;
      font-size: 1.05rem;
    }
    
    .endpoint {
      background: #f8fafc;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      transition: all 0.3s;
    }
    .endpoint:hover {
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      transform: translateX(5px);
    }
    
    .method {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.85rem;
      margin-right: 12px;
      text-transform: uppercase;
    }
    .get { background: #10b981; color: white; }
    .post { background: #3b82f6; color: white; }
    .put { background: #f59e0b; color: white; }
    .patch { background: #8b5cf6; color: white; }
    .delete { background: #ef4444; color: white; }
    
    code {
      background: #1e293b;
      color: #10b981;
      padding: 3px 10px;
      border-radius: 5px;
      font-size: 0.95rem;
      font-family: 'Courier New', monospace;
    }
    
    .endpoint-desc {
      margin-top: 10px;
      color: #4b5563;
      font-size: 0.95rem;
    }
    
    .auth-required {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      margin-left: 10px;
      font-weight: 600;
    }
    
    .relationship {
      background: #ede9fe;
      border-left: 4px solid #8b5cf6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .relationship h4 {
      color: #8b5cf6;
      margin-bottom: 8px;
    }
    .relationship ul {
      margin-left: 20px;
      color: #6b7280;
    }
    
    .flow-diagram {
      background: #f0fdf4;
      border: 2px solid #10b981;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      font-family: monospace;
      font-size: 0.9rem;
      overflow-x: auto;
    }
    
    @media (max-width: 768px) {
      .header h1 { font-size: 2rem; }
      .card { padding: 20px; }
      .nav-links { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 MyDewbox API</h1>
      <p>Complete API Documentation & Relationships</p>
      <span class="status">✓ Online & Secure</span>
    </div>

    <div class="nav">
      <h3>📑 Quick Navigation</h3>
      <div class="nav-links">
        <a href="#auth" class="nav-link">🔐 Authentication</a>
        <a href="#contributions" class="nav-link">💰 Contributions</a>
        <a href="#users" class="nav-link">👤 Users</a>
        <a href="#subscribers" class="nav-link">📋 Subscribers</a>
        <a href="#transactions" class="nav-link">💸 Transactions</a>
        <a href="#wallets" class="nav-link">👛 Wallets</a>
        <a href="#coops" class="nav-link">🏢 Cooperatives</a>
        <a href="#grants" class="nav-link">🎁 Grants</a>
        <a href="#banks" class="nav-link">🏦 Banks</a>
        <a href="#lookups" class="nav-link">📚 Lookups</a>
        <a href="#admin" class="nav-link">⚙️ Admin</a>
      </div>
    </div>

    <!-- Authentication -->
    <div class="card" id="auth">
      <h2>🔐 Authentication</h2>
      <p class="card-desc">User registration and login. All authenticated endpoints require JWT token in Authorization header.</p>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/auth/register</code>
        <p class="endpoint-desc">Register a new user account. Creates both user and subscriber records.</p>
      </div>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/auth/login</code>
        <p class="endpoint-desc">Login with mobile number and password. Returns JWT token (expires in 7 days).</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/auth/check</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Verify if current token is valid.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Creates:</strong> user record + subscriber record</li>
          <li><strong>Returns:</strong> JWT token for subsequent requests</li>
          <li><strong>Used by:</strong> All protected endpoints</li>
        </ul>
      </div>

      <div class="flow-diagram">
        <strong>Registration Flow:</strong><br>
        POST /auth/register → Creates subscriber → Creates user → Links them → Returns token<br><br>
        <strong>Login Flow:</strong><br>
        POST /auth/login → Validates credentials → Generates JWT → Returns token (7 days expiry)
      </div>
    </div>

    <!-- Contributions (Main Feature) -->
    <div class="card" id="contributions">
      <h2>💰 Contributions (Main Feature)</h2>
      <p class="card-desc"><strong>The core of MyDewbox!</strong> Users make contributions which are split into 3 types: PIGGY (savings), ICA (investment), and FEE (platform fee).</p>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/contributions</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Create a contribution. Type (PIGGY/ICA/FEE) is auto-determined based on date and user settings.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/contributions/info</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Get current contribution type info (what type will be used today).</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/contributions/history</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Get user's contribution history.</p>
      </div>
      
      <div class="endpoint">
        <span class="method patch">PATCH</span>
        <code>/contributions/settings</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Update contribution mode (auto or all_ica).</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Updates:</strong> subscriber_balance (ica_balance or piggy_balance)</li>
          <li><strong>Creates:</strong> contribution record + transaction record</li>
          <li><strong>ICA:</strong> Transfers money to admin wallet</li>
          <li><strong>PIGGY:</strong> Money stays in user wallet (just tracked)</li>
          <li><strong>FEE:</strong> Transfers to admin wallet</li>
        </ul>
      </div>

      <div class="flow-diagram">
        <strong>Contribution Types:</strong><br>
        Day 1: FEE (platform fee)<br>
        Days 2-11: ICA (Investment Cooperative Account - yearly, with interest)<br>
        Days 12-31: PIGGY (Monthly savings - no interest)<br><br>
        <strong>ICA Flow:</strong><br>
        User contributes → Deduct from user wallet → Add to admin wallet → Update ICA balance<br><br>
        <strong>PIGGY Flow:</strong><br>
        User contributes → Money stays in wallet → Update PIGGY balance (tracking only)
      </div>
    </div>

    <!-- Users -->
    <div class="card" id="users">
      <h2>👤 Users</h2>
      <p class="card-desc">User account management and profile operations.</p>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/users/profile</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Get current user's profile information.</p>
      </div>
      
      <div class="endpoint">
        <span class="method put">PUT</span>
        <code>/users/profile</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Update user profile.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/users/balance</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Get user's wallet balance.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Linked to:</strong> subscriber (one-to-one)</li>
          <li><strong>Has many:</strong> contributions, transactions</li>
          <li><strong>Balance:</strong> Main wallet balance (for contributions)</li>
        </ul>
      </div>
    </div>

    <!-- Subscribers -->
    <div class="card" id="subscribers">
      <h2>📋 Subscribers</h2>
      <p class="card-desc">Detailed subscriber information including personal details, balances, and beneficiaries.</p>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/subscribers</code>
        <p class="endpoint-desc">Create a new subscriber (usually done during registration).</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/subscribers/:id</code>
        <p class="endpoint-desc">Get subscriber details including balance.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/subscribers/:id/balance</code>
        <p class="endpoint-desc">Get subscriber's contribution balances (ICA, PIGGY, etc.).</p>
      </div>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/subscribers/:id/beneficiaries</code>
        <p class="endpoint-desc">Add a beneficiary to subscriber account.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/subscribers/:id/beneficiaries</code>
        <p class="endpoint-desc">Get all beneficiaries for a subscriber.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Linked to:</strong> user (one-to-one)</li>
          <li><strong>Has:</strong> subscriber_balance (ICA, PIGGY balances)</li>
          <li><strong>Has many:</strong> beneficiaries</li>
          <li><strong>Tracks:</strong> Personal info, referrals, next of kin</li>
        </ul>
      </div>
    </div>

    <!-- Transactions -->
    <div class="card" id="transactions">
      <h2>💸 Transactions</h2>
      <p class="card-desc">Background transaction records. Users don't directly interact with these - they're created automatically from contributions.</p>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/users/transactions</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Get user's transaction history.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/users/transactions/:id</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Get specific transaction details.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Created by:</strong> Contributions (automatically)</li>
          <li><strong>Belongs to:</strong> user</li>
          <li><strong>Types:</strong> contribution, withdrawal, ica, piggy, fee</li>
          <li><strong>Note:</strong> Internal tracking - users see contributions, not transactions</li>
        </ul>
      </div>

      <div class="flow-diagram">
        <strong>Transaction vs Contribution:</strong><br>
        User makes CONTRIBUTION → System creates TRANSACTION record (background)<br>
        Users interact with: /contributions<br>
        System tracks with: /transactions
      </div>
    </div>

    <!-- Wallets -->
    <div class="card" id="wallets">
      <h2>👛 Wallets</h2>
      <p class="card-desc">Wallet management for subscribers. Separate from main user balance.</p>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/wallets</code>
        <p class="endpoint-desc">Create a wallet for a subscriber.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/wallets/:subscriberId</code>
        <p class="endpoint-desc">Get wallet details.</p>
      </div>
      
      <div class="endpoint">
        <span class="method put">PUT</span>
        <code>/wallets/:subscriberId/balance</code>
        <p class="endpoint-desc">Update wallet balance (add or subtract).</p>
      </div>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/wallets/payments</code>
        <p class="endpoint-desc">Create a wallet payment record.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Belongs to:</strong> subscriber</li>
          <li><strong>Has many:</strong> wallet payments</li>
          <li><strong>Tracks:</strong> Wallet balance, payments, invoices</li>
        </ul>
      </div>
    </div>

    <!-- Cooperatives -->
    <div class="card" id="coops">
      <h2>🏢 Cooperatives</h2>
      <p class="card-desc">Cooperative organization management with members, loans, and investments.</p>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/coops</code>
        <p class="endpoint-desc">Create a new cooperative.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/coops/:id</code>
        <p class="endpoint-desc">Get cooperative details.</p>
      </div>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/coops/members</code>
        <p class="endpoint-desc">Add a member to a cooperative.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/coops/:coopId/members</code>
        <p class="endpoint-desc">Get all members of a cooperative.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Has many:</strong> coop members</li>
          <li><strong>Has type:</strong> coop_type (lookup)</li>
          <li><strong>Members track:</strong> Loans, investments, subscriptions</li>
          <li><strong>Can link to:</strong> subscribers (via coop_mdbx_subscriber_id)</li>
        </ul>
      </div>
    </div>

    <!-- Grants -->
    <div class="card" id="grants">
      <h2>🎁 Grants</h2>
      <p class="card-desc">Yearly grant allocation and distribution tracking.</p>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/grants</code>
        <p class="endpoint-desc">Create yearly grant configuration.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/grants/:year</code>
        <p class="endpoint-desc">Get grant configuration for a specific year.</p>
      </div>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/grants/:year/record</code>
        <p class="endpoint-desc">Record a grant distribution.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Tracks:</strong> 5 grant types (cash01-04, egfed)</li>
          <li><strong>Limits:</strong> Year limits and YTD given counts</li>
          <li><strong>Per year:</strong> One record per year</li>
        </ul>
      </div>
    </div>

    <!-- Banks -->
    <div class="card" id="banks">
      <h2>🏦 Banks</h2>
      <p class="card-desc">Bank integration for account verification and transactions.</p>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/banks</code>
        <p class="endpoint-desc">Get list of supported banks.</p>
      </div>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/banks/verify-account</code>
        <span class="auth-required">🔒 Auth Required</span>
        <p class="endpoint-desc">Verify bank account details.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Used for:</strong> Funding wallets, withdrawals</li>
          <li><strong>Integrates with:</strong> Paystack API</li>
        </ul>
      </div>
    </div>

    <!-- Lookups -->
    <div class="card" id="lookups">
      <h2>📚 Lookup Tables</h2>
      <p class="card-desc">Reference data for dropdowns and categorization.</p>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/lookups/coop-types</code>
        <p class="endpoint-desc">Get all cooperative types.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/lookups/transaction-types</code>
        <p class="endpoint-desc">Get all transaction types.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/lookups/device-types</code>
        <p class="endpoint-desc">Get all device types.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/lookups/service-channels</code>
        <p class="endpoint-desc">Get all service channels.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Used by:</strong> Coops, transactions, analytics</li>
          <li><strong>Purpose:</strong> Categorization and reporting</li>
        </ul>
      </div>
    </div>

    <!-- Admin -->
    <div class="card" id="admin">
      <h2>⚙️ Admin</h2>
      <p class="card-desc">Administrative operations (requires admin privileges).</p>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/admin/contributions/summary</code>
        <span class="auth-required">🔒 Admin Only</span>
        <p class="endpoint-desc">Get total ICA and PIGGY contributions.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/admin/users/balances</code>
        <span class="auth-required">🔒 Admin Only</span>
        <p class="endpoint-desc">Get all users' contribution balances.</p>
      </div>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/admin/ica/apply-interest</code>
        <span class="auth-required">🔒 Admin Only</span>
        <p class="endpoint-desc">Apply yearly interest to all ICA accounts.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/admin/wallet</code>
        <span class="auth-required">🔒 Admin Only</span>
        <p class="endpoint-desc">Get admin wallet balance.</p>
      </div>

      <div class="relationship">
        <h4>🔗 Relationships:</h4>
        <ul>
          <li><strong>Manages:</strong> All ICA funds (in admin wallet)</li>
          <li><strong>Can:</strong> Apply interest, view all balances</li>
          <li><strong>Access:</strong> Set ADMIN_USER_ID in environment</li>
        </ul>
      </div>
    </div>

    <!-- Overall System Flow -->
    <div class="card">
      <h2>🔄 Complete System Flow</h2>
      <div class="flow-diagram">
        <strong>1. User Registration:</strong><br>
        POST /auth/register → Creates user + subscriber → Returns JWT token<br><br>
        
        <strong>2. User Login:</strong><br>
        POST /auth/login → Validates credentials → Returns JWT token (7 days)<br><br>
        
        <strong>3. Making a Contribution:</strong><br>
        POST /contributions → Determines type (PIGGY/ICA/FEE) → Updates balances → Creates transaction<br>
        ├─ If ICA: Transfer to admin wallet + Update ICA balance<br>
        ├─ If PIGGY: Keep in user wallet + Update PIGGY balance<br>
        └─ If FEE: Transfer to admin wallet<br><br>
        
        <strong>4. Viewing History:</strong><br>
        GET /contributions/history → Shows all contributions<br>
        GET /users/transactions → Shows background transactions<br><br>
        
        <strong>5. Admin Operations:</strong><br>
        POST /admin/ica/apply-interest → Applies interest to all ICA accounts<br>
        GET /admin/contributions/summary → Views total contributions
      </div>
    </div>

    <!-- Security -->
    <div class="card">
      <h2>🔒 Security Features</h2>
      <ul style="margin-left: 20px; color: #4b5563;">
        <li>✅ JWT Authentication (7-day expiration)</li>
        <li>✅ Rate Limiting (5 login attempts per 15 min)</li>
        <li>✅ Security Headers (helmet.js)</li>
        <li>✅ HTTPS Enforcement (production)</li>
        <li>✅ Password Hashing (bcrypt)</li>
        <li>✅ SQL Injection Protection (parameterized queries)</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; color: white; padding: 40px 20px; margin-top: 40px;">
      <p style="font-size: 1.1rem; margin-bottom: 10px;">📚 For detailed documentation, see:</p>
      <p style="opacity: 0.9;">API_DOCUMENTATION.md | CONTRIBUTION_SYSTEM.md | SECURITY_AUDIT.md</p>
      <p style="margin-top: 20px; opacity: 0.8;">MyDewbox API v1.0.0 | Built with ❤️</p>
    </div>
  </div>
</body>
</html>`;
}

module.exports = router;
