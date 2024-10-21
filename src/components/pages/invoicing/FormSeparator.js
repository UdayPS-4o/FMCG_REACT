import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, Divider, TextField, Autocomplete } from '@mui/material';
import CollapsibleItemSection from './CollapsibleItemSection';
import constants from 'src/constants';
import { ToastContainer, toast } from 'react-toastify';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [sm, setSm] = useState(null);
  const [date, setDate] = useState('2024-08-10');
  const [series, setSeries] = useState('');
  const [cash, setCash] = useState('');
  const [dueDays, setDueDays] = useState('');
  const [ref, setRef] = useState('');
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
  const [errors, setErrors] = useState({});
  const [searchItems, setSearchItems] = useState('');
  const [clicked, setClicked] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};

    if (!party) {
      newErrors.party = 'Party is required';
    }

    if (!sm) {
      newErrors.sm = 'S/M is required';
    }

    if (items.some((item) => !item.item || !item.qty || !item.rate)) {
      newErrors.items = 'Each item must have a name, quantity, and rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setClicked(true);
    if (!validateForm()) {
      return; // Stop submission if the form is invalid
    }

    console.log('Party:', party);
    console.log('S/M:', sm);
    console.log('Items:', items); // Log the array of objects

    const InvoiceId = await fetch(`${baseURL}/slink/invoiceId`).then((res) => res.json());
    console.log('InvoiceId', InvoiceId);
    const data = {
      date,
      series,
      cash,
      id: InvoiceId.nextInvoiceId,
      party: party?.value || '',
      sm: sm?.value || '',
      dueDays,
      ref,
      items,
    };

    console.log('Data:', data);
    try {
      let res = await fetch(`${baseURL}/invoicing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('res', res);
      res = await res.json();
      toast.success(res.message);
      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error('Failed to add invoice');
    }
    // Simulate form submission or handle your submission logic here
  };
  const sortedFormValues = () => {
    console.log('items:', items);
    if (!searchItems) return items;

    return items
      .filter((item) => item.item.toLowerCase().includes(searchItems.toLowerCase()))
      .sort((a, b) => a.item.localeCompare(b.item));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Series"
          placeholder="T"
          fullWidth
          value={series}
          onChange={(e) => setSeries(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Cash"
          placeholder="Y"
          fullWidth
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={partyOptions}
          getOptionLabel={(option) => option.label}
          onChange={handlePartyChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Party"
              fullWidth
              error={!!errors.party}
              helperText={errors.party}
              required={true}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={smOptions}
          getOptionLabel={(option) => option.label}
          onChange={handleSmChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="S/M"
              fullWidth
              error={!!errors.sm}
              helperText={errors.sm}
              required={true}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Due Days"
          fullWidth
          value={dueDays}
          onChange={(e) => setDueDays(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Reference"
          fullWidth
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Search Items"
          fullWidth
          value={searchItems}
          onChange={(e) => setSearchItems(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} alignItems="stretch">
        {sortedFormValues().map((item, index) => (
          <CollapsibleItemSection
            key={index}
            index={index}
            itemData={item}
            handleChange={handleAccordionChange}
            expanded={expanded}
            updateItem={updateItem}
            removeItem={removeItem}
            pmplData={pmplData}
            errors={errors.items}
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
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={clicked}>
            Submit
          </Button>
          <Button variant="text" color="error">
            Cancel
          </Button>
        </Stack>
      </Grid>
      <ToastContainer />
    </Grid>
  );
}

export default FormSeparator;
