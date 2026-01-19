const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MyDewbox API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 600px;
    }
    h1 {
      font-size: 4rem;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    p {
      font-size: 1.3rem;
      margin-bottom: 40px;
      opacity: 0.95;
    }
    .btn {
      display: inline-block;
      background: white;
      color: #667eea;
      padding: 15px 40px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transition: all 0.3s;
      margin: 10px;
    }
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.3);
    }
    .status {
      background: #10b981;
      padding: 10px 25px;
      border-radius: 25px;
      display: inline-block;
      margin-top: 30px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    }
    .links {
      margin-top: 40px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      justify-content: center;
    }
    .link {
      background: rgba(255,255,255,0.1);
      padding: 10px 20px;
      border-radius: 10px;
      text-decoration: none;
      color: white;
      transition: all 0.3s;
    }
    .link:hover {
      background: rgba(255,255,255,0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 MyDewbox API</h1>
    <p>Complete Financial Management System</p>
    <div class="status">✓ Online & Secure</div>
    
    <div style="margin-top: 50px;">
      <a href="/api-docs" class="btn">📚 View Full API Documentation</a>
      <a href="/health" class="btn">🏥 Health Check</a>
    </div>

    <div class="links">
      <a href="/api-docs#auth" class="link">🔐 Authentication</a>
      <a href="/api-docs#contributions" class="link">💰 Contributions</a>
      <a href="/api-docs#users" class="link">👤 Users</a>
      <a href="/api-docs#subscribers" class="link">📋 Subscribers</a>
      <a href="/api-docs#transactions" class="link">💸 Transactions</a>
      <a href="/api-docs#wallets" class="link">👛 Wallets</a>
      <a href="/api-docs#coops" class="link">🏢 Cooperatives</a>
      <a href="/api-docs#grants" class="link">🎁 Grants</a>
      <a href="/api-docs#banks" class="link">🏦 Banks</a>
      <a href="/api-docs#admin" class="link">⚙️ Admin</a>
    </div>

    <div style="margin-top: 60px; opacity: 0.8; font-size: 0.9rem;">
      <p>MyDewbox API v1.0.0</p>
      <p style="margin-top: 10px;">Built with ❤️ | Secured with 🔒</p>
    </div>
  </div>
</body>
</html>
  `);
});

module.exports = router;
