const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ مسار عام لجلب كل المنتجات بدون تحقق
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, title: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب المنتجات" });
  }
});

module.exports = router;