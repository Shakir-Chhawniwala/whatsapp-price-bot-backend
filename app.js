const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const { comparePrices } = require('./comparePrices');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/whatsapp', async (req, res) => {
  console.log(req);
  
  const incomingMsg = req.body.body;
  const twiml = new MessagingResponse();
  console.log(incomingMsg);
  
  const reply = await comparePrices(incomingMsg); // e.g. "iPhone 14"
  twiml.message(reply);

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

app.listen(3000, () => console.log('Running on port 3000'));