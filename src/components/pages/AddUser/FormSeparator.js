import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import constants from 'src/constants';

import UserTable from './UserTable';

function FormSeparator() {
  const [routeAccessOptions, setRouteAccessOptions] = useState([]);
  const [powersOptions, setPowersOptions] = useState([]);
  const baseURL = constants.baseURL;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch(baseURL + '/json/users');
      const users = await res.json();

      // Sorting the data by `id`
      const sortedData = users.sort((a, b) => a.id - b.id);
      setData(sortedData);

      const routeAccessList = [
        ...new Set(
          users.flatMap((user) =>
            Array.isArray(user.routeAccess) ? user.routeAccess : [user.routeAccess],
          ),
        ),
      ];

      const powersList = [
        ...new Set(
          users.flatMap((user) => (Array.isArray(user.powers) ? user.powers : [user.powers])),
        ),
      ];

      // setRouteAccessOptions(routeAccessList);
      // setPowersOptions(powersList);
    };

    fetchOptions();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          number: '',
          password: '',
          routeAccess: [],
          powers: [],
        }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <Grid container spacing={2}>
              {/* First Row */}
              <Grid item xs={12} sm={6}>
                <Field name="name" as={TextField} label="Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  options={routeAccessOptions}
                  getOptionLabel={(option) => option}
                  value={values.routeAccess}
                  onChange={(event, newValue) => {
                    setFieldValue('routeAccess', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Route Access" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Field name="number" as={TextField} label="Number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Field name="password" as={TextField} label="Password" fullWidth />
              </Grid>

              {/* Second Row */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  options={powersOptions}
                  getOptionLabel={(option) => option}
                  value={values.powers}
                  onChange={(event, newValue) => {
                    setFieldValue('powers', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Powers" fullWidth />
                  )}
                />
              </Grid>

              {/* Submit Button */}
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Stack spacing={2} direction="row">
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Stack>
            </div>
          </Form>
        )}
      </Formik>
      {/* Pass sorted data to UserTable */}
      <div
        style={{
          padding: '20px',
        }}
      >
        <UserTable data={data} />
      </div>
    </>
  );
}

export default FormSeparator;
