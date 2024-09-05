import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import constants from 'src/constants';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

function FormSeparator() {
  const [partyOptions, setPartyOptions] = useState([]);
  const [party, setParty] = useState(null);
  const [voucherNo, setVoucherNo] = useState(null);
  const [initialValues, setInitialValues] = useState({
    date: new Date().toISOString().split('T')[0],
    series: '',
    amount: '', // Changed to lowercase 'amount'
    discount: '', // Changed to lowercase 'discount'
    voucherNo: '',
  });
  const [isEDIT, setIsEDIT] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        const res = await fetch(constants.baseURL + '/json/cash-payments');
        const data = await res.json();
        console.log('data', data);

        const params = new URLSearchParams(window.location.search);
        const voucher = params.get('sub');

        const paymentToEdit = data.find((payment) => payment.voucherNo === voucher);
        console.log('paymentToEdit', paymentToEdit);

        if (!paymentToEdit) {
          toast.error('Payment record not found');
          return;
        }

        setVoucherNo(paymentToEdit.voucherNo);

        setInitialValues({
          date: paymentToEdit.date,
          series: paymentToEdit.series,
          amount: paymentToEdit.amount,
          discount: paymentToEdit.discount,
          voucherNo: paymentToEdit.voucherNo,
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
        setParty(partyList.find((p) => p.value === paymentToEdit.party));
      } catch (error) {
        console.error('Failed to fetch data for edit:', error);
        toast.error('Failed to load cash payment details');
      }
    };

    const fetchNewData = async () => {
      try {
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
      setIsEDIT(true);
      fetchEditData();
    } else {
      setIsEDIT(false);
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
      onSubmit={async (values) => {
        values.voucherNo = `${voucherNo || values.voucherNo}`;
        values.party = party?.value;
        values.amount = `${values.amount}`;

        try {
          const route = isEDIT ? `/slink/editCashPay` : `/cash-payments`;
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
          navigate('/db/cash-payments');
        } catch (error) {
          console.error('Network error:', error);
          toast.error('Network error. Please try again later.');
        }
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
                defaultValue={initialValues.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="voucherNo" as={TextField} label="Voucher No" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={partyOptions}
                getOptionLabel={(option) => option.label}
                onChange={handlePartyChange}
                value={party || null}
                renderInput={(params) => <TextField {...params} label="Party" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="series" as={TextField} label="Series" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="amount" as={TextField} label="Amount" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="discount" type="number" as={TextField} label="Discount" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Save changes
                </Button>
                <Button variant="text" color="error" onClick={() => navigate('/db/cash-payments')}>
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
