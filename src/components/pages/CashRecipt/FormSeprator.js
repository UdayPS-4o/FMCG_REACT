import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import constants from 'src/constants';

function FormSeparator() {
  const [party, setParty] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);
  const [receiptNo, setReceiptNo] = useState(null);
  const [initialValues, setInitialValues] = useState({
    date: new Date().toISOString().split('T')[0],
    series: '',
    amount: '',
    discount: '',
    receiptNo: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        const res = await fetch(constants.baseURL + '/json/cash-receipts');
        const data = await res.json();
        console.log('data', data);

        const params = new URLSearchParams(window.location.search);
        const receipt = params.get('sub');

        const receiptToEdit = data.find((rec) => rec.receiptNo === receipt);

        if (!receiptToEdit) {
          toast.error('Receipt record not found');
          return;
        }

        setReceiptNo(receiptToEdit.receiptNo);

        setInitialValues({
          date: receiptToEdit.date,
          series: receiptToEdit.series,
          amount: receiptToEdit.amount,
          discount: receiptToEdit.discount,
          receiptNo: receiptToEdit.receiptNo,
        });

        const resParty = await fetch(constants.baseURL + '/cmpl');
        const partyData = await resParty.json();
        const balanceRes = await fetch(constants.baseURL + '/json/balance');
        const balanceData = await balanceRes.json();

        const getBalance = (C_CODE) =>
          balanceData.data.find((user) => user.partycode === C_CODE)?.result || 0;

        const partyList = partyData.map((user) => ({
          value: user.C_CODE,
          label: `${user.C_NAME} | ${getBalance(user.C_CODE)}`,
        }));

        setPartyOptions(partyList);
        setParty(partyList.find((p) => p.value === receiptToEdit.party));
      } catch (error) {
        console.error('Failed to fetch data for edit:', error);
        toast.error('Failed to load receipt details');
      }
    };

    const fetchNewData = async () => {
      try {
        const resReceipt = await fetch(constants.baseURL + '/slink/cash-receipts');
        const dataReceipt = await resReceipt.json();
        setReceiptNo(dataReceipt.nextReceiptNo);

        const resParty = await fetch(constants.baseURL + '/cmpl');
        const dataParty = await resParty.json();
        const balanceRes = await fetch(constants.baseURL + '/json/balance');
        const balanceData = await balanceRes.json();

        const getBalance = (C_CODE) =>
          balanceData.data.find((user) => user.partycode === C_CODE)?.result || 0;

        const partyList = dataParty.map((user) => ({
          value: user.C_CODE,
          label: `${user.C_NAME} | ${getBalance(user.C_CODE)}`,
        }));

        setPartyOptions(partyList);
      } catch (error) {
        toast.error('Failed to fetch data for new entry');
      }
    };

    const currentUrl = window.location.href;
    if (currentUrl.includes('edit')) {
      setIsEditMode(true);
      fetchEditData();
    } else {
      fetchNewData();
    }
  }, []);

  const handlePartyChange = (event, newValue) => {
    setParty(newValue);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        values.receiptNo = `${receiptNo || values.receiptNo}`;
        values.party = party?.value;
        values.amount = `${values.amount}`;
        values.discount = `${values.discount}`;

        try {
          const route = isEditMode ? `/slink/editCashReciept` : `/cash-receipts`;
          const response = await fetch(constants.baseURL + route, {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            toast.error(`Error: ${errorMessage}`);
            return;
          }

          toast.success('Data saved successfully!');
          navigate('/db/cash-receipts');
        } catch (error) {
          console.error('Network error:', error);
          toast.error('Network error. Please try again later.');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Field
                required
                name="date"
                type="date"
                as={TextField}
                label="Date"
                fullWidth
                defaultValue={initialValues.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Receipt No."
                type="number"
                fullWidth
                disabled
                value={receiptNo || initialValues.receiptNo || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                required
                options={partyOptions}
                getOptionLabel={(option) => option.label}
                onChange={handlePartyChange}
                value={party || null}
                renderInput={(params) => (
                  <TextField {...params} label="Party" fullWidth required={true} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field required name="series" as={TextField} label="Series" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field required name="amount" as={TextField} label="Amount" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                required
                name="discount"
                type="number"
                as={TextField}
                label="Discount"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Save changes
                </Button>
                <Button variant="text" color="error" onClick={() => navigate('/db/cash-receipts')}>
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <ToastContainer />
        </Form>
      )}
    </Formik>
  );
}

export default FormSeparator;
