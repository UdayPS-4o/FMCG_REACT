const express = require('express');
const app = express.Router();
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const {
  redirect,
  getDbfData,
  getCmplData,
  ensureDirectoryExistence,
  saveDataToJsonFile,
} = require('./utilities');
const { cp } = require('fs');
const { id } = require('date-fns/locale');

app.get('/api/checkiskAuth', (req, res) => {
  const token = req.cookies.token; // Retrieve the token from the HttpOnly cookie

  const filePath = path.join(__dirname, '..', 'db', 'users.json');
  fs.readFile(filePath, 'utf8')
    .then((data) => {
      const users = JSON.parse(data);
      const user = users.find((u) => u.token === token);

      if (user) {
        // Return user details if authenticated
        return res.status(200).json({ authenticated: true, name: user.name, routeAccess: user.routeAccess ,id: user.id});
      } else {
        // Return unauthorized if user is not found
        return res.status(401).json({ authenticated: false });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ authenticated: false, error: 'Internal server error' });
    });
});



app.post('/api/login', async (req, res) => {
  const { mobile, password } = req.body;
  const filePath = path.join(__dirname, '..', 'db', 'users.json');
  
  try {
    let dbData = await fs.readFile(filePath, 'utf8');
    let users = JSON.parse(dbData);
    const user = users.find(user => user.number === mobile && user.password === password);
    
    if (user) {
      const newToken = Math.random().toString(36).substring(7);
      user.token = newToken;
      
      // Save the updated users data with the new token
      await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
      
      // Set token in the cookie and respond
      res.status(200)
        .header('Set-Cookie', `token=${newToken}; Path=/; Domain=.udayps.com; Max-Age=3600; HttpOnly;`)
        .send('Login successful.');
    } else {
      res.status(404).send('Error: Invalid username or password.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to login: ' + err.message);
  }
});


app.get('/login', async (req, res) => {
  let firms = await getDbfData(path.join(__dirname, '..', '..', 'FIRM', 'FIRM.DBF'));
  res.render('pages/login/login', { firm: firms });
});

app.get('/logout', (req, res) => {
  res.status(200).clearCookie('token').redirect('/login');
  // .send("Logout successful." + redirect("/login", 2000));
});

const DIR = 'd01-2324';

async function getSTOCKFILE(vvv) {
  return await fs
    .readFile(
      path.join(
        __dirname,
        '..',
        '..',
        DIR,
        'data',
        'json',
        vvv.replace('.dbf', '.json').replace('.DBF', '.json'),
      ),
      'utf8',
    )
    .then((data) => JSON.parse(data));
}

async function calculateCurrentStock() {
  const salesData = await getSTOCKFILE('billdtl.json');
  const purchaseData = await getSTOCKFILE('purdtl.json');
  const transferData = await getSTOCKFILE('transfer.json');
  const pmplData = await getSTOCKFILE('pmpl.json');
  
  // Fetch the local godown transfer data
  const localTransferResponse = (await fs.readFile(`./db/godown.json`, 'utf8')) || '[]';
  const localTransferData = await JSON.parse(localTransferResponse);

  // Initialize a dictionary to track the stock
  let stock = {};

  // Process purchases to increment stock
  purchaseData.forEach((purchase) => {
    // console.log(purchase);
    const { CODE: code, GDN_CODE: gdn_code, QTY: qty, MULT_F: multF, UNIT: unit } = purchase;
    const qtyInPieces = unit === 'BOX' ? qty * multF : qty;

    if (!stock[code]) {
      stock[code] = {};
    }
    if (!stock[code][gdn_code]) {
      stock[code][gdn_code] = 0;
    }
    stock[code][gdn_code] += qtyInPieces;
  });

  // Process sales to decrement stock
  salesData.forEach((sale) => {
    const { CODE: code, GDN_CODE: gdn_code, QTY: qty, MULT_F: multF, UNIT: unit } = sale;
    const qtyInPieces = unit === 'BOX' ? qty * multF : qty;

    if (stock[code] && stock[code][gdn_code]) {
      stock[code][gdn_code] -= qtyInPieces;
    }
  });

  // Process DBF transfers
  transferData.forEach((transfer) => {
    const {
      CODE: code,
      GDN_CODE: from_gdn,
      TRF_TO: to_gdn,
      QTY: qty,
      MULT_F: multF,
      UNIT: unit,
    } = transfer;
    const qtyInPieces = unit === 'BOX' ? qty * multF : qty;

    // Handle outgoing transfers
    if (stock[code] && stock[code][from_gdn]) {
      stock[code][from_gdn] -= Math.abs(qtyInPieces); // Ensure qty is subtracted
    }

    // Handle incoming transfers
    if (!stock[code]) {
      stock[code] = {};
    }
    if (!stock[code][to_gdn]) {
      stock[code][to_gdn] = 0;
    }
    stock[code][to_gdn] += Math.abs(qtyInPieces); // Ensure qty is added
  });

  // Process local godown transfers
  localTransferData.forEach((transfer) => {
    const { fromGodown, toGodown, items } = transfer;
    items.forEach((item) => {
      const { code, qty, unit } = item;
      const multF = pmplData.find((pmpl) => pmpl.CODE === code)?.MULT_F || 1;
      const qtyInPieces = unit === 'BOX' ? qty * multF : qty; // Assuming unit "BOX" needs multiplication, else use qty as is

      // Handle outgoing transfers
      if (stock[code] && stock[code][fromGodown]) {
        stock[code][fromGodown] -= Math.abs(qtyInPieces); // Ensure qty is subtracted
      }

      // Handle incoming transfers
      if (!stock[code]) {
        stock[code] = {};
      }
      if (!stock[code][toGodown]) {
        stock[code][toGodown] = 0;
      }
      stock[code][toGodown] += Math.abs(qtyInPieces); // Ensure qty is added
    });
  });

  return stock;
}



app.get('/api/stock', async (req, res) => {
  const stock = await calculateCurrentStock();
  res.send(stock);
});

module.exports = app;
