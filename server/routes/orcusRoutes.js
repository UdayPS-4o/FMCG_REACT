const express = require('express');
const app = express.Router();
const fs = require('fs').promises;
const path = require('path');
function convertAmountToWords(amount) {
  const oneToTwenty = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  function convertLessThanOneThousand(number) {
    let words;
    if (number % 100 < 20) {
      words = oneToTwenty[number % 100];
      number = Math.floor(number / 100);
    } else {
      words = oneToTwenty[number % 10];
      number = Math.floor(number / 10);
      words = tens[number % 10] + ' ' + words;
      number = Math.floor(number / 10);
    }
    if (number === 0) return words;
    return oneToTwenty[number] + ' Hundred ' + words;
  }

  function convert(amount) {
    let words = '';
    for (let i = 0; i < scales.length; i++) {
      if (amount % 1000 !== 0) {
        words = convertLessThanOneThousand(amount % 1000) + ' ' + scales[i] + ' ' + words;
      }
      amount = Math.floor(amount / 1000);
    }
    return words.trim();
  }

  const words = convert(amount);
  return words ? words + ' Only' : 'Zero Only';
}
app.get('/print', async (req, res) => {
  try {
    const { receiptNo } = req.query;
    const data = await fetch('http://localhost/json/cash-receipts');
    const json = await data.json();
    const receipt = json.find((receipt) => receipt.receiptNo === receiptNo);
    const cmpl = await fetch('http://localhost/cmpl');
    const cmplJson = await cmpl.json();
    const cmplData = cmplJson.find((cmpl) => cmpl.C_CODE === receipt.party);
    const AmountInWords = convertAmountToWords(receipt.amount);
    console.log('AmountInWords', AmountInWords);
    res.send({ ...receipt, ...cmplData, AmountInWords });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = app;
