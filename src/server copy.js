const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { connectMongo } = require('./utils/db');
const { notFoundHandler, errorHandler } = require('./utils/errors');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 and Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });


