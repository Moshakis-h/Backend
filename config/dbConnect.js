// config/dbConnect.js
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('✅ Already connected to MongoDB');
    return;
  }

  const uri = process.env.DATABASE_URI;
  if (!uri) {
    console.error('❌ DATABASE_URI not found in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // لم تعد هناك حاجة إلى useNewUrlParser أو useUnifiedTopology
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;