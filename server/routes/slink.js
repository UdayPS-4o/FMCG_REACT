const express = require('express');
const app = express.Router();
const fs = require('fs').promises;
const path = require('path');
const {
  redirect,
  getDbfData,
  ensureDirectoryExistence,
  saveDataToJsonFile,
} = require('./utilities');
const { max } = require('lodash');
const { ca } = require('date-fns/locale');

const getCmplData = async () => {
  const dbfFilePath = path.join(__dirname, '..', '..', 'd01-2324/data', 'CMPL.dbf');
  console.log(dbfFilePath);
  try {
    let jsonData = await getDbfData(dbfFilePath);
    jsonData = jsonData.map((entry) => {
      return {
        M_GROUP: entry.M_GROUP,
        M_NAME: entry.M_NAME,
        C_CODE: entry.C_CODE,
        C_NAME: entry.C_NAME,
      };
    });
    return jsonData;
  } catch (error) {
    console.error('Error reading CMPL.dbf:', error);
    throw error;
  }
};


const getPMPLData = async () => {
  const dbfFilePath = path.join(__dirname, '..', '..', 'd01-2324/data', 'PMPL.dbf');
  console.log(dbfFilePath);
  try {
    let jsonData = await getDbfData(dbfFilePath);
    jsonData = jsonData.map((entry) => {
      return {
        CODE: entry.CODE,
        PRODUCT: entry.PRODUCT,
        PACK: entry.PACK,

        GST: entry.GST,
      };
    });
    return jsonData;
  } catch (error) {
    console.error('Error reading PMPL.dbf:', error);
    throw error;
  }
};


function newData(json, accountMasterData) {
  json = json.filter((item) => item.M_GROUP === 'DT');

  let usersList = json.map((user) => ({
    name: user.C_NAME,
    title: user.C_NAME,
    email: user.C_CODE,
    value: user.C_CODE.substring(0, 2),
  }));

  usersList = usersList.filter((user) => user.email.endsWith('000'));
  usersList = usersList.filter((user) => user.name && user.email);
  usersList.sort((a, b) => a.email.localeCompare(b.email));

  let newUserList = usersList.map((user) => ({
    title: user.name,
    subgroupCode: getNextSubgroupCode(accountMasterData, user.value),
  }));

  return newUserList;
}

function getNextSubgroupCode(accountMasterData, subGroup) {
  let maxCode = 0;

  // Filter entries in accountMasterData that match the current subGroup prefix
  const filterData = accountMasterData.filter((entry) => entry.subgroup.startsWith(subGroup));

  if (filterData.length > 0) {
    // Iterate through filtered data to find the highest subgroup number
    filterData.forEach((entry) => {
      const entryNumber = parseInt(entry.subgroup.slice(2), 10); // Get the numeric part of the subgroup code
      if (maxCode < entryNumber) {
        maxCode = entryNumber;
      }
    });
    // Increment the max code for the new subgroup
    return subGroup + (maxCode + 1).toString().padStart(3, '0');
  }

  // If no matching subgroup exists, return the initial code
  return `${subGroup}001`;
}

app.get('/cash-receipts', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'db', 'cash-receipts.json');
  let nextReceiptNo = 1;

  try {
    const data = await fs.readFile(filePath, 'utf8').then(
      (data) => JSON.parse(data),
      (error) => {
        if (error.code !== 'ENOENT') throw error; // Ignore file not found errors
      },
    );
    if (data && data.length) {
      const lastEntry = data[data.length - 1];
      nextReceiptNo = Number(lastEntry.receiptNo) + 1;
    }
  } catch (error) {
    console.error('Failed to read or parse cash-receipts.json:', error);
    res.status(500).send('Server error');
    return;
  }

  res.send({ nextReceiptNo });
});

app.get('/subgrp', async (req, res) => {
  try {
    const cmplData = await getCmplData();
    const accountMasterPath = path.join(__dirname, '..', 'db', 'account-master.json');
    const accountMasterData = JSON.parse(await fs.readFile(accountMasterPath, 'utf8'));

    let partyList = newData(cmplData, accountMasterData);
    console.log('Generated Party List:', partyList);
    res.json(partyList);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).send('Server error');
  }
  z;
});

app.get('/cash-payments', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'db', 'cash-payments.json');
  let nextReceiptNo = 1;

  try {
    const data = await fs.readFile(filePath, 'utf8').then(
      (data) => JSON.parse(data),
      (error) => {
        if (error.code !== 'ENOENT') throw error; // Ignore file not found errors
      },
    );
    if (data && data.length) {
      const lastEntry = data[data.length - 1];
      nextReceiptNo = Number(lastEntry.voucherNo) + 1;
    }
  } catch (error) {
    console.error('Failed to read or parse cash-payments.json:', error);
    res.status(500).send('Server error');
    return;
  }

  res.send({ nextReceiptNo });
});

