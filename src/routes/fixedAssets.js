const express = require('express');
const router = express.Router();
const FixedAsset = require('../models/FixedAsset');
const JournalEntry = require('../models/JournalEntry');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const assets = await FixedAsset.findAll({ order: [['purchaseDate', 'DESC']] });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const asset = await FixedAsset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'الأصل مش موجود' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const asset = await FixedAsset.create({
      ...req.body,
      currentValue: req.body.purchaseValue
    });

    await JournalEntry.create({
      date: asset.purchaseDate,
      description: `شراء أصل ثابت - ${asset.name}`,
      debitAccountId: 13,
      creditAccountId: 3,
      amount: asset.purchaseValue,
      type: 'asset',
      relatedId: asset.id,
      createdBy: req.user.id
    });

    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء الأصل' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await FixedAsset.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await JournalEntry.destroy({ where: { type: 'asset', relatedId: req.params.id } });
    await FixedAsset.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;