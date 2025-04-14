const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendPriceDropAlert(product) {
  const message = `📉 Price Drop Alert!\n\n${product.name}\nNew Price: ₹${product.currentPrice}\nBuy Now: ${product.affiliateLink}`;

  try {
    const res = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.WHATSAPP_TO,
      body: message,
    });

    console.log('✅ WhatsApp alert sent:', res.sid);
  } catch (err) {
    console.error('❌ Failed to send WhatsApp alert:', err.message);
  }
}

module.exports = { sendPriceDropAlert };

async function sendMessage(to, body) {
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to,
    body,
  });
}

module.exports = { sendMessage };