app.post('/editCashPay', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'db', 'cash-payments.json');
  try {
    // Read the cash-payments.json file
    const data = await fs.readFile(filePath, 'utf8');
    let cashPayments = JSON.parse(data);

    // Extract and trim the voucherNo from the request body
    const { voucherNo, date, series, party, amount, discount } = req.body;
    const trimmedVoucherNo = voucherNo.trim();

    // Find the index of the entry with the provided voucherNo
    const entryIndex = cashPayments.findIndex(
      (entry) => entry.voucherNo.trim() === trimmedVoucherNo,
    );

    if (entryIndex === -1) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    // Update the entry
    cashPayments[entryIndex] = {
      ...cashPayments[entryIndex], // preserve any fields not being updated
      date,
      series,
      party,
      amount,
      discount,
    };

    // Write the updated data back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(cashPayments, null, 2));

    res.status(200).json({ message: 'Cash payment updated successfully' });
  } catch (error) {
    console.error('Failed to update cash-payments.json:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/editCashReciept', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'db', 'cash-receipts.json');
  try {
    // Read the cash-receipts.json file
    const data = await fs.readFile(filePath, 'utf8').then(
      (data) => JSON.parse(data),
      (error) => {
        if (error.code === 'ENOENT') return [];
        throw error;
      },
    );

    // Extract and trim the receiptNo from the request body
    const { receiptNo, date, series, party, amount, discount } = req.body;
    const trimmedReceiptNo = receiptNo.trim();

    // Find the index of the entry with the provided receiptNo
    const entryIndex = data.findIndex((entry) => entry.receiptNo.trim() === trimmedReceiptNo);

    if (entryIndex === -1) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    // Update the entry
    data[entryIndex] = {
      ...data[entryIndex], // preserve any fields not being updated
      date,
      series,
      party,
      amount,
      discount,
    };

    // Write the updated data back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'Cash receipt updated successfully' });
  } catch (error) {
    console.error('Failed to update cash-receipts.json:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

async function getNextGodownId(req, res) {
  const filePath = path.join(__dirname, '..', 'db', 'godown.json');
  let nextGodownId = 1;

  try {
    const data = await fs.readFile(filePath, 'utf8').then(
      (data) => JSON.parse(data),
      (error) => {
        if (error.code !== 'ENOENT') throw error; // Ignore file not found errors
      },
    );
    const GodownId = data[data.length - 1].id;
    const nextGodownId = Number(GodownId) + 1;
    res.send({ nextGodownId });
  } catch (error) {
    console.error('Failed to read or parse godowns.json:', error);
    res.status(500).send('Server error');
  }
}

async function getNextInvoiceId(req, res) {
  const filePath = path.join(__dirname, '..', 'db', 'invoicing.json');
  let nextGodownId = 1;

  try {
    const data = await fs.readFile(filePath, 'utf8').then(
      (data) => JSON.parse(data),
      (error) => {
        if (error.code !== 'ENOENT') throw error; // Ignore file not found errors
      },
    );
    const GodownId = data[data.length - 1].id;
    const nextInvoiceId = Number(GodownId) + 1;
    res.send({ nextInvoiceId });
  } catch (error) {
    console.error('Failed to read or parse godowns.json:', error);
    res.status(500).send('Server error');
  }
}

async function printGodown(req, res) {
  try {
    const { retreat } = req.query;
 
    let godownData = await fs.readFile(path.join(__dirname, '..', 'db', 'godown.json'), 'utf8');
     godownData = JSON.parse(godownData);
 
    const godown = godownData.find((godown) => godown.id === retreat);

    const pmplData = await getPMPLData();


    godown.items.forEach((item) => {
        const pmplItem = pmplData.find((pmplItem) => pmplItem.CODE === item.code);
        console.log("pmplItem", pmplItem);
        if (pmplItem) {
            item.particular = pmplItem.PRODUCT;
            item.pack = pmplItem.PACK;
            item.gst = pmplItem.GST;
        }
        console.log("myitem", item);
    });
    res.send(godown);
} catch (error) {
    console.error('Error fetching data:', error);
}
}

const   EditUser = async (req, res) => {
  const { id, name, number,  routeAccess, password, powers } = req.body;
  console.log('Editing user', id, number,  routeAccess, powers, password);

  try {
    // Read users from users.json file
    let users = await fs.readFile(path.join(__dirname, '../db/users.json'));
    // Find the user by ID
    users = JSON.parse(users);
    const user = users.find((user) => user.id === id);

    if (user) {
      // Update the user details
      user.name = name;
      user.number = number;
      user.routeAccess = routeAccess;
      user.password = password;
      user.powers = powers;

      // Save the updated users list back to the JSON file
      await fs.writeFile(path.join(__dirname, '../db/users.json'), JSON.stringify(users, null, 2)); 
      

      console.log(`User with ID: ${id} updated successfully.`);
      // res.redirect('/admin'); // Redirect back to admin page after successful update
      res.status(200).send({id: id, message: 'User updated successfully'});
    } else {
      // If user with the provided ID is not found, return an error
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server error');
  }
};

app.get('/json/users', async (req, res) => {  
  try {
    const users = await fs.readFile(path.join(__dirname, '../db/users.json'));
    res.send(users);
  } catch (error) {
    console.error('Failed to read users.json:', error);
    res.status(500).send('Server error');
  }
}
);

app.post('/addUser', async (req, res) => {
  const { name, number, password, routeAccess, powers ,username } = req.body;
  try {
    let users = await fs.readFile('./db/users.json');
    users = JSON.parse(users);
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0); // Find max id

    const newUser = {
      id: maxId + 1,
      name: name,
      username: username,
      number: number,
      password: password,
      routeAccess: routeAccess,
      powers: powers,
    };

    users.push(newUser);
    await fs.writeFile('./db/users.json', JSON.stringify(users, null, 2));
    res.status(201).send({ message: 'User added successfully', id: newUser.id });
  } catch (error) {
    console.error('Failed to add user:', error);
    res.status(500).send('Server error');
  }
});

app.post('/editUser', EditUser);
app.get('/printGodown' ,printGodown);
app.get('/godownId', getNextGodownId);
app.get('/invoiceId', getNextInvoiceId);

module.exports = app;
