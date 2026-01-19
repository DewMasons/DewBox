const express = require('express');
const router = express.Router();
const SubscriberController = require('../controllers/subscriberController');

// Subscriber routes
router.post('/', SubscriberController.createSubscriber);
router.get('/', SubscriberController.getAllSubscribers);
router.get('/:id', SubscriberController.getSubscriber);
router.put('/:id', SubscriberController.updateSubscriber);
router.delete('/:id', SubscriberController.deleteSubscriber);

// Balance routes
router.get('/:id/balance', SubscriberController.getSubscriberBalance);
router.put('/:id/balance', SubscriberController.updateSubscriberBalance);

// Beneficiary routes
router.post('/:id/beneficiaries', SubscriberController.addBeneficiary);
router.get('/:id/beneficiaries', SubscriberController.getBeneficiaries);

module.exports = router;
