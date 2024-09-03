import React, { useState, useEffect } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import constants from 'src/constants';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { set } from 'lodash';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [sm, setSm] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);
  const [stateCountry, setStateofCountry] = useState([]);

  const [subGroupCode, setSubGroupCode] = useState(null);
  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch(constants.baseURL + '/slink/subgrp');
      const data = await res.json();
      console.log(data);

      const partyList = data.map((party) => ({
        label: party.title,
        value: party.subgroupCode,
      }));
      console.log(partyList);
      setPartyOptions(partyList);
      // console.log(partyList + 'partyOptions');
      // setPartyOptions(partyList);

      const stateres = await fetch(constants.baseURL + '/api/dbf/state.json');
      const statedata = await stateres.json();

      const stateList = statedata.map((state) => ({
        value: state.ST_CODE,
        label: state.ST_NAME,
      }));

      setSmOptions(stateList);
      setStateofCountry(stateList);
    };

    fetchOptions();
  }, []);

  const handlePartyChange = (event, newValue) => {
    setParty(newValue.label);
    //sett the subgroup code of the party
    console.log(newValue);
    setSubGroupCode(newValue.value);
  };

  const handleSmChange = (event, newValue) => {
    setSm(newValue);
  };

  // useEffect(() => {
  //   console.log(party);
  //   console.log(subGroupCode + 'subGroupCode');
  //   // console.log(sm);
  // }, [party, subGroupCode]);

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values) => {
        // values.subgroup = subGroupCode;
        console.log('handler', { values, party });
        values.subgroup = subGroupCode;
        console.log(values.subgroup);
        // values.receiptNo = recieptData.nextCode;

        const stateCode = stateCountry.find((state) => state.label === sm.label);
        values.statecode = stateCode?.value;

        const res = await fetch(constants.baseURL + '/account-master', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let groupCode = subGroupCode;
        groupCode = Number(groupCode.slice(2));
        groupCode++;
        let groupLetter = subGroupCode.slice(0, 2);
        groupCode = groupLetter + groupCode;
        console.log(groupCode);
        setSubGroupCode(groupCode);

        // setSubGroupCode(subGroupCode)
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
              <Field name="achead" as={TextField} label="A/C Head" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="addressline1" as={TextField} label="Address Line 1" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="addressline2" as={TextField} label="Address Line 2" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="place" as={TextField} label="Place" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="pincode" as={TextField} label="Pin Code" fullWidth />
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
              <Field name="gst" as={TextField} label="GSTIN" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="dlno" as={TextField} label="DL NO." fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="fssaino" as={TextField} label="FSSAI NO." fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field name="email" as={TextField} label="Email" fullWidth />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={smOptions}
                getOptionLabel={(option) => option.label}
                onChange={handleSmChange}
                renderInput={(params) => <TextField {...params} label="State Code" fullWidth />}
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
