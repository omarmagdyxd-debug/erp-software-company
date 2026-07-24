const express = require('express');
const router = express.Router();
const PartnerTransaction = require('../models/PartnerTransaction');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await PartnerTransaction.findAll({
      order: [['date', 'DESC']]
    });
    const balance = transactions.reduce((sum, t) => {
      return t.type === 'deposit'
        ? sum + parseFloat(t.amount)
        : sum - parseFloat(t.amount);
    }, 0);
    res.json({ transactions, balance });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const transaction = await PartnerTransaction.create(req.body);

    const isWithdrawal = transaction.type === 'withdrawal';
    await JournalEntry.create({
      date: transaction.date,
      description: transaction.description || `جاري الشريك - ${transaction.type === 'withdrawal' ? 'سحب' : 'إيداع'}`,
      debitAccountId: isWithdrawal ? 15 : 3,
      creditAccountId: isWithdrawal ? 3 : 15,
      amount: transaction.amount,
      type: 'partner',
      relatedId: transaction.id,
      createdBy: req.user.id
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل الحركة' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await PartnerTransaction.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await PartnerTransaction.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;