const express = require('express');
const router = express.Router();
const Installment = require('../models/Installment');
const Project = require('../models/Project');
const Revenue = require('../models/Revenue');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    const installments = await Installment.findAll({
      where: { projectId: req.params.projectId },
      order: [['dueDate', 'ASC']]
    });
    res.json(installments);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const installment = await Installment.create(req.body);
    res.json(installment);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء القسط' });
  }
});

router.put('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const { paidDate, source } = req.body;
    const installment = await Installment.findByPk(req.params.id);
    if (!installment) return res.status(404).json({ message: 'القسط مش موجود' });

    await installment.update({ status: 'paid', paidDate, source });

    const project = await Project.findByPk(installment.projectId);

    await Revenue.create({
      date: paidDate,
      amount: installment.amount,
      source: source,
      projectId: installment.projectId,
      clientId: project ? project.clientId : null,
      description: `installment payment - ${installment.name}`
    });

    await JournalEntry.create({
      date: paidDate,
      description: `installment - ${installment.name}`,
      debitAccountId: 3,
      creditAccountId: 17,
      amount: installment.amount,
      type: 'revenue',
      relatedId: installment.id,
      createdBy: req.user.id
    });

    res.json({ message: 'تم تسجيل الدفع' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل الدفع' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Installment.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Installment.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;