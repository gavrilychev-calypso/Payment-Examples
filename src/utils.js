const axios = require('axios');
const crypto = require('crypto-js');

require('dotenv').config();

const invoiceCreatePayload = {
  currency: 'USDT',
  fiatCurrency: 'EUR',
  fiatAmount: 100,
  description: 'Buy test product',
};

const widgetCreatePayload = {
  cryptoCurrencies: ['USDT_TRX', 'XDG', 'BTC', 'BUSD'],
  fiatCurrency: 'EUR',
  fiatAmount: 100,
  description: 'Account top-up',
};

const getInvoice = async () => {
  const response = await axios.post(
    `invoice/single-fiat/create`,
    {
      account: process.env.ACCOUNT,
      timestamp: Date.now(),
      payload: invoiceCreatePayload,
    },
  );
  return response.data;
};
const getWidget = async () => {
  const response = await axios.post(
    `payment-widget/single-fiat/create`,
    {
      account: process.env.ACCOUNT,
      timestamp: Date.now(),
      payload: widgetCreatePayload,
    },
  );
  return response.data;
};

const sign = (body, secret) => {
  return crypto.HmacSHA512(body, secret).toString(crypto.enc.hex);
};

const configure = () => {
  axios.defaults.baseURL = process.env.CALYPSO_API_URL;

  // Add API KEY to request headers
  axios.defaults.headers.common['Key'] = process.env.API_KEY;

  axios.defaults.headers.post['Content-Type'] = 'application/json';

  axios.interceptors.request.use((request) => {

    // Sign request body
    const signature = sign(JSON.stringify(request.data), process.env.SECRET);
    // Add signature to request headers
    request.headers.set('Sign', signature);

    return request;
  });
};


module.exports = {
  configure,
  getWidget,
  getInvoice,
};
