const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  category: {
  type: String,
  required: true,
  enum: [
    "عروض المناسبات", 
    "بوفيهات الريوق", 
    "خدمات إضافية"
  ]
}
});

module.exports = mongoose.model("Product", productSchema);