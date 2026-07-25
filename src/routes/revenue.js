const express = require('express');
const router = express.Router();
const Revenue = require('../models/Revenue');
const Client = require('../models/Client');
const Project = require('../models/Project');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const revenues = await Revenue.findAll({
      include: [
        { model: Client, attributes: ['id', 'name'] },
        { model: Project, attributes: ['id', 'name'] }
      ],
      order: [['date', 'DESC']]
    });
    res.json(revenues);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const revenue = await Revenue.create(req.body);

    await JournalEntry.create({
      date: revenue.date,
      description: revenue.description || 'إيراد',
      debitAccountId: 3,
      creditAccountId: 17,
      amount: revenue.amount,
      type: 'revenue',
      relatedId: revenue.id,
      createdBy: req.user.id
    });

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل الإيراد' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Revenue.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const revenue = await Revenue.findByPk(req.params.id);
    if (!revenue) return res.status(404).json({ message: 'مش موجود' });
    
    await JournalEntry.destroy({ 
      where: { type: 'revenue', relatedId: req.params.id } 
    });
    
    await Revenue.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { from, to } = req.query;
    const where = {};
    if (from && to) {
      where.date = { [Op.between]: [from, to] };
    }
    const revenues = await Revenue.findAll({ where });
    const total = revenues.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    res.json({ total, count: revenues.length });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

module.exports = router;