import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete, Divider } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import constants from 'src/constants';
import CollapsibleItemSection from './CollapsibleItemSection'; // Adjust the import based on your file structure

function FormSeparator() {
  const [partyOptions, setPartyOptions] = useState([]);
  const [fromGodown, setFromGodown] = useState(null);
  const [toGodown, setToGodown] = useState(null);
  const [items, setItems] = useState([
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
  ]);
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

        const balanceRes = await fetch(`${baseURL}/json/balance`);
        const balanceData = await balanceRes.json();

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

  const handleFromGodownChange = (event, newValue) => {
    console.log('From Godown:', newValue);
    setFromGodown(newValue);
    setToGodown(null);
  };

  const handleToGodownChange = (event, newValue) => {
    setToGodown(newValue);
  };

  const addItem = () => {
    setItems([
      ...items,
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

  const handleSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 500));
    values.fromGodown = fromGodown;
    values.toGodown = toGodown;
    values.items = items;
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Field
                name="date"
                type="date"
                as={TextField}
                label="Date"
                fullWidth
                defaultValue="2024-08-10"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Field
                    name="series"
                    as={TextField}
                    label="Series"
                    fullWidth
                    defaultValue="T"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field name="#" as={TextField} label="#" fullWidth disabled defaultValue="" />
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
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Save changes
                </Button>
                <Button variant="text" color="error">
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default FormSeparator;
