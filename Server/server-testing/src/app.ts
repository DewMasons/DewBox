import express from 'express';
import bodyParser from 'body-parser';
import { json, urlencoded } from 'body-parser';

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Server Testing Application!');
});

// Export the app for testing
export default app;