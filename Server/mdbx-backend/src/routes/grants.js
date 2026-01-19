const express = require('express');
const router = express.Router();
const GrantController = require('../controllers/grantController');

router.post('/', GrantController.createGrant);
router.get('/', GrantController.getAllGrants);
router.get('/:year', GrantController.getGrant);
router.put('/:year', GrantController.updateGrant);
router.post('/:year/record', GrantController.recordGrantGiven);

module.exports = router;
