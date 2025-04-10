const axios = require('axios');
const cheerio = require('cheerio');

async function comparePrices(product) {
  const amazonURL = `https://www.amazon.in/s?k=${encodeURIComponent(product)}`;
  const flipkartURL = `https://www.flipkart.com/search?q=${encodeURIComponent(product)}`;
  const meeshoUrl = `https://www.meesho.com/search?q=${encodeURIComponent(product)}`;

  const results = [];

  try {
    // Amazon Scraper (simplified, may need headers)
    const amazonRes = await axios.get(amazonURL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $amazon = cheerio.load(amazonRes.data);
    const amazonTitle = $amazon('.s-title-instructions-style .a-text-normal').first().text();
    const amazonPrice = $amazon('.a-price-whole').first().text();
    results.push({ site: 'Amazon', title: amazonTitle, price: amazonPrice, link: amazonURL });

    // Flipkart Scraper
    const flipkartRes = await axios.get(flipkartURL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $flip = cheerio.load(flipkartRes.data);
    const flipTitle = $flip('._4rR01T').first().text();
    const flipPrice = $flip('._30jeq3').first().text();
    results.push({ site: 'Flipkart', title: flipTitle, price: flipPrice, link: flipkartURL });

  } catch (error) {
    return `Error fetching prices: ${error.message}`;
  }

  return results.map(r => `${r.site}: ${r.title}\nPrice: ${r.price}\n${r.link}`).join('\n\n');
}

module.exports = { comparePrices };