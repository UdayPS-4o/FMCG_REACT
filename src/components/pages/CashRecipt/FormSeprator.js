import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import constants from 'src/constants';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const baseURL = constants.baseURL;
  const [defulatval, setDefulatval] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch(baseURL + '/cmpl');
      const data = await res.json();
      const balanceRes = await fetch(baseURL + '/json/balance');
      const balanceData = await balanceRes.json();

      const getBalance = (C_CODE) =>
        balanceData.data.find((user) => user.partycode === C_CODE)?.result || 0;

      const partyList = data.map((user) => ({
        value: user.C_CODE,
        label: `${user.C_NAME} | ${getBalance(user.C_CODE)}`,
      }));

      const defultval = await fetch(baseURL + '/slink/cash-receipts');
      const defultvaldata = await defultval.json();
      console.log('defultvaldata', defultvaldata);
      setDefulatval(defultvaldata.nextReceiptNo);
      setPartyOptions(partyList);
    };

    fetchOptions();
  }, []);

  const handlePartyChange = (event, newValue) => {
    setParty(newValue);
  };

  return (
    <Formik
      initialValues={{
        date: '', // Initial value for the date
        series: '',
        amount: '',
        discount: '',
        receipt_no: '',
      }}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        values.party = party?.value;
        values.name = party?.label;

        // Set receipt number from the default value
        values.receiptNo = defulatval;

        let res = await fetch(constants.baseURL + '/cash-receipts', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        let data = await res.text();
        console.log('data', data);
        console.log(values.date, 'date ');
        alert(JSON.stringify(data, null, 2));
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Field
                name="date"
                type="date"
                as={TextField}
                label="Date"
                fullWidth
                onChange={(event) => setFieldValue('date', event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field name="series" as={TextField} label="Series" placeholder="T" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Receipt No."
                type="number"
                fullWidth
                disabled
                value={defulatval || ''}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field name="amount" as={TextField} label="Amount" type="number" fullWidth />
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
              <Field name="discount" as={TextField} label="Discount" type="number" fullWidth />
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
