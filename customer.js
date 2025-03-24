// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  gender: { type: String, required: true }
});

module.exports = mongoose.model('Customer', customerSchema);
