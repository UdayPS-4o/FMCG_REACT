const express = require('express');
const app = express.Router();
const fs = require('fs').promises;
const path = require('path');
const baseURL = 'http://rdp.udayps.com:8000';
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
    const { ReceiptNo, voucherNo, godownId } = req.query;
    if (!ReceiptNo && !voucherNo && !godownId)
      throw new Error('ReceiptNo or VoucherNo is required');
    if (ReceiptNo) {
      const data = await fetch(baseURL + '/json/cash-receipts');
      const json = await data.json();
      const receipt = json.find((receipt) => receipt.receiptNo === ReceiptNo);
      console.log('receipt', receipt);
      const cmpl = await fetch(baseURL + '/cmpl');
      const cmplJson = await cmpl.json();
      const cmplData = cmplJson.find((cmpl) => cmpl.C_CODE === receipt.party);
      const AmountInWords = convertAmountToWords(receipt.amount);
      res.send({ ...receipt, ...cmplData, AmountInWords });
    }
    if (voucherNo) {
      const data = await fetch(baseURL + '/json/cash-payments');
      const json = await data.json();
      const receipt = json.find((receipt) => receipt.voucherNo === voucherNo);
      const cmpl = await fetch(baseURL + '/cmpl');
      const cmplJson = await cmpl.json();
      const cmplData = cmplJson.find((cmpl) => cmpl.C_CODE === receipt.party);
      const AmountInWords = convertAmountToWords(receipt.amount);
      res.send({ ...receipt, ...cmplData, AmountInWords });
    }
    if (godownId) {
      const data = await fetch(baseURL + '/json/godown');
      const json = await data.json();
      const receipt = json.find((receipt) => receipt.id === godownId);
      const cmpl = await fetch(baseURL + '/cmpl');
      const cmplJson = await cmpl.json();
      const cmplData = cmplJson.find((cmpl) => cmpl.C_CODE === receipt.party);
      const AmountInWords = convertAmountToWords(receipt.amount);
      res.send({ ...receipt, ...cmplData, AmountInWords });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
app.get('/account-master', async (req, res) => {
  try {
    const { code } = req.query;
    const data = await fetch(baseURL + '/json/account-master');
    const json = await data.json();
    const user = json.find((user) => user.C_CODE === req.query.code);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await fs.readFile(path.resolve(__dirname, '../db/users.json'));
    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username && user.password === password);
    console.log('user', user);
    if (!user) throw new Error('Invalid username or password');
    res.send(user);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/approve', async (req, res) => {
  try {
    const { approved, endpoint } = req.body;
    console.log('approved', approved, 'endpoint', endpoint);
    const data = await fs.readFile(path.resolve(__dirname, `../db/${endpoint}.json`));
    const json = JSON.parse(data);
    const id =
      endpoint === 'account-master'
        ? 'subgroup'
        : endpoint === 'cash-receipts'
        ? 'receiptNo'
        : endpoint === 'godown'
        ? 'id'
        : endpoint === 'cash-payments'
        ? 'voucherNo'
        : null;

    console.log('id', id);
    const approvedjson = json.filter((item) => {
      const itemIdValue = String(item[id]).toLowerCase();
      return approved.some((approvedValue) => itemIdValue.includes(approvedValue.toLowerCase()));
    });

    // Delete the approved items from the original json
    const remainingjson = json.filter((item) => {
      const itemIdValue = String(item[id]).toLowerCase();
      return !approved.some((approvedValue) => itemIdValue.includes(approvedValue.toLowerCase()));
    });

    // Save the remaining items back to the original file
    await fs.writeFile(
      path.resolve(__dirname, `../db/${endpoint}.json`),
      JSON.stringify(remainingjson, null, 2),
    );
    console.log('updatedJson', approvedjson);
    await fs.mkdir(path.resolve(__dirname, '../db/approved'), { recursive: true });
    await fs.writeFile(
      path.resolve(__dirname, `../db/approved/${endpoint}.json`),
      JSON.stringify(approvedjson, null, 2),
    );
    res.send(approvedjson);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = app;
