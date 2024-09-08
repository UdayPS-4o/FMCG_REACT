import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete, Divider } from '@mui/material';
import constants from 'src/constants';
import CollapsibleItemSection from './CollapsibleItemSection'; // Adjust the import based on your file structure

function FormSeparator() {
  const [partyOptions, setPartyOptions] = useState([]);
  const [fromGodown, setFromGodown] = useState(null);
  const [toGodown, setToGodown] = useState(null);
  const [formValues, setFormValues] = useState({
    date: '2024-08-10',
    series: 'T',
    fromGodown: '',
    toGodown: '',
    items: [
      {
        item: '',
        stock: '',
        pack: '',
        gst: '',
        unit: '',
        pcBx: '',
        mrp: '',
        rate: '',
        qty: '',
      },
    ],
  });
  const [expanded, setExpanded] = useState(0);
  const [pmplData, setPmplData] = useState([]);
  const baseURL = constants.baseURL;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${baseURL}/api/dbf/godown.json`);
        const data = await res.json();

        const pmplRes = await fetch(`${baseURL}/api/dbf/pmpl.json`);
        const pmplData = await pmplRes.json();
        setPmplData(pmplData);

        if (Array.isArray(data)) {
          setPartyOptions(data);
        } else {
          console.error('Data fetched is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFromGodownChange = (event, newValue) => {
    setFromGodown(newValue);
    setFormValues({ ...formValues, fromGodown: newValue });
    setToGodown(null);
  };

  const handleToGodownChange = (event, newValue) => {
    setToGodown(newValue);
    setFormValues({ ...formValues, toGodown: newValue });
  };

  const addItem = () => {
    setFormValues({
      ...formValues,
      items: [
        ...formValues.items,
        {
          item: '',
          stock: '',
          pack: '',
          gst: '',
          unit: '',
          pcBx: '',
          mrp: '',
          rate: '',
          qty: '',
        },
      ],
    });
    setExpanded(formValues.items.length); // Automatically expand the newly added accordion
  };

  const removeItem = (index) => {
    const newItems = formValues.items.filter((_, i) => i !== index);
    setFormValues({ ...formValues, items: newItems });
  };

  const updateItem = (index, newData) => {
    const newItems = formValues.items.map((item, i) => (i === index ? newData : item));
    setFormValues({ ...formValues, items: newItems });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = async () => {
    const payloadId = await fetch(`${baseURL}/slink/godownId`).then((res) => res.json());
    const { fromGodown, toGodown, items } = formValues;
    const payload = {
      ...formValues,
      id: payloadId.nextGodownId,
      fromGodown: fromGodown?.GDN_CODE || '',
      toGodown: toGodown?.GDN_CODE || '',
      items: items.map((el) => ({
        code: el.item,
        qty: el.qty,
        unit: el.unit,
      })),
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
    };

    try {
      const res = await fetch(`${baseURL}/godown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    // console.log('Form data:', payload);
    // alert(JSON.stringify(payload, null, 2));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="date"
            type="date"
            label="Date"
            fullWidth
            value={formValues.date}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                name="series"
                label="Series"
                fullWidth
                value={formValues.series}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField name="#" label="#" fullWidth disabled />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={partyOptions}
            getOptionLabel={(option) => option.GDN_NAME}
            value={fromGodown}
            onChange={handleFromGodownChange}
            renderInput={(params) => <TextField {...params} label="From Godown" fullWidth />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={partyOptions.filter((option) => option.GDN_NAME !== fromGodown?.GDN_NAME)}
            getOptionLabel={(option) => option.GDN_NAME}
            value={toGodown}
            onChange={handleToGodownChange}
            renderInput={(params) => <TextField {...params} label="To Godown" fullWidth />}
          />
        </Grid>

        <Grid item xs={12}>
          {formValues.items.map((item, index) => (
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
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Save changes
            </Button>
            <Button variant="text" color="error">
              Cancel
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default FormSeparator;
