import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import constants from 'src/constants';
import { toast, ToastContainer } from 'react-toastify';
import UserTable from './UserTable';
import { use } from 'i18next';
import { set } from 'lodash';

function UserForm() {
  const [routeAccessOptions, setRouteAccessOptions] = useState(['Account Master', 'Invoicing', 'Cash Receipt', 'Godown Transfer', 'Database']);
  const [partyOptions, setPartyOptions] = useState([]);
  const [powersOptions, setPowersOptions] = useState(['Read', 'Write', 'Delete']);
  const [initialValues, setInitialValues] = useState({
    name: '',
    number: '',
    password: '',
    routeAccess: [],
    powers: [],
  });

  const [data, setData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const url = `${constants.baseURL}/slink/json/users`;
      try {
        const response = await fetch(url);
        const users = await response.json();
        setData(users);

        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');

        if (userId && users.length) {
          const userToEdit = users.find((user) => user.id === Number(userId));
          console.log(userToEdit, 'userToEdit');
          if (userToEdit) {
            setIsEdit(true);
            setInitialValues({
              id: userToEdit.id,
              name: userToEdit.name,
              number: userToEdit.number,
              password: userToEdit.password,
              routeAccess: Array.isArray(userToEdit.routeAccess)
                ? userToEdit.routeAccess
                : [userToEdit.routeAccess],
              powers: Array.isArray(userToEdit.powers) ? userToEdit.powers : [userToEdit.powers],
              subgroup: userToEdit.subgroup,
            });
          } else {
            toast.error('User not found');
          }
        }

        setRouteAccessOptions([...new Set(users.flatMap((user) => user.routeAccess || []))]);
        setPowersOptions([...new Set(users.flatMap((user) => user.powers || []))]);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load user details');
      }
    };

    fetchUserData();
  }, [window.location.href]);

  useEffect(() => {
    const fetchPartyData = async () => {
      const url = `${constants.baseURL}/slink/subgrp`;
      try {
        const response = await fetch(url);
        const party = await response.json();
        setPartyOptions(party);
      } catch (error) {
        console.error('Failed to fetch party data:', error);
        toast.error('Failed to load party details');
      }
    };
    fetchPartyData();
  }, []);

  const handleSubmit = async (values) => {
    values.username = 'admin';

    // Extract only relevant `subgroup` fields to send in the request
    console.log(values, 'values'); 
    const payload = {
      ...values,
      subgroup: values.subgroup ? {
        title: values.subgroup.title,
      } : null,
    };

    
    const endpoint = isEdit ? '/slink/editUser' : '/slink/addUser';
    const url = `${constants.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the correct payload
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        toast.error(`Error: ${errorMessage.message}`);
        return;
      }

      const result = await response.json();
      toast.success(
        isEdit ? 'User updated successfully' : `User added successfully, ID: ${result.id}`,
      );
      if (isEdit === false) {
        setInitialValues({
          name: '',
          number: '',
          password: '',
          routeAccess: [],
          powers: [],
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please try again later.');
    }
  };


  return (
    <>
      <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Field required name="name" as={TextField} label="Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  required
                  multiple
                  options={routeAccessOptions}
                  getOptionLabel={(option) => option}
                  value={values.routeAccess}
                  onChange={(event, newValue) => setFieldValue('routeAccess', newValue)}
                  renderInput={(params) => <TextField {...params} label="Route Access" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="number" as={TextField} label="Phone Number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field required name="password" as={TextField} label="Password" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  required
                  multiple
                  options={powersOptions}
                  getOptionLabel={(option) => option}
                  value={values.powers}
                  onChange={(event, newValue) => setFieldValue('powers', newValue)}
                  renderInput={(params) => <TextField {...params} label="Powers" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={partyOptions}
                  getOptionLabel={(option) => option.title}
                  value={values.subgroup || null} // Make sure to pass the correct value or null
                  onChange={(event, newValue) => {
                    // Update Formik's `subgroup` field value when selection changes
                    setFieldValue('subgroup', newValue);
                  }}
                  isOptionEqualToValue={(option, value) => option.subgroupCode === value.subgroupCode}
                  renderInput={(params) => <TextField {...params} label="Sub Group" fullWidth />}
                />


              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isEdit ? 'Update User' : 'Add User'}
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
      {data && <UserTable data={data} toast={toast} />}
    </>
  );
}

export default UserForm;
