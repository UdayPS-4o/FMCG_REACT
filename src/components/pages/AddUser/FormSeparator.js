import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField } from '@mui/material';
import constants from 'src/constants';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [sm, setSm] = useState(null);
  const [items, setItems] = useState([]);

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
      <Grid item xs={12} sm={6}>
        <TextField label="Name" type="text" fullWidth defaultValue="" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Select Route Access" type="text" fullWidth defaultValue="" />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField label="Number" placeholder="T" fullWidth />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Password" placeholder="Y" fullWidth />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField label="Select Powers" type="text" fullWidth defaultValue="" />
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default FormSeparator;
