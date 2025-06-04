require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactions');
const bankRoutes = require('./routes/banks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRouter);
// User routes
app.use('/users', userRoutes);
app.use('/users/transactions', transactionRoutes);
app.use('/banks', bankRoutes);

app.get('/', (req, res) => {
  res.send('MDBX Express backend running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
