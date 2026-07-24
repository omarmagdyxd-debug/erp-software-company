const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.findAll({ order: [['code', 'ASC']] });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء الحساب' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Account.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Account.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في الحذف' });
  }
});

router.post('/seed', authMiddleware, async (req, res) => {
  try {
    const defaultAccounts = [
      { code: '1000', name: 'Assets', nameAr: 'الأصول', type: 'asset' },
      { code: '1100', name: 'Cash', nameAr: 'النقدية', type: 'asset', parentId: 1 },
      { code: '1101', name: 'InstaPay', nameAr: 'انستا باي', type: 'asset', parentId: 1 },
      { code: '1102', name: 'Bank Account 1', nameAr: 'حساب بنكي 1', type: 'asset', parentId: 1 },
      { code: '1103', name: 'Bank Account 2', nameAr: 'حساب بنكي 2', type: 'asset', parentId: 1 },
      { code: '1104', name: 'Personal Account 1', nameAr: 'حساب شخصي 1', type: 'asset', parentId: 1 },
      { code: '1105', name: 'Personal Account 2', nameAr: 'حساب شخصي 2', type: 'asset', parentId: 1 },
      { code: '1106', name: 'Personal Account 3', nameAr: 'حساب شخصي 3', type: 'asset', parentId: 1 },
      { code: '1107', name: 'Personal Account 4', nameAr: 'حساب شخصي 4', type: 'asset', parentId: 1 },
      { code: '1200', name: 'Accounts Receivable', nameAr: 'حسابات القبض', type: 'asset', parentId: 1 },
      { code: '1300', name: 'Fixed Assets', nameAr: 'الأصول الثابتة', type: 'asset', parentId: 1 },
      { code: '2000', name: 'Liabilities', nameAr: 'الخصوم', type: 'liability' },
      { code: '2100', name: 'Accounts Payable', nameAr: 'حسابات الدفع', type: 'liability', parentId: 12 },
      { code: '3000', name: 'Equity', nameAr: 'حقوق الملكية', type: 'equity' },
      { code: '3100', name: 'Partner Current Account', nameAr: 'جاري الشريك', type: 'equity', parentId: 15 },
      { code: '4000', name: 'Revenue', nameAr: 'الإيرادات', type: 'revenue' },
      { code: '4100', name: 'Project Revenue', nameAr: 'إيرادات المشاريع', type: 'revenue', parentId: 17 },
      { code: '4200', name: 'Other Revenue', nameAr: 'إيرادات أخرى', type: 'revenue', parentId: 17 },
      { code: '5000', name: 'Expenses', nameAr: 'المصاريف', type: 'expense' },
      { code: '5100', name: 'General & Admin Expenses', nameAr: 'مصاريف عمومية وإدارية', type: 'expense', parentId: 20 },
      { code: '5200', name: 'Salaries', nameAr: 'الرواتب', type: 'expense', parentId: 20 },
      { code: '5300', name: 'Custody Expenses', nameAr: 'مصاريف العهد', type: 'expense', parentId: 20 },
    ];

    await Account.bulkCreate(defaultAccounts, { ignoreDuplicates: true });
    res.json({ message: 'تم إنشاء شجرة الحسابات' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء الحسابات' });
  }
});

module.exports = router;