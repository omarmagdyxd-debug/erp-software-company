const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Project = require('../models/Project');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [{ model: Project, attributes: ['id', 'name'] }],
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    await JournalEntry.create({
      date: expense.date,
      description: expense.description || 'مصروف',
      debitAccountId: 20,
      creditAccountId: 3,
      amount: expense.amount,
      type: 'expense',
      relatedId: expense.id,
      createdBy: req.user.id
    });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل المصروف' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Expense.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await JournalEntry.destroy({ where: { type: 'expense', relatedId: req.params.id } });
    await Expense.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;