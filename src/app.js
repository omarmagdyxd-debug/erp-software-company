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
const Revenue = require('./models/Revenue');
const Expense = require('./models/Expense');
const Custody = require('./models/Custody');
const Employee = require('./models/Employee');
const Payroll = require('./models/Payroll');
const FixedAsset = require('./models/FixedAsset');
const PartnerTransaction = require('./models/PartnerTransaction');
const Installment = require('./models/Installment');
const ProjectCost = require('./models/ProjectCost');

JournalEntry.belongsTo(Account, { as: 'DebitAccount', foreignKey: 'debitAccountId' });
JournalEntry.belongsTo(Account, { as: 'CreditAccount', foreignKey: 'creditAccountId' });
Project.belongsTo(Client, { foreignKey: 'clientId' });
Project.belongsTo(Partner, { foreignKey: 'partnerId' });
Client.hasMany(Project, { foreignKey: 'clientId' });
Partner.hasMany(Project, { foreignKey: 'partnerId' });
Revenue.belongsTo(Client, { foreignKey: 'clientId' });
Revenue.belongsTo(Project, { foreignKey: 'projectId' });
Expense.belongsTo(Project, { foreignKey: 'projectId' });
Payroll.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasMany(Payroll, { foreignKey: 'employeeId' });
Project.hasMany(Installment, { foreignKey: 'projectId' });
Installment.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(ProjectCost, { foreignKey: 'projectId' });
ProjectCost.belongsTo(Project, { foreignKey: 'projectId' });

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const clientRoutes = require('./routes/clients');
const partnerRoutes = require('./routes/partners');
const projectRoutes = require('./routes/projects');
const revenueRoutes = require('./routes/revenue');
const expenseRoutes = require('./routes/expenses');
const custodyRoutes = require('./routes/custody');
const employeeRoutes = require('./routes/employees');
const payrollRoutes = require('./routes/payroll');
const fixedAssetRoutes = require('./routes/fixedAssets');
const partnerAccountRoutes = require('./routes/partnerAccount');
const journalRoutes = require('./routes/journalEntries');
const installmentRoutes = require('./routes/installments');
const projectCostRoutes = require('./routes/projectCosts');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/custody', custodyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/fixed-assets', fixedAssetRoutes);
app.use('/api/partner-account', partnerAccountRoutes);
app.use('/api/journal-entries', journalRoutes);
app.use('/api/installments', installmentRoutes);
app.use('/api/project-costs', projectCostRoutes);

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