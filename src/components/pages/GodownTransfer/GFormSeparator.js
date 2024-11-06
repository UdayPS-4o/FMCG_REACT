import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete, Divider } from '@mui/material';
import constants from 'src/constants';
import CollapsibleItemSection from './CollapsibleItemSection'; // Adjust the import based on your file structure
import { set } from 'lodash';
import { toast, ToastContainer } from 'react-toastify';
function FormSeparator() {
  const [id, setId] = useState(0);
  const [partyOptions, setPartyOptions] = useState([]);
  const [fromGodown, setFromGodown] = useState(null);
  const [toGodown, setToGodown] = useState(null);
  const [pmplData, setPmplData] = useState([]); // Hold product data from pmpl.json
  const [urlParms, setUrlParms] = useState(window.location.search);
  const [searchItems, setSearchItems] = useState('');
  const [clicked, setClicked] = useState(false);
  const [formValues, setFormValues] = useState({
    date: new Date().toISOString().split('T')[0],
    series: 'T',
    fromGodown: '',
    toGodown: '',
    items: [
      {
        item: '',
        stock: '',
        pack: '',
        gst: '',
        unit: '',
        pcBx: '',
        mrp: '',
        rate: '',
        qty: '',
      },
    ],
  });
  const [expanded, setExpanded] = useState(0);
  const baseURL = constants.baseURL;
  useEffect(() => {
    const url = new URL(window.location.href);
    const godownId = url.searchParams.get('sub');
    setUrlParms(godownId);
    const fetchOptions = async () => {
      try {
        setId(await fetch(`${baseURL}/slink/godownId`).then((res) => res.json()));

        const res = await fetch(`${baseURL}/api/dbf/godown.json`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPartyOptions(data);
        } else {
          console.error('Data fetched is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchPmplData = async () => {
      try {
        const pmplRes = await fetch(`${baseURL}/api/dbf/pmpl.json`);
        const pmplDatas = await pmplRes.json();
        setPmplData(pmplDatas); // Set pmplData here
      } catch (error) {
        console.error('Error fetching PMPL data:', error);
      }
    };

    fetchOptions();
    fetchPmplData();
  }, []); // Empty dependency array prevents infinite re-renders

  useEffect(() => {
    const fetchEditData = async () => {
      const params = new URLSearchParams(window.location.search);
      const godownId = params.get('sub');

      if (godownId && pmplData.length && partyOptions.length) {
        try {
          const res = await fetch(`${baseURL}/json/godown`);
          const data = await res.json();
          const newData = data.find((el) => el.id === godownId);
          console.log('Edit data:', newData);

          // Map items with pmplData to auto-fill fields
          const mappedItems = newData.items.map((item) => {
            const product = pmplData.find((p) => p.CODE === item.code);

            return {
              item: item.code,
              stock: product?.STK || 0,
              pack: product?.PACK || '',
              gst: product?.GST || 0,
              unit: product?.UNIT_1 || '',
              pcBx: product?.MULT_F || '',
              mrp: product?.MRP1 || '',
              rate: product?.PL_RATE || '',
              qty: item.qty,
            };
          });

          setFormValues({
            ...newData,
            items: mappedItems,
          });

          const fromGodownOption = partyOptions.find(
            (option) => option.GDN_CODE === newData.fromGodown,
          );
          const toGodownOption = partyOptions.find(
            (option) => option.GDN_CODE === newData.toGodown,
          );

          setFromGodown(fromGodownOption);
          setToGodown(toGodownOption);
        } catch (error) {
          console.error('Error fetching edit data:', error);
        }
      }
    };

    if (pmplData.length && partyOptions.length) {
      fetchEditData();
    }
  }, [pmplData, partyOptions]); // Only runs when pmplData and partyOptions are available

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFromGodownChange = (event, newValue) => {
    setFromGodown(newValue);
    setFormValues({ ...formValues, fromGodown: newValue.GDN_CODE });
    setToGodown(null); // Reset toGodown when fromGodown changes
  };

  const handleToGodownChange = (event, newValue) => {
    setToGodown(newValue);
    setFormValues({ ...formValues, toGodown: newValue.GDN_CODE });
  };

  const getAvailableItems = () => {
    const selectedCodes = new Set(formValues.items.map((item) => item.item));
    return pmplData.filter((pmpl) => !selectedCodes.has(pmpl.CODE));
  };

  const addItem = () => {
    setFormValues({
      ...formValues,
      items: [
        ...formValues.items,
        {
          item: '',
          stock: '',
          pack: '',
          gst: '',
          unit: '',
          pcBx: '',
          mrp: '',
          rate: '',
          qty: '',
        },
      ],
    });
    setExpanded(formValues.items.length); // Automatically expand the newly added accordion
  };

  const removeItem = (index) => {
    const newItems = formValues.items.filter((_, i) => i !== index);
    setFormValues({ ...formValues, items: newItems });
  };

  const updateItem = (index, newData) => {
    const newItems = formValues.items.map((item, i) => (i === index ? newData : item));
    setFormValues({ ...formValues, items: newItems });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const sortedFormValues = () => {
    if (!searchItems) return formValues;

    const filteredItems = formValues.items.filter((item) =>
      item.item.toLowerCase().includes(searchItems.toLowerCase()),
    );

    return {
      ...formValues,
      items: filteredItems.sort((a, b) => a.item.localeCompare(b.item)),
    };
  };
  console.log('formValues:', sortedFormValues());
  const handleSubmit = async () => {
    setClicked(true);
    const payloadId = id;
    const { fromGodown, toGodown, items } = formValues;

    const allQuantitiesValid = items.every((item) => item.qty > 0);

    if (!allQuantitiesValid) {
      toast.error('All items must have a quantity greater than 0.');
      return;
    }

    console.log(formValues);
    const payload = {
      ...formValues,
      id: payloadId.nextGodownId,
      fromGodown: fromGodown?.GDN_CODE || '',
      toGodown: toGodown?.GDN_CODE || '',
      items: items.map((el) => ({
        code: el.item,
        qty: el.qty,
        unit: el.unit,
      })),
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
    };

    try {
      const res = await fetch(`${baseURL}/godown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      toast.success(json.message);
      window.location.reload();
    } catch (error) {
      toast.error('Error submitting form:', error.message);

      console.error('Error submitting form:', error);
    }
  };
  useEffect(() => {
    console.log('formValues:', formValues);
  }, [formValues]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="date"
            type="date"
            label="Date"
            fullWidth
            value={formValues.date}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                name="series"
                label="Series"
                fullWidth
                value={formValues.series}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField name="#" label="#" value={urlParms || null} fullWidth disabled />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={partyOptions}
            getOptionLabel={(option) => option.GDN_NAME}
            value={fromGodown}
            onChange={handleFromGodownChange}
            renderInput={(params) => (
              <TextField {...params} label="From Godown" required={true} fullWidth />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={partyOptions.filter((option) => option.GDN_NAME !== fromGodown?.GDN_NAME)}
            getOptionLabel={(option) => option.GDN_NAME}
            value={toGodown}
            onChange={handleToGodownChange}
            renderInput={(params) => (
              <TextField {...params} label="To Godown" fullWidth required={true} />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Items"
            fullWidth
            value={searchItems}
            onChange={(e) => setSearchItems(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          {(sortedFormValues ? sortedFormValues().items : formValues.items).map((item, index) => (
            <CollapsibleItemSection
              key={index}
              index={index}
              itemData={item}
              handleChange={handleAccordionChange}
              expanded={expanded}
              updateItem={updateItem}
              removeItem={removeItem}
              pmplData={getAvailableItems()} // Ensure filtered items are used for all items
              pmpl={pmplData}
            />
          ))}
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" onClick={addItem}>
            Add Another Item
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit" disabled={clicked}>
              Save changes
            </Button>
            <Button variant="text" color="error">
              Cancel
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default FormSeparator;
