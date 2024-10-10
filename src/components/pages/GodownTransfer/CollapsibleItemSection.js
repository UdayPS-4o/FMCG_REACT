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
import { toast, ToastContainer } from 'react-toastify';
import { set } from 'lodash';
const baseURL = constants.baseURL;

const CollapsibleItemSection = ({
  index,
  itemData = {
    item: '',
    stock: 0,
    pack: '',
    gst: 0,
    unit: '',
    pcBx: 0,
    mrp: 0,
    rate: 0,
    qty: 0,
  }, // Default values for itemData
  handleChange,
  expanded,
  updateItem,
  removeItem,
  pmplData,
}) => {
  console.log('itemData:', itemData);
  const [stockList, setStockList] = useState({});
  const [godownOptions, setGodownOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [isQtyReadOnly, setIsQtyReadOnly] = useState(false);
  const [proudctName, setProductName] = useState('');
  useEffect(() => {
    const fetchStockAndGodown = async () => {
      try {
        const stockRes = await fetch(`${baseURL}/api/stock`);
        const stockData = await stockRes.json();

        const godownRes = await fetch(`${baseURL}/api/dbf/godown.json`);
        const godownData = await godownRes.json();

        setStockList(stockData);
        setGodownOptions(godownData.map((gdn) => ({ value: gdn.GDN_CODE, label: gdn.GDN_NAME })));
      } catch (error) {
        console.error('Error fetching stock and godown data:', error);
      }
    };

    fetchStockAndGodown();
  }, []);

  const handleItemChange = (event, newValue) => {
    const selectedItem = pmplData.find((item) => item.CODE === newValue.value);
    if (selectedItem) {
      const availableGodowns = Object.keys(stockList[selectedItem.CODE] || {}).map((gdnCode) => {
        const stock = stockList[selectedItem.CODE][gdnCode];
        const godown = godownOptions.find((gdn) => gdn.value === gdnCode);
        setProductName(selectedItem.PRODUCT);
        return {
          value: gdnCode,
          label: `${godown?.label || ''} | ${stock}`,
        };
      });

      const totalStock = Object.values(stockList[selectedItem.CODE] || {}).reduce(
        (acc, val) => acc + val,
        0,
      );

      const units = [selectedItem.UNIT_1, selectedItem.UNIT_2];

      const updatedData = {
        item: selectedItem.CODE,
        stock: totalStock,
        pack: selectedItem.PACK,
        gst: selectedItem.GST,
        unit: units[0],
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
    console.log('updatedData:', updatedData);

    if (name === 'qty') {
        // Convert string input to integer safely
        const totalQty = parseInt(newValue, 10) || 0;

        // Ensure the requested quantity does not exceed the available stock considering the package box multiplier
        if (totalQty > 0) {
            const stockLimit = Math.floor(itemData.stock / (itemData.pcBx || 1));
            updatedData.qty = Math.min(totalQty, stockLimit);
        }

        // Recalculate amounts since qty impacts the total and net amounts
        updatedData = calculateAmounts(updatedData);
    } else if (['rate', 'cess', 'cd', 'sch'].includes(name)) {
        // For any rate or discount changes, recalculate amounts
        updatedData = calculateAmounts(updatedData);
    }

    // Update the item data in the parent component
    updateItem(index, updatedData);
};



  const calculateAmounts = (data) => {
    let amount = data.rate * data.qty;
    console.log("data.item", data.item, pmplData.length, typeof data.item)
    const selectedItem = pmplData.find((item) => item["CODE"] == data.item);

    
    console.log("selectedItem", selectedItem);
    console.log("data", data);
    console.log("pmplData", pmplData)


    if (data.unit === selectedItem.UNIT_2 || selectedItem.UNIT_1 === selectedItem.UNIT_2) {
      amount *= selectedItem.MULT_F;
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
            {itemData.item ? `${itemData.item} |
            
            ${proudctName} |`
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
              options={pmplData.filter(item => item.STK > 0).map(item => ({
                label: `${item.CODE} | ${item.PRODUCT || 'No Product Name'}`, // Default text if PRODUCT is undefined
                value: item.CODE
              }))}
              getOptionLabel={option => option.label}
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
              value={itemData.unit || unitOptions[0] || ''} // Default unit value
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

            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleItemSection;
