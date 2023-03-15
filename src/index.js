const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { getInvoice, createInvoice, createWidget, configure } = require('./utils.js');

const getPath = (relativePath) => {
  return path.resolve(__dirname, relativePath);
};
configure();

const app = express();

app.use(express.static(getPath('../static')));
app.use(cookieParser());

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
  let invoiceKey = req.cookies['INVOICE_KEY'];
  const invoice = invoiceKey
    ? await getInvoice(invoiceKey)
    : await createInvoice();
  if (!invoiceKey) {
    res.cookie('INVOICE_KEY', invoice.idempotencyKey);
  }
  res.json(invoice);
});

app.get('/payment-widget', async (req, res) => {
  let widgetKey = req.cookies['WIDGET_KEY'];
  if (!widgetKey) {
    const widget = await createWidget();
    res.cookie('WIDGET_KEY', widget.idempotencyKey);
    widgetKey = widget.idempotencyKey;
  }
  res.redirect(`${process.env.CALYPSO_PAY_URL}pay?widgetKey=${widgetKey}`);
});

app.get('/payment-link', async (req, res) => {
  let invoiceKey = req.cookies['INVOICE_KEY'];
  if (!invoiceKey) {
    const invoice = await createInvoice();
    res.cookie('INVOICE_KEY', invoice.idempotencyKey);
    invoiceKey = invoice.idempotencyKey;
  }
  res.redirect(`${process.env.CALYPSO_PAY_URL}invoice/${invoiceKey}`);
});


app.listen(PORT, () => console.log('Server started at http://localhost:' + PORT));
