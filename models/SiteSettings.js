const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema({
  currency: {
    type: String,
    enum: ["دك", "دا", "رق", "رس"],
    required: true
  },
  country: {
    type: String,
    enum: ["الكويت", "الإمارات", "قطر", "السعودية"],
    required: true
  },
  countryCode: {
    type: String,
    required: true,
    default: "+965"
  }
});

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);