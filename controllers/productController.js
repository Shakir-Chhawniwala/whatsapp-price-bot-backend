const Product = require('../models/Product');
const { scrapePrice } = require('../utils/scraper');

exports.addProduct = async (req, res) => {
    try {
      const { name, url, affiliateLink } = req.body;
      const scrapedPrice = await scrapePrice(url);
  
      const newProduct = new Product({
        name,
        url,
        currentPrice: scrapedPrice || 0,
        priceHistory: scrapedPrice ? [scrapedPrice] : [],
        affiliateLink,
        lastChecked: new Date(),
      });
  
      const saved = await newProduct.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};