const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      include: [{ model: Employee, attributes: ['id', 'name', 'position'] }],
      order: [['month', 'DESC']]
    });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { baseSalary, additions, insuranceDeduction, subscriptionDeduction, penaltyDeduction } = req.body;
    const netSalary = parseFloat(baseSalary) + parseFloat(additions || 0)
      - parseFloat(insuranceDeduction || 0)
      - parseFloat(subscriptionDeduction || 0)
      - parseFloat(penaltyDeduction || 0);

    const payroll = await Payroll.create({ ...req.body, netSalary });

    await JournalEntry.create({
      date: payroll.paymentDate || new Date(),
      description: `راتب - ${payroll.month}`,
      debitAccountId: 21,
      creditAccountId: 3,
      amount: netSalary,
      type: 'salary',
      relatedId: payroll.id,
      createdBy: req.user.id
    });

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تسجيل الراتب' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Payroll.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await JournalEntry.destroy({ where: { type: 'salary', relatedId: req.params.id } });
    await Payroll.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;