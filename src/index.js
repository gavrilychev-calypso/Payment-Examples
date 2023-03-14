const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { getInvoice, getWidget, configure } = require('./utils.js');

const getPath = (relativePath) => {
  return path.resolve(__dirname, relativePath);
};
configure();

const app = express();

app.use(express.static(getPath('../static')));

const {
  PORT = 3000,
} = process.env;

app.get('/', (req, res) => {
  fs.readFile(getPath('../static/examples.html'), 'utf8', (err, html) => {
    if (err) {
      res.send('ERROR');
      return;
    }
    res.send(html);
  });
});

app.get('/payment-form', async (req, res) => {
  fs.readFile(getPath('../static/payment-form.html'), 'utf8', (err, html) => {
    if (err) {
      res.send('ERROR');
      return;
    }
    res.send(html);
  });
});

app.get('/invoice', async (req, res) => {
  const invoice = await getInvoice();
  res.json(invoice);
});

app.get('/payment-widget', async (req, res) => {
  const widget = await getWidget();
  res.redirect(`${process.env.CALYPSO_PAY_URL}pay?widgetKey=${widget.idempotencyKey}`);
});

app.get('/payment-link', async (req, res) => {
  const invoice = await getInvoice();
  res.redirect(`${process.env.CALYPSO_PAY_URL}invoice/${invoice.idempotencyKey}`);
});

app.listen(PORT, () => console.log('Server started at http://localhost:' + PORT));
