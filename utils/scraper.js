const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePrice(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);

    if (url.includes('amazon')) {
      const priceText = $('#priceblock_ourprice').text() || $('#priceblock_dealprice').text();
      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      return numericPrice || null;
    }

    if (url.includes('flipkart')) {
      const priceText = $('._30jeq3._16Jk6d').first().text(); // Flipkart uses this class
      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      return numericPrice || null;
    }

    return null;
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return null;
  }
}

module.exports = { scrapePrice };