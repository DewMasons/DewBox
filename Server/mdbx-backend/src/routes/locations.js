const express = require('express');
const router = express.Router();
const LookupController = require('../controllers/lookupController');

/**
 * Location Routes - Countries, States, Cities, LGAs
 * Uses external API (countriesnow.space)
 */

// @route   GET /api/locations/countries
// @desc    Get all countries
// @access  Public
router.get('/countries', LookupController.getCountries);

// @route   GET /api/locations/states
// @desc    Get states for a country
// @query   country (required)
// @access  Public
router.get('/states', LookupController.getStates);

// @route   GET /api/locations/cities
// @desc    Get cities for a state in a country
// @query   country (required), state (required)
// @access  Public
router.get('/cities', LookupController.getCities);

// @route   GET /api/locations/lgas
// @desc    Get LGAs for a Nigerian state
// @query   state (required)
// @access  Public
router.get('/lgas', LookupController.getLGAs);

// @route   GET /api/locations/nigeria/states-lgas
// @desc    Get all Nigerian states with their LGAs
// @access  Public
router.get('/nigeria/states-lgas', LookupController.getAllNigerianStatesWithLGAs);

module.exports = router;
