import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import constants from 'src/constants';
import useAuth from 'src/utils/useAuth';

function FormSeparator() {
  const [partyOptions, setPartyOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);
  const [stateCountry, setStateofCountry] = useState([]);
  const [subGroupCode, setSubGroupCode] = useState(null);
  const [isEDIT, setIsEDIT] = useState(false);
  const [SubName, setSubName] = useState('');
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
    subgroup: '',
  });
  const navigate = useNavigate();

  const { user } = useAuth();
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

            // Set the form fields with the fetched data
            setInitialValues({
              subgroup: account.subgroup,
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
          const stateList = statedata.map((state) => ({
            value: state.ST_CODE,
            label: state.ST_NAME,
          }));

          setSmOptions(stateList);
          setStateofCountry(stateList);
        } catch (error) {
          toast.error('Failed to fetch account details');
        }
      };

      fetchAccountData();
    }
  }, []);

  useEffect(() => {
    let subg = localStorage.getItem('subgroup');
    subg = JSON.parse(subg);
    console.log(subg);
    setInitialValues({
      ...initialValues,
      subgroup: subg.subgroupCode,
    });
    setSubName(subg.title);
  }, []);

  const handlePartyChange = (event, newValue) => {
    setSubGroupCode(newValue?.value || null);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            values.subgroup = subGroupCode;

            const route = isEDIT ? `/edit/account-master` : `/account-master`;

            const res = await fetch(constants.baseURL + route, {
              method: 'POST',
              body: JSON.stringify(values),
              headers: {
                'Content-Type': 'application/json',
              },
            });

            let data;
            if (res.status !== 204) {
              data = await res.json();
            }

            if (res.ok) {
              // checks for status code 200-299
              toast.success(data?.message || 'Submission successful!');
              navigate('/db/account-master');
            } else {
              toast.error(data?.message || 'An error occurred');
            }
          } catch (error) {
            toast.error('Submission failed' + error.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={partyOptions}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => {
                    handlePartyChange(event, newValue);
                    setFieldValue('subgroup', newValue?.label || '');
                  }}
                  renderInput={(params) => <TextField {...params} label="Sub Group" fullWidth />}
                  disabled={initialValues.subgroup != '' ? true : false}
                  value={
                    user
                      ? { label: user.subgroup.title, value: user.subgroup.subgroupCode }
                      : partyOptions.find((option) => option.value === subGroupCode)
                      ? partyOptions.find((option) => option.value === subGroupCode)
                      : initialValues.subgroup != ''
                      ? { label: SubName, value: initialValues.subgroup }
                      : { label: '', value: '' }
                  }
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
                <Field name="addressline2" as={TextField} label="Address Line 2" fullWidth />
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
                  type="text"
                  inputProps={{ maxLength: 6 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  required
                  name="mobile"
                  as={TextField}
                  type="text"
                  inputProps={{ maxLength: 10 }}
                  label="Mobile"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="pan" as={TextField} label="PAN" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="aadhar"
                  as={TextField}
                  label="Aadhar"
                  type="text"
                  inputProps={{ maxLength: 12 }}
                  fullWidth
                />
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
                  onChange={(event, newValue) => {
                    setFieldValue('statecode', newValue?.value || '');
                  }}
                  renderInput={(params) => <TextField {...params} label="State Code" fullWidth />}
                  value={smOptions.find((option) => option.value === values.statecode) || null}
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
