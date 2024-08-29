
import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import constants from 'src/constants';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const baseURL = constants.baseURL;

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

      setPartyOptions(partyList);
    };

    fetchOptions();
  }, []);

  const handlePartyChange = (event, newValue) => {
    setParty(newValue);
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        values.party = party;
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Field
                name="date"
                type="date"
                as={TextField}
                label="Date"
                fullWidth
                defaultValue="2024-08-10"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field name="series" as={TextField} label="Series" placeholder="T" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field
                name="receipt_no"
                as={TextField}
                label="Receipt No."
                type="number"
                fullWidth
                defaultValue={56}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field
                name="amount"
                as={TextField}
                label="Amount"
                type="number"
                fullWidth
                defaultValue={0.2}
              />
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
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
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