const express = require('express');
const router = express.Router();
const CoopController = require('../controllers/coopController');

// Coop routes
router.post('/', CoopController.createCoop);
router.get('/', CoopController.getAllCoops);
router.get('/:id', CoopController.getCoop);
router.put('/:id', CoopController.updateCoop);
router.delete('/:id', CoopController.deleteCoop);

// Coop member routes
router.post('/members', CoopController.addCoopMember);
router.get('/:coopId/members', CoopController.getCoopMembers);
router.put('/:coopId/members', CoopController.updateCoopMember);

module.exports = router;
