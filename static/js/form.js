
fetch('/invoice')
  .then(response => response.json())
  .then((invoice) => {
    const loader = document.getElementById('loader')
    loader.classList.add('hidden')
    const content = document.getElementById('content')
    content.classList.remove('hidden')

    const description = document.getElementById('description')
    description.innerHTML= invoice.description
    const fiatAmount = document.getElementById('fiat_amount')
    fiatAmount.innerHTML = `${invoice.fiatAmount} ${invoice.fiatCurrency}`
    const amount = document.getElementById('amount')
    amount.innerHTML = invoice.payAmount
    const currency = document.getElementById('currency')
    currency.innerHTML = invoice.currency
    const walletAddress = document.getElementById('walletAddress')
    walletAddress.innerHTML = invoice.invoiceAddress
    const qrImg = document.getElementById('qr_img')
    qrImg.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?data=${invoice.walletAddress}&size=300x300`)
  })
  .catch(error => {
    const loader = document.getElementById('loader')
    loader.innerHTML = 'Error';
  });
