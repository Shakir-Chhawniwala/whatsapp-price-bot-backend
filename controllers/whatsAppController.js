// controllers/whatsappController.js
const { getAmazonProductUrl } = require('../utils/amazonSearch');
const Product = require('../models/Product');
const { scrapePrice } = require('../utils/scraper');
const { sendMessage } = require('../utils/whatsapp');

exports.handleIncomingMessage = async (req, res) => {
  const incomingMsg = req.body.Body || '';
  const from = req.body.From;

  if (!incomingMsg.toLowerCase().includes('track')) {
    await sendMessage(from, 'Send a message like: "Track iPhone 14 from Amazon"');
    return res.sendStatus(200);
  }

  const searchTerm = incomingMsg.replace(/track/i, '').replace(/from amazon/i, '').trim();
  const productUrl = await getAmazonProductUrl(searchTerm);

  if (!productUrl) {
    await sendMessage(from, `❌ Couldn't find "${searchTerm}" on Amazon.`);
    return res.sendStatus(200);
  }

  const price = await scrapePrice(productUrl);

  const newProduct = new Product({
    name: searchTerm,
    url: productUrl,
    currentPrice: price || 0,
    priceHistory: price ? [price] : [],
    affiliateLink: productUrl,
    lastChecked: new Date(),
  });

  await newProduct.save();

  await sendMessage(from, `✅ Started tracking "${searchTerm}" at ₹${price || 'N/A'}.\nYou’ll be alerted on price drops!`);

  res.sendStatus(200);
};