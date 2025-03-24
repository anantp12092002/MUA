// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);
