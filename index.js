require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/dbConnect");
const corsOptions = require("./config/corsOptions");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protected");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require('./routes/productRoutes');
const SiteSettings = require("./models/SiteSettings");
const paymentRoutes = require('./routes/paymentRoutes');
const AdditionPrice = require("./models/AdditionPrice");

const app = express();
const PORT = process.env.PORT || 5000;

// تحقق من وجود JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

connectDB();

// إعدادات CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Backend server is running");
});

app.get('/api/public/settings', async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json({
      country: settings.country,
      countryCode: settings.countryCode,
      currency: settings.currency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/public/addition-prices', async (req, res) => {
  try {
    const additionPrices = await AdditionPrice.find();
    res.json(additionPrices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});