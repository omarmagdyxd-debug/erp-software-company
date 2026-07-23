require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

sequelize.sync({ alter: true })
  .then(() => console.log('Database connected and synced'))
  .catch(err => console.error('Database error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ERP Software Company API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;