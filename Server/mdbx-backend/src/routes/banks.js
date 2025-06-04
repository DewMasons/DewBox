const express = require('express');
const axios = require('axios');

const bankRouter = express.Router();

bankRouter.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/bank', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch banks from Paystack', error: err.message });
  }
});

module.exports = bankRouter;
