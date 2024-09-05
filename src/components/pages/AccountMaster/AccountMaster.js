import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import constants from 'src/constants';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [sm, setSm] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);
  const [stateCountry, setStateofCountry] = useState([]);
  const [subGroupCode, setSubGroupCode] = useState(null);
  const [isEDIT, setIsEDIT] = useState(false);
  const [initialValues, setInitialValues] = useState({
    achead: '',
    addressline1: '',
    addressline2: '',
    place: '',
    pincode: '',
    mobile: '',
    pan: '',
    aadhar: '',
    gst: '',
    dlno: '',
    fssaino: '',
    email: '',
    statecode: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('edit')) {
      setIsEDIT(true);
      const subgroup = currentUrl.split('?sub=').pop();

      const fetchAccountData = async () => {
        try {
          const accounts = await fetch(constants.baseURL + '/json/account-master');
          const data = await accounts.json();

          const account = data.find((account) => account.subgroup === subgroup);

          if (account) {
            setPartyOptions([{ label: account.subgroup, value: account.subgroup }]);
            setSubGroupCode(account.subgroup);
            console.log(account.aadhar);

            // Set the form fields with the fetched data
            setInitialValues({
              achead: account.achead,
              addressline1: account.addressline1,
              addressline2: account.addressline2,
              place: account.place,
              pincode: account.pincode,
              mobile: account.mobile,
              pan: account.pan,
              aadhar: account.aadhar,
              gst: account.gst,
              dlno: account.dlno,
              fssaino: account.fssaino,
              email: account.email,
              statecode: account.statecode,
            });

            // Set the state options if needed
            const stateres = await fetch(constants.baseURL + '/api/dbf/state.json');
            const statedata = await stateres.json();
            const stateList = statedata.map((state) => ({
              value: state.ST_CODE,
              label: state.ST_NAME,
            }));

            setSmOptions(stateList);
            setStateofCountry(stateList);
          } else {
            toast.error('Subgroup not found');
          }
        } catch (error) {
          console.log(error);
          toast.error('Failed to fetch account details');
        }
      };

      fetchAccountData();
    } else {
      setIsEDIT(false);
      const fetchAccountData = async () => {
        try {
          const res = await fetch(constants.baseURL + '/slink/subgrp');
          const data = await res.json();
          setPartyOptions(
            data.map((party) => ({
              label: party.title,
              value: party.subgroupCode,
            })),
          );

          const stateres = await fetch(constants.baseURL + '/api/dbf/state.json');
          const statedata = await stateres.json();
          setSmOptions(
            statedata.map((state) => ({
              value: state.ST_CODE,
              label: state.ST_NAME,
            })),
          );
        } catch (error) {
          toast.error('Failed to fetch account details');
        }
      };

      fetchAccountData();
    }
  }, []);

  const handlePartyChange = (event, newValue) => {
    setParty(newValue?.label || null);
    setSubGroupCode(newValue?.value || null);
  };

  const handleSmChange = (event, newValue) => {
    setSm(newValue || null);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            values.subgroup = subGroupCode;

            const stateCode = stateCountry.find((state) => state.label === sm?.label);
            values.statecode = stateCode?.value;
            // const route = "/account-master";
            // if url -> edit then /edit/account-master else /account-master
            const currentUrl = window.location.href;
            const route = isEDIT ? `/edit/account-master` : `/account-master`;

            const res = await fetch(constants.baseURL + route, {
              method: 'POST',
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await res.json();
            console.log(res);

            if (res.status === 200 || res.status === 204) {
              toast.success(data.message);
              navigate('/db/account-master');
            } else {
              toast.error(data.message);
            }
          } catch (error) {
            toast.success('Submitted');
            navigate('/db/account-master');
          } finally {
            setSubmitting(false);
          }
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
                <Field required name="achead" as={TextField} label="A/C Head" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  required
                  name="addressline1"
                  as={TextField}
                  label="Address Line 1"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  required
                  name="addressline2"
                  as={TextField}
                  label="Address Line 2"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="place" as={TextField} label="Place" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  required
                  name="pincode"
                  as={TextField}
                  label="Pin Code"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  required
                  name="mobile"
                  as={TextField}
                  type="number"
                  maxLength="10"
                  minLength="10"
                  label="Mobile"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="pan" as={TextField} label="PAN" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  required
                  name="aadhar"
                  as={TextField}
                  label="Aadhar"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="gst" as={TextField} label="GSTIN" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="dlno" as={TextField} label="DL NO." fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="fssaino" as={TextField} label="FSSAI NO." fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="email" as={TextField} label="Email" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={smOptions}
                  getOptionLabel={(option) => option.label}
                  onChange={handleSmChange}
                  renderInput={(params) => <TextField {...params} label="State Code" fullWidth />}
                  // autoHighlight={true}
                  value={
                    smOptions.find((option) => option.label === initialValues.statecode) || null
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    Save Changes
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => navigate('/db/account-master')}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <ToastContainer />
          </Form>
        )}
      </Formik>
    </>
  );
}

export default FormSeparator;
