const Product = require("../models/Product");
const SiteSettings = require("../models/SiteSettings");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const AdditionPrice = require("../models/AdditionPrice");

const addProduct = async (req, res) => {
  try {
    const { title, description, image, price, category } = req.body;

    if (!title || !description || !image || !price || !category) {
      return res.status(400).json({ message: "يرجى تعبئة جميع الحقول بما في ذلك التصنيف" });
    }

    const newProduct = new Product({ title, description, image, price, category });
    await newProduct.save();

    res.status(201).json({ message: "تم إضافة المنتج بنجاح" });

  } catch (err) {
    console.error("خطأ أثناء إضافة المنتج:", err);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة المنتج" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب المنتجات" });
  }
};

const updatePrice = async (req, res) => {
  try {
    const { price } = req.body;

    if (!price) return res.status(400).json({ message: "السعر غير موجود" });

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      { price }, 
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
    
    res.json({ message: "تم تحديث السعر بنجاح", product: updatedProduct });
  } catch (err) {
    console.error("فشل في تحديث السعر:", err);
    res.status(500).json({ message: "فشل تحديث السعر" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { currency } = req.body;

    // خريطة تحويل العملة إلى رمز الدولة
    const currencyToCountryCode = {
      "دك": { country: "الكويت", countryCode: "+965" },
      "دا": { country: "الإمارات", countryCode: "+971" },
      "رق": { country: "قطر", countryCode: "+974" },
      "رس": { country: "السعودية", countryCode: "+966" }
    };

    const countryInfo = currencyToCountryCode[currency];
    if (!countryInfo) return res.status(400).json({ message: "عملة غير صالحة" });

    const existing = await SiteSettings.findOne();
    if (existing) {
      existing.currency = currency;
      existing.country = countryInfo.country;
      existing.countryCode = countryInfo.countryCode;
      await existing.save();
    } else {
      const newSettings = new SiteSettings({ 
        currency, 
        country: countryInfo.country,
        countryCode: countryInfo.countryCode
      });
      await newSettings.save();
    }

    res.json({ message: "تم تحديث إعدادات الموقع" });
  } catch (err) {
    res.status(500).json({ message: "فشل في تحديث الإعدادات" });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب الإعدادات" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email phone redirectPage country');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب المستخدمين" });
  }
};

const updateUserRedirect = async (req, res) => {
  try {
    const { id } = req.params;
    const { redirectPage } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { redirectPage },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }
    
    res.json({ message: "تم تحديث توجيه المستخدم بنجاح", user });
  } catch (err) {
    res.status(500).json({ message: "فشل في تحديث المستخدم" });
  }
};


const getAdditionPrices = async (req, res) => {
  try {
    const additionPrices = await AdditionPrice.find();
    res.json(additionPrices);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب أسعار الإضافات" });
  }
};

// دالة لتحديث أسعار الإضافات
const updateAdditionPrices = async (req, res) => {
  try {
    const updates = req.body; // يجب أن تكون مصفوفة من الأقسام

    for (const update of updates) {
      const { sectionId, items } = update;

      let additionPrice = await AdditionPrice.findOne({ sectionId });

      if (!additionPrice) {
        additionPrice = new AdditionPrice({
          sectionId,
          sectionName: `Section ${sectionId}`,
          items
        });
      } else {
        additionPrice.items = items;
      }

      await additionPrice.save();
    }
    
    res.json({ message: "تم تحديث أسعار الإضافات بنجاح" });
  } catch (err) {
    console.error("فشل في تحديث أسعار الإضافات:", err);
    res.status(500).json({ message: "فشل في تحديث أسعار الإضافات" });
  }
};

// في AdminController.js

const updateAdmin = async (req, res) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;
    const userId = req.user.id;

    // 1. جلب بيانات المسؤول الحالي
    const admin = await User.findOne({ _id: userId, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: "الحساب المسؤول غير موجود" });
    }

    // 2. التحقق من كلمة المرور الحالية
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "كلمة المرور الحالية غير صحيحة" });
    }

    // 3. التحقق من البريد الإلكتروني الجديد (إذا تم تقديمه)
    if (newEmail) {
      const emailExists = await User.findOne({ 
        email: newEmail,
        _id: { $ne: userId }
      });
      if (emailExists) {
        return res.status(400).json({ message: "البريد الإلكتروني الجديد مستخدم بالفعل" });
      }
      admin.email = newEmail;
    }

    // 4. تحديث كلمة المرور (إذا تم تقديمها)
    if (newPassword) {
      admin.password = newPassword;
      admin.passwordChangedAt = Date.now();
    }

    // 5. حفظ التغييرات
    await admin.save();

    // 6. إذا تم تغيير كلمة المرور، أنشئ token جديد
    let token;
    if (newPassword) {
      token = createToken(admin);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      });
    }

    res.json({ 
      success: true,
      message: "تم تحديث بيانات المسؤول بنجاح",
      updatedFields: {
        emailUpdated: !!newEmail,
        passwordUpdated: !!newPassword
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث المسؤول:', error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء تحديث بيانات المسؤول",
      error: error.message
    });
  }
};
// دالة لتهيئة أسعار الإضافات لأول مرة
const initializeAdditionPrices = async () => {
  try {
    const defaultSections = [
    ];

    for (const section of defaultSections) {
      const existing = await AdditionPrice.findOne({ sectionId: section.sectionId });
      if (!existing) {
        const newSection = new AdditionPrice(section);
        await newSection.save();
      }
    }
  } catch (err) {
    console.error('خطأ في تهيئة أسعار الإضافات:', err);
  }
};

initializeAdditionPrices();

module.exports = {
  addProduct,
  getProducts,
  updatePrice,
  updateSettings,
  getSettings,
  getUsers,
  updateUserRedirect  ,
  getAdditionPrices,
  updateAdditionPrices,
  updateAdmin
};
