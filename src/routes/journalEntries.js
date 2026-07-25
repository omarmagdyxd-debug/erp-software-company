const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const Account = require('../models/Account');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await JournalEntry.findAll({
      include: [
        { model: Account, as: 'DebitAccount', attributes: ['code', 'name'] },
        { model: Account, as: 'CreditAccount', attributes: ['code', 'name'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.create({ ...req.body, createdBy: req.user.id });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل القيد' });
  }
});

router.delete('/clear-all', authMiddleware, async (req, res) => {
  try {
    await JournalEntry.destroy({ where: {}, truncate: true });
    res.json({ message: 'تم مسح كل القيود' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في المسح' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await JournalEntry.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});


module.exports = router;