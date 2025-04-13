const cron = require('node-cron');
const Product = require('../models/Product');
const { scrapePrice } = require('../utils/scraper');
const { sendPriceDropAlert } = require('../utils/whatsapp');

const startPriceUpdater = () => {
  // Runs every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('⏰ Running price update job...');

    const products = await Product.find();

    // for (const product of products) {
    //   try {
    //     const newPrice = await scrapePrice(product.url);
    //     if (!newPrice) continue;

    //     product.priceHistory.push(newPrice);
    //     product.currentPrice = newPrice;
    //     product.lastChecked = new Date();

    //     await product.save();
    //     console.log(`✅ Updated ${product.name} to ₹${newPrice}`);
    //   } catch (err) {
    //     console.error(`❌ Error updating ${product.name}:`, err.message);
    //   }
    // }

    for (const product of products) {
        try {
          const newPrice = await scrapePrice(product.url);
          if (!newPrice) continue;
      
          const previousPrice = product.currentPrice;
          product.priceHistory.push(newPrice);
          product.currentPrice = newPrice;
          product.lastChecked = new Date();
      
          await product.save();
      
          if (newPrice < previousPrice) {
            await sendPriceDropAlert(product);
          }
      
          console.log(`✅ Updated ${product.name} to ₹${newPrice}`);
        } catch (err) {
            console.error(`❌ Error updating ${product.name}:`, err.message);
        }
      }

    console.log('✅ Price update job complete.\n');
  });
};

module.exports = { startPriceUpdater };