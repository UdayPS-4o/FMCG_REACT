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
  itemData = {
    item: '',
    stock: 0,
    stockLimit: 0,
    pack: '',
    gst: 0,
    unit: '',
    pcBx: 0,
    mrp: 0,
    rate: 0,
    qty: '',
    selectedItem: null,
  },
  handleChange,
  expanded,
  updateItem,
  removeItem,
  pmplData,
}) => {
  const [unitOptions, setUnitOptions] = useState([]);
  const [productName, setProductName] = useState('');

  const handleItemChange = (event, newValue) => {
    if (!newValue) return;

    const selectedItem = newValue;

    let totalStock = selectedItem.STK || 0; // Stock in pieces

    const units = [selectedItem.UNIT_1, selectedItem.UNIT_2].filter(Boolean);

    // Set the initial unit
    const initialUnit = units[0];

    // Calculate stock limit based on the initial unit
    let stockLimit;
    if (initialUnit === selectedItem.UNIT_2) {
      // Unit is BOX
      stockLimit = Math.floor(totalStock / selectedItem.MULT_F);
    } else {
      // Unit is PCS
      stockLimit = totalStock;
    }

    const updatedData = {
      ...itemData,
      item: selectedItem.CODE,
      stock: totalStock, // Stock in pieces
      stockLimit: stockLimit, // Store the stock limit based on unit
      pack: selectedItem.PACK,
      gst: selectedItem.GST,
      unit: initialUnit,
      pcBx: selectedItem.MULT_F,
      mrp: selectedItem.MRP1,
      rate: selectedItem.RATE1,
      qty: '',
      selectedItem: selectedItem,
    };

    setUnitOptions(units);
    setProductName(selectedItem.PRODUCT);

    updateItem(index, updatedData);
  };

  const handleUnitChange = (event, newValue) => {
    let stockLimit;
    if (newValue === itemData.selectedItem.UNIT_2) {
      // Unit is BOX
      stockLimit = Math.floor(itemData.stock / itemData.pcBx);
    } else {
      // Unit is PCS
      stockLimit = itemData.stock;
    }

    const updatedData = {
      ...itemData,
      unit: newValue,
      stockLimit: stockLimit,
    };
    updateItem(index, calculateAmounts(updatedData));
  };

  const handleFieldChange = (event, newValue, name) => {
    let updatedData = { ...itemData, [name]: newValue };

    if (name === 'qty') {
      if (newValue === '') {
        updatedData.qty = '';
      } else {
        const totalQty = parseInt(newValue, 10);

        if (!isNaN(totalQty)) {
          const { stockLimit } = itemData;

          if (stockLimit > 0 && totalQty > stockLimit) {
            updatedData.qty = stockLimit;
          } else {
            updatedData.qty = totalQty;
          }
        }
      }

      updatedData = calculateAmounts(updatedData);
    } else if (['rate', 'cess', 'cd', 'sch'].includes(name)) {
      updatedData = calculateAmounts(updatedData);
    }

    updateItem(index, updatedData);
  };

  const calculateAmounts = (data) => {
    const qty = parseFloat(data.qty);
    if (isNaN(qty) || qty <= 0) {
      return {
        ...data,
        amount: '0.00',
        netAmount: '0.00',
      };
    }

    let amount;

    const selectedItem = data.selectedItem;

    if (selectedItem) {
      if (data.unit === selectedItem.UNIT_2) {
        // Unit is BOX
        amount = data.rate * qty;
      } else {
        // Unit is PCS
        const qtyInBoxes = qty / selectedItem.MULT_F;
        amount = data.rate * qtyInBoxes;
      }
    } else {
      amount = data.rate * qty;
    }

    let netAmount = amount;

    if (data.cess) {
      netAmount += amount * (data.cess / 100);
    }

    if (data.cd) {
      netAmount -= amount * (data.cd / 100);
    }

    if (data.sch) {
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
          <Typography variant="h6">
            {itemData.item ? `${itemData.item} | ${productName} |` : 'Select an item'}
          </Typography>

          <IconButton color="error" onClick={() => removeItem(index)}>
            <IconTrash />
          </IconButton>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Row 1: Item Selection */}
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={pmplData.filter((item) => item.STK > 0)}
              getOptionLabel={(option) => `${option.CODE} | ${option.PRODUCT || 'No Product Name'}`}
              onChange={handleItemChange}
              renderInput={(params) => <TextField {...params} label="Item Name" fullWidth />}
              value={itemData.selectedItem || null}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label={`Total Stock (${itemData.unit})`}
              name="stock"
              fullWidth
              disabled
              value={itemData.stockLimit || 0}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Pack" name="pack" fullWidth disabled value={itemData.pack} />
          </Grid>

          {/* Row 2: Other Details */}
          <Grid item xs={12} sm={2}>
            <TextField label="GST%" name="gst" fullWidth disabled value={itemData.gst} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              options={unitOptions}
              getOptionLabel={(option) => option}
              onChange={handleUnitChange}
              renderInput={(params) => <TextField {...params} label="Unit" fullWidth />}
              value={itemData.unit || unitOptions[0] || ''}
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
              label={`QTY (${itemData.unit})`}
              name="qty"
              fullWidth
              type="number"
              inputProps={{ min: 0, max: itemData.stockLimit }}
              value={itemData.qty}
              onChange={(event) => handleFieldChange(event, event.target.value, 'qty')}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleItemSection;
