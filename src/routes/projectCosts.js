const express = require('express');
const router = express.Router();
const ProjectCost = require('../models/ProjectCost');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const costs = await ProjectCost.findAll({
      where: { projectId: req.params.projectId },
      order: [['date', 'DESC']]
    });
    res.json(costs);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const cost = await ProjectCost.create(req.body);

    await JournalEntry.create({
      date: cost.date,
      description: `Project Cost - ${cost.description}`,
      debitAccountId: 20,
      creditAccountId: 3,
      amount: cost.amount,
      type: 'expense',
      relatedId: cost.id,
      createdBy: req.user.id
    });

    res.json(cost);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل التكلفة' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await ProjectCost.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await JournalEntry.destroy({ where: { type: 'expense', relatedId: req.params.id } });
    await ProjectCost.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;