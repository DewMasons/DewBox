const express = require('express');
const router = express.Router();
const LookupController = require('../controllers/lookupController');

// Coop types
router.get('/coop-types', LookupController.getCoopTypes);
router.post('/coop-types', LookupController.createCoopType);

// Transaction types
router.get('/transaction-types', LookupController.getTransactionTypes);
router.post('/transaction-types', LookupController.createTransactionType);

// Device types
router.get('/device-types', LookupController.getDeviceTypes);
router.post('/device-types', LookupController.createDeviceType);

// Service channels
router.get('/service-channels', LookupController.getServiceChannels);
router.post('/service-channels', LookupController.createServiceChannel);

module.exports = router;
