import React, { useState, useEffect } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import constants from 'src/constants';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [sm, setSm] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch(constants.baseURL + '/cmpl');
      const data = await res.json();

      const pmplRes = await fetch(constants.baseURL + '/api/dbf/pmpl.json');
      const pmplData = await pmplRes.json();
      const balanceRes = await fetch(constants.baseURL + '/json/balance');
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

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        values.party = party;
        values.sm = sm;
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={partyOptions}
                getOptionLabel={(option) => option.label}
                onChange={handlePartyChange}
                renderInput={(params) => <TextField {...params} label="Sub Group" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="a/c_head" as={TextField} label="A/C Head" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="address_l1" as={TextField} label="Address Line 1" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="address_l2" as={TextField} label="Address Line 2" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="place" as={TextField} label="Place" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="pin_Code" as={TextField} label="Pin Code" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="mobile" as={TextField} label="Mobile" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="pan" as={TextField} label="PAN" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="aadhar" as={TextField} label="Aadhar" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="gstin" as={TextField} label="GSTIN" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="dl_no" as={TextField} label="DL NO." fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="fssai" as={TextField} label="FSSAI NO." fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="email" as={TextField} label="Email" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={smOptions}
                getOptionLabel={(option) => option.label}
                onChange={handleSmChange}
                renderInput={(params) => <TextField {...params} label="S/M" fullWidth />}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Save Changes
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

function Forms() {
  return (
    <PageContainer title="Vertical Form" description="Account Master">
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <ParentCard title="Account Master">
            <FormSeparator />
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default Forms;
