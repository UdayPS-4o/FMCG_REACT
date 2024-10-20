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
    godown: '',
    unit: '',
    stock: '',
    pack: '',
    gst: '',
    pcBx: '',
    mrp: '',
    rate: '',
    qty: '',
    cess: '',
    schRs: '',
    sch: '',
    cd: '',
    amount: '',
    netAmount: '',
    selectedItem: null,
    stockLimit: 0,
  },
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
    if (!newValue) return;

    const selectedItem = newValue;

    // Calculate total stock in pieces
    const totalStock = Object.values(stockList[selectedItem.CODE] || {}).reduce(
      (acc, val) => acc + val,
      0,
    );

    // Set the unit options
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

    // Update state with the selected item data and dropdown options
    const updatedData = {
      ...itemData,
      item: selectedItem.CODE,
      stock: totalStock, // Stock in pieces
      stockLimit: stockLimit, // Add stockLimit
      godown: '',
      pack: selectedItem.PACK,
      gst: selectedItem.GST,
      pcBx: selectedItem.MULT_F,
      mrp: selectedItem.MRP1,
      rate: selectedItem.RATE1,
      qty: '',
      unit: initialUnit, // Auto-select the first unit option
      amount: '',
      netAmount: '',
      selectedItem: selectedItem, // Store the selected item
    };

    // Update godown options
    const availableGodowns = Object.keys(stockList[selectedItem.CODE] || {}).map((gdnCode) => {
      const stock = stockList[selectedItem.CODE][gdnCode];
      const godown = godownOptions.find((gdn) => gdn.value === gdnCode);
      return {
        value: gdnCode,
        label: `${godown?.label || ''} | ${stock}`,
      };
    });

    setGodownOptions(availableGodowns);
    setUnitOptions(units);

    updateItem(index, updatedData);
  };

  const handleGodownChange = (event, newValue) => {
    const selectedGodown = godownOptions.find((gdn) => gdn.value === newValue.value);
    const stock = selectedGodown ? selectedGodown.label.split('|')[1].trim() : 0;

    // Recalculate stock limit based on selected godown
    let stockLimit;
    if (itemData.unit === itemData.selectedItem.UNIT_2) {
      // Unit is BOX
      stockLimit = Math.floor(parseInt(stock, 10) / itemData.pcBx);
    } else {
      // Unit is PCS
      stockLimit = parseInt(stock, 10);
    }

    const updatedData = {
      ...itemData,
      godown: newValue.value,
      stock: parseInt(stock, 10) || 0,
      stockLimit: stockLimit,
    };

    updateItem(index, updatedData);
  };

  const handleUnitChange = (event, newValue) => {
    const updatedData = {
      ...itemData,
      unit: newValue,
    };

    // Recalculate stockLimit based on the new unit
    let stockLimit;
    if (newValue === itemData.selectedItem.UNIT_2) {
      // Unit is BOX
      stockLimit = Math.floor(itemData.stock / itemData.pcBx);
    } else {
      // Unit is PCS
      stockLimit = itemData.stock;
    }

    updatedData.stockLimit = stockLimit;

    // Optionally adjust qty if it exceeds new stockLimit
    if (parseInt(updatedData.qty, 10) > stockLimit) {
      updatedData.qty = stockLimit.toString();
    }

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
          const stockLimit = itemData.stockLimit;

          if (stockLimit > 0 && totalQty > stockLimit) {
            updatedData.qty = stockLimit.toString();
          } else {
            updatedData.qty = totalQty.toString();
          }
        }
      }

      updatedData = calculateAmounts(updatedData);
    }

    if (['rate', 'cess', 'cd', 'sch'].includes(name)) {
      updatedData = calculateAmounts(updatedData);
    }

    updateItem(index, updatedData);
  };

  const calculateAmounts = (data) => {
    const qty = parseFloat(data.qty);
    if (isNaN(qty) || qty <= 0) {
      return {
        ...data,
        amount: '',
        netAmount: '',
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
      netAmount += amount * (parseFloat(data.cess) / 100);
    }

    if (data.cd) {
      netAmount -= amount * (parseFloat(data.cd) / 100);
    }

    if (data.sch) {
      netAmount -= amount * (parseFloat(data.sch) / 100);
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
            {itemData.item
              ? `${itemData.item} | ${itemData.selectedItem?.PRODUCT || 'No Product Name'}`
              : 'Select an item'}
          </Typography>
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
              options={pmplData.filter((item) => item.STK > 0)}
              getOptionLabel={(option) => `${option.CODE} | ${option.PRODUCT || 'No Product Name'}`}
              onChange={handleItemChange}
              renderInput={(params) => (
                <TextField {...params} label="Item Name" fullWidth required={true} />
              )}
              value={itemData.selectedItem || null}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label={`Total Stock (${itemData.unit})`}
              name="stock"
              fullWidth
              disabled
              value={
                itemData.unit === itemData.selectedItem?.UNIT_2
                  ? Math.floor(itemData.stock / itemData.pcBx)
                  : itemData.stock
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={godownOptions}
              getOptionLabel={(option) => option.label}
              onChange={handleGodownChange}
              renderInput={(params) => (
                <TextField {...params} label="Godown" fullWidth required={true} />
              )}
              value={godownOptions.find((option) => option.value === itemData.godown) || null}
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
              renderInput={(params) => (
                <TextField {...params} label="Unit" fullWidth required={true} />
              )}
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
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label={`QTY (${itemData.unit})`}
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
