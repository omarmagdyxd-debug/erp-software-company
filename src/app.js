require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

const User = require('./models/User');
const Account = require('./models/Account');
const JournalEntry = require('./models/JournalEntry');
const Client = require('./models/Client');
const Partner = require('./models/Partner');
const Project = require('./models/Project');

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const clientRoutes = require('./routes/clients');
const partnerRoutes = require('./routes/partners');
const projectRoutes = require('./routes/projects');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ERP Software Company API is running' });
});

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Database error:', err));

module.exports = app;