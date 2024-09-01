import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import constants from 'src/constants';
import { Formik, Form, Field } from 'formik';

function FormSeparator() {
  const [party, setParty] = useState(null);

  const handlePartyChange = (event, newValue) => {
    setParty(newValue);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch(constants.baseURL + '/cmpl');
      const data = await res.json();
      const balanceRes = await fetch(constants.baseURL + '/json/balance');
      const balanceData = await balanceRes.json();

      const getBalance = (C_CODE) =>
        balanceData.data.find((user) => user.partycode === C_CODE)?.result || 0;

      const partyList = data.map((user) => ({
        value: user.C_CODE,
        label: `${user.C_NAME} | ${getBalance(user.C_CODE)}`,
      }));
      console.log('partyList', partyList);

      setParty(partyList);
    };

    fetchOptions();
  }, []);

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        // await new Promise((r) => setTimeout(r, 500));
        console.log('submit');
        // values.party = party;
        // alert(JSON.stringify(values, null, 2));
        const defultval = await fetch(constants.baseURL + '/slink/cash-receipts');
        const defultvaldata = await defultval.json();
        // values.receipt_no = defultvaldata.nextReceiptNo;
        values.receiptNo = defultvaldata.nextReceiptNo;
        values.party = party?.value;
        values.name = party?.label;
        // fetch the value of party from the data
        //

        alert(JSON.stringify(values, null, 2));
      }}
    >
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
              <Field name="voucherNo" type="number" as={TextField} label="Voucher No." fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={party}
                getOptionLabel={(option) => option.label}
                onChange={handlePartyChange}
                renderInput={(params) => <TextField {...params} label="Party" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="series" as={TextField} label="Series" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="Amount" as={TextField} label="Amount" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="Discount" type="number" as={TextField} label="Discount" fullWidth />
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
