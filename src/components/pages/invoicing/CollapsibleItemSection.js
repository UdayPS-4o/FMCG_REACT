import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Typography,
} from '@mui/material';
import { IconChevronDown, IconTrash } from '@tabler/icons';
import constants from 'src/constants';
const baseURL = constants.baseURL;

const CollapsibleItemSection = ({
  index,
  itemData,
  handleChange,
  expanded,
  updateItem,
  removeItem,
  pmplData,
}) => {
  const [stockList, setStockList] = useState({});
  const [godownOptions, setGodownOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  useEffect(() => {
    const fetchStockAndGodown = async () => {
      const stockRes = await fetch(`${baseURL}/api/stock`);
      const stockData = await stockRes.json();

      const godownRes = await fetch(`${baseURL}/api/dbf/godown.json`);
      const godownData = await godownRes.json();

      setStockList(stockData);
      setGodownOptions(godownData.map((gdn) => ({ value: gdn.GDN_CODE, label: gdn.GDN_NAME })));
    };

    fetchStockAndGodown();
  }, []);

  const handleItemChange = (event, newValue) => {
    const selectedItem = pmplData.find((item) => item.CODE === newValue.value);
    if (selectedItem) {
      // Filter godowns that have stock for the selected item
      const availableGodowns = Object.keys(stockList[selectedItem.CODE] || {}).map((gdnCode) => {
        const stock = stockList[selectedItem.CODE][gdnCode];
        const godown = godownOptions.find((gdn) => gdn.value === gdnCode);
        return {
          value: gdnCode,
          label: `${godown?.label || ''} | ${stock}`,
        };
      });

      // Calculate total stock for the selected item
      const totalStock = Object.values(stockList[selectedItem.CODE] || {}).reduce(
        (acc, val) => acc + val,
        0,
      );

      // Set the unit options
      const units = [selectedItem.UNIT_1, selectedItem.UNIT_2];

      // Update state with the selected item data and dropdown options
      const updatedData = {
        item: selectedItem.CODE,
        stock: totalStock,
        godown: '',
        pack: selectedItem.PACK,
        gst: selectedItem.GST,
        pcBx: selectedItem.MULT_F,
        mrp: selectedItem.MRP1,
        rate: selectedItem.RATE1,
        qty: 0,
        unit: units[0], // Auto-select the first unit option
        amount: 0,
        netAmount: 0,
      };

      setGodownOptions(availableGodowns);
      setUnitOptions(units);

      updateItem(index, updatedData);
    }
  };

  const handleGodownChange = (event, newValue) => {
    const selectedGodown = godownOptions.find((gdn) => gdn.value === newValue.value);
    const stock = selectedGodown ? selectedGodown.label.split('|')[1].trim() : 0;

    const updatedData = {
      ...itemData,
      godown: newValue.value,
      stock: parseInt(stock, 10) || 0,
    };

    updateItem(index, updatedData);
  };

  const handleUnitChange = (event, newValue) => {
    const updatedData = {
      ...itemData,
      unit: newValue,
    };
    updateItem(index, calculateAmounts(updatedData));
  };

  const handleFieldChange = (event, newValue, name) => {
    let updatedData = { ...itemData, [name]: newValue };

    if (name === 'qty') {
      if (parseInt(newValue, 10) > itemData.stock) {
        updatedData = { ...updatedData, qty: itemData.stock };
      }
      updatedData = calculateAmounts(updatedData);
    }

    if (name === 'rate' || name === 'cess' || name === 'cd' || name === 'sch') {
      updatedData = calculateAmounts(updatedData);
    }

    updateItem(index, updatedData);
  };

  const calculateAmounts = (data) => {
    let amount = data.rate * data.qty;
    const selectedItem = pmplData.find((item) => item.CODE === data.item);

    if (data.unit === selectedItem.UNIT_2) {
      amount *= selectedItem.MULT_F;
    }

    const netAmount =
      amount + amount * (data.cess / 100) - amount * (data.cd / 100) - amount * (data.sch / 100);
    return {
      ...data,
      amount: amount.toFixed(2),
      netAmount: netAmount.toFixed(2),
    };
  };

  return (
    <Accordion expanded={expanded === index} onChange={handleChange(index)}>
      <AccordionSummary expandIcon={<IconChevronDown />}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Item {index + 1}</Typography>
          <IconButton color="error" onClick={() => removeItem(index)}>
            <IconTrash />
          </IconButton>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Row 1: 4 items */}
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={pmplData
                .filter((item) => item.STK > 0)
                .map((item) => ({ label: `${item.CODE} | ${item.PRODUCT}`, value: item.CODE }))}
              getOptionLabel={(option) => option.label}
              onChange={handleItemChange}
              renderInput={(params) => <TextField {...params} label="Item Name" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Total Stock" name="stock" fullWidth disabled value={itemData.stock} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={godownOptions}
              getOptionLabel={(option) => option.label}
              onChange={handleGodownChange}
              renderInput={(params) => <TextField {...params} label="Godown" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Pack" name="pack" fullWidth disabled value={itemData.pack} />
          </Grid>

          {/* Row 2: 6 items */}
          <Grid item xs={12} sm={2}>
            <TextField label="GST%" name="gst" fullWidth disabled value={itemData.gst} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              options={unitOptions}
              getOptionLabel={(option) => option}
              onChange={handleUnitChange}
              renderInput={(params) => <TextField {...params} label="Unit" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="Pc/Bx" name="pcBx" fullWidth disabled value={itemData.pcBx} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="M.R.P." name="mrp" fullWidth disabled value={itemData.mrp} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Rate"
              name="rate"
              fullWidth
              value={itemData.rate}
              onChange={(event) => handleFieldChange(event, event.target.value, 'rate')}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="QTY"
              name="qty"
              fullWidth
              value={itemData.qty}
              onChange={(event) => handleFieldChange(event, event.target.value, 'qty')}
            />
          </Grid>

          {/* Row 3: 5 items */}
          <Grid item xs={12} sm={2}>
            <TextField
              label="Cess"
              name="cess"
              fullWidth
              value={itemData.cess}
              onChange={(event) => handleFieldChange(event, event.target.value, 'cess')}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Sch%"
              name="sch"
              fullWidth
              value={itemData.sch}
              onChange={(event) => handleFieldChange(event, event.target.value, 'sch')}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="CD%"
              name="cd"
              fullWidth
              value={itemData.cd}
              onChange={(event) => handleFieldChange(event, event.target.value, 'cd')}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Amount" name="amount" fullWidth disabled value={itemData.amount} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Net Amount"
              name="netAmount"
              fullWidth
              disabled
              value={itemData.netAmount}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleItemSection;
