const express = require('express');
const router = express.Router();
const Custody = require('../models/Custody');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const custodies = await Custody.findAll({
      order: [['date', 'DESC']]
    });
    res.json(custodies);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const custody = await Custody.create(req.body);

    await JournalEntry.create({
      date: custody.date,
      description: `عهدة - ${custody.personName}`,
      debitAccountId: 5,
      creditAccountId: 3,
      amount: custody.amount,
      type: 'custody',
      relatedId: custody.id,
      createdBy: req.user.id
    });

    res.json(custody);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل العهدة' });
  }
});

router.put('/:id/settle', authMiddleware, async (req, res) => {
  try {
    const { settlementDate, settlementAmount, notes } = req.body;
    await Custody.update({
      status: 'settled',
      settlementDate,
      settlementAmount,
      notes
    }, { where: { id: req.params.id } });
    res.json({ message: 'تم التصفية' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التصفية' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Custody.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Custody.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;