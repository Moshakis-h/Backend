// models/AdditionPrice.js
const mongoose = require('mongoose');

const additionPriceSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    unique: true
  },
  sectionName: {
    type: String,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }]
});

module.exports = mongoose.model('AdditionPrice', additionPriceSchema);