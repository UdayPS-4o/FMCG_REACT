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
  const [isQtyReadOnly, setIsQtyReadOnly] = useState(false);

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
        pack: selectedItem.PACK,
        gst: selectedItem.GST,
        unit: units[0], // Auto-select the first unit option
        pcBx: selectedItem.MULT_F,
        mrp: selectedItem.MRP1,
        rate: selectedItem.RATE1,
        qty: '',
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
      const totalQty = parseInt(newValue, 10) || 0;
      const requiredStock = totalQty * (itemData.pcBx || 1);

      if (requiredStock > itemData.stock) {
        updatedData = { ...updatedData, qty: itemData.stock / (itemData.pcBx || 1) };
        setIsQtyReadOnly(true); // Set qty field to read-only
      } else {
        setIsQtyReadOnly(false); // Allow editing if within limit
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

    if (data.unit === selectedItem.UNIT_2 || selectedItem.UNIT_1 === selectedItem.UNIT_2) {
      amount *= selectedItem.MULT_F;
    }

    let netAmount = amount;

    if (data.cess && data.cess !== '') {
      netAmount += amount * (data.cess / 100);
    }

    if (data.cd && data.cd !== '') {
      netAmount -= amount * (data.cd / 100);
    }

    if (data.sch && data.sch !== '') {
      netAmount -= amount * (data.sch / 100);
    }

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
                .map((item) => ({
                  label: `${item.CODE} | ${item.PRODUCT}`,
                  value: item.CODE,
                }))}
              getOptionLabel={(option) => option.label}
              onChange={handleItemChange}
              renderInput={(params) => <TextField {...params} label="Item Name" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Total Stock" name="stock" fullWidth disabled value={itemData.stock} />
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
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="QTY"
              name="qty"
              fullWidth
              value={itemData.qty}
              onChange={(event) => handleFieldChange(event, event.target.value, 'qty')}
              InputProps={{ readOnly: isQtyReadOnly }} // Read-only based on the condition
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleItemSection;
