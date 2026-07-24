const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const clients = await Client.findAll({ order: [['name', 'ASC']] });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'العميل مش موجود' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء العميل' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Client.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Client.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;