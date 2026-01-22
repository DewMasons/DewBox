const express = require('express');
const router = express.Router();
const WalletController = require('../controllers/walletController');
const authenticateToken = require('../middleware/auth');

// Wallet routes
router.post('/', WalletController.createWallet);
router.get('/', WalletController.getAllWallets);
router.get('/me', authenticateToken, WalletController.getMyWallet);
router.get('/:subscriberId', WalletController.getWallet);
router.put('/:subscriberId/balance', WalletController.updateWalletBalance);

// Wallet payment routes
router.post('/payments', WalletController.createWalletPayment);
router.get('/:walletId/payments', WalletController.getWalletPayments);

module.exports = router;
