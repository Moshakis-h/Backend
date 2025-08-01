require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protected");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require('./routes/productRoutes');
const SiteSettings = require("./models/SiteSettings");
const paymentRoutes = require('./routes/paymentRoutes');
const AdditionPrice = require("./models/AdditionPrice");

const app = express();
const PORT = process.env.PORT || "5000";

connectDB();

// إعدادات CORS المحدثة
const corsOptions = {
  origin: [
    'https://royalbuffet.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("hi");
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
  res.status(404);
  res.sendFile(path.join(__dirname, "/views", "/404.html"));
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});