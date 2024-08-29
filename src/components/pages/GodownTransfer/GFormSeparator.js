import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, Divider, TextField, Autocomplete } from '@mui/material';
import CollapsibleItemSection from './GCollapsibleItem';
import constants from 'src/constants';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [sm, setSm] = useState(null);
  const [items, setItems] = useState([
    {
      item: '',
      godown: '',
      unit: '',
      stock: '',
      pack: '',
      gst: '',
      pcBx: '',
      mrp: '',
      rate: '',
      qty: '',
      cess: '',
      schRs: '',
      sch: '',
      cd: '',
      amount: '',
      netAmount: '',
    },
  ]);
  const [expanded, setExpanded] = useState(0);
  const [partyOptions, setPartyOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);
  const [pmplData, setPmplData] = useState([]);
  const baseURL = constants.baseURL;
  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch(`${baseURL}/cmpl`);
      const data = await res.json();

      const pmplRes = await fetch(`${baseURL}/api/dbf/pmpl.json`);
      const pmplData = await pmplRes.json();
      setPmplData(pmplData);
      const balanceRes = await fetch(`${baseURL}/json/balance`);
      const balanceData = await balanceRes.json();

      const getBalance = (C_CODE) =>
        balanceData.data.find((user) => user.partycode === C_CODE)?.result || 0;

      const partyList = data.map((user) => ({
        value: user.C_CODE,
        label: `${user.C_NAME} | ${getBalance(user.C_CODE)}`,
      }));

      setPartyOptions(partyList);
      setSmOptions(partyList.filter((user) => user.value.startsWith('SM')));
    };

    fetchOptions();
  }, []);

  const handlePartyChange = (event, newValue) => {
    setParty(newValue);
  };

  const handleSmChange = (event, newValue) => {
    setSm(newValue);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item: '',
        godown: '',
        unit: '',
        stock: '',
        pack: '',
        gst: '',
        pcBx: '',
        mrp: '',
        rate: '',
        qty: '',
        cess: '',
        schRs: '',
        sch: '',
        cd: '',
        amount: '',
        netAmount: '',
      },
    ]);
    setExpanded(items.length); // Automatically expand the newly added accordion
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, newData) => {
    const newItems = items.map((item, i) => (i === index ? newData : item));
    setItems(newItems);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = () => {
    console.log('Party:', party);
    console.log('S/M:', sm);
    console.log('Items:', items); // Log the array of objects

    const postForm = document.createElement('form');
    postForm.method = 'POST';
    postForm.action = '/godown';

    const data = {
      date: document.querySelector('input[name="date"]').value,
      series: document.querySelector('input[name="series"]').value,
      cash: document.querySelector('input[name="Cash"]').value,
      party: party?.value || '',
      sm: sm?.value || '',
      dueDays: document.querySelector('input[name="due-days"]').value,
      ref: document.querySelector('input[name="ref"]').value,
      items,
    };

    Object.keys(data).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = key === 'items' ? JSON.stringify(data[key]) : data[key];
      postForm.appendChild(input);
    });

    document.body.appendChild(postForm);
    postForm.submit();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <TextField label="Date" type="date" fullWidth defaultValue="2024-08-10" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Series" placeholder="T" fullWidth />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Cash" placeholder="Y" fullWidth />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={partyOptions}
          getOptionLabel={(option) => option.label}
          onChange={handlePartyChange}
          renderInput={(params) => <TextField {...params} label="Party" fullWidth />}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={smOptions}
          getOptionLabel={(option) => option.label}
          onChange={handleSmChange}
          renderInput={(params) => <TextField {...params} label="S/M" fullWidth />}
        />
      </Grid>

      <Grid item xs={12} alignItems="stretch">
        {items.map((item, index) => (
          <CollapsibleItemSection
            key={index}
            index={index}
            itemData={item}
            handleChange={handleAccordionChange}
            expanded={expanded}
            updateItem={updateItem}
            removeItem={removeItem}
            pmplData={pmplData}
          />
        ))}
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Button variant="outlined" onClick={addItem}>
          Add Another Item
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="text" color="error">
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default FormSeparator;
