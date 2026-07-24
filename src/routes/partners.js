const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const partners = await Partner.findAll({ order: [['name', 'ASC']] });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ message: 'الشريك مش موجود' });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const partner = await Partner.create(req.body);
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء الشريك' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Partner.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Partner.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;