const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: String, // Optional: link to logged-in user
  name: String,
  url: String,
  currentPrice: Number,
  priceHistory: [Number],
  affiliateLink: String,
  lastChecked: Date
});

module.exports = mongoose.model('Product', productSchema);