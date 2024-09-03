import React, { useState, useEffect } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import constants from 'src/constants';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [sm, setSm] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);
  const [stateCountry, setStateofCountry] = useState([]);

  const [subGroupCode, setSubGroupCode] = useState(null);
  const navigate = useNavigate();

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(constants.baseURL + '/slink/subgrp');
        const data = await res.json();

        const partyList = data.map((party) => ({
          label: party.title,
          value: party.subgroupCode,
        }));
        setPartyOptions(partyList);

        const stateres = await fetch(constants.baseURL + '/api/dbf/state.json');
        const statedata = await stateres.json();

        const stateList = statedata.map((state) => ({
          value: state.ST_CODE,
          label: state.ST_NAME,
        }));

        setSmOptions(stateList);
        setStateofCountry(stateList);
      } catch (error) {
        toast.error('Failed to fetch options');
      }
    };

    fetchOptions();
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
        initialValues={{}}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            values.subgroup = subGroupCode;

            const stateCode = stateCountry.find((state) => state.label === sm?.label);
            values.statecode = stateCode?.value;

            const res = await fetch(constants.baseURL + '/account-master', {
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
              // Navigate('/db/account-master');
            } else {
              toast.error(data.message);
            }
          } catch (error) {
            toast.success('submitted');
            // Navigate('/db/account-master');
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
            <ToastContainer />
          </Form>
        )}
      </Formik>
    </>
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

export const EditAccountMaster = () => {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [smOptions, setSmOptions] = useState([]);
  const [stateCountry, setStateofCountry] = useState([]);
  const [subGroupCode, setSubGroupCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountMaster = async () => {
      try {
        const res = await fetch(constants.baseURL + '/account-master/' + id);
        const data = await res.json();
        setInitialValues(data);
        setSubGroupCode(data.subgroupCode);
      } catch (error) {
        toast.error('Failed to fetch account master');
      }
    };

    const fetchOptions = async () => {
      try {
        const res = await fetch(constants.baseURL + '/slink/subgrp');
        const data = await res.json();
        const partyList = data.map((party) => ({
          label: party.title,
          value: party.subgroupCode,
        }));
        setPartyOptions(partyList);

        const stateres = await fetch(constants.baseURL + '/api/dbf/state.json');
        const statedata = await stateres.json();
        const stateList = statedata.map((state) => ({
          value: state.ST_CODE,
          label: state.ST_NAME,
        }));

        setSmOptions(stateList);
        setStateofCountry(stateList);
      } catch (error) {
        toast.error('Failed to fetch options');
      }
    };

    fetchAccountMaster();
    fetchOptions();
  }, [id]);

  const handlePartyChange = (event, newValue) => {
    setSubGroupCode(newValue?.value || null);
  };

  const handleSmChange = (event, newValue) => {
    const selectedState = newValue || null;
    if (selectedState) {
      setInitialValues((prev) => ({
        ...prev,
        statecode: selectedState.value,
      }));
    }
  };

  return (
    <PageContainer title="Edit Account Master" description="Edit Account Master">
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <ParentCard title="Edit Account Master">
            <Formik
              initialValues={initialValues}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  values.subgroup = subGroupCode;

                  const res = await fetch(constants.baseURL + '/account-master/' + id, {
                    method: 'PUT',
                    body: JSON.stringify(values),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  const data = await res.json();

                  if (res.status === 200) {
                    toast.success('Account Master updated successfully');
                    navigate('/db/account-master');
                  } else {
                    toast.error(data.message);
                  }
                } catch (error) {
                  toast.error('Failed to update account master');
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
                        defaultValue={partyOptions.find(
                          (option) => option.value === initialValues.subgroupCode,
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Sub Group" fullWidth />
                        )}
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
                        defaultValue={smOptions.find(
                          (option) => option.value === initialValues.statecode,
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="State Code" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
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
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Forms;
