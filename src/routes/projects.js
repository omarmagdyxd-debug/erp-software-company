const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Client = require('../models/Client');
const Partner = require('../models/Partner');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: Client, attributes: ['id', 'name'] },
        { model: Partner, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: Client, attributes: ['id', 'name', 'phone', 'email'] },
        { model: Partner, attributes: ['id', 'name', 'phone'] }
      ]
    });
    if (!project) return res.status(404).json({ message: 'المشروع مش موجود' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء المشروع' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Project.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Project.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

module.exports = router;