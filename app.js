const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { comparePrices } = require('./priceChecker');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/whatsapp', async (req, res) => {
  const incomingMsg = req.body.Body;
  const twiml = new MessagingResponse();

  const reply = await comparePrices(incomingMsg); // e.g. "iPhone 14"
  twiml.message(reply);

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

app.listen(3000, () => console.log('Running on port 3000'));