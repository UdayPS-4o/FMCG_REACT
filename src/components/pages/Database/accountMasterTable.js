import * as React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Toolbar,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Checkbox,
  Button,
} from '@mui/material';

import { IconSearch, IconFilter } from '@tabler/icons';
import { set } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import constants from 'src/constants';
import { red } from '@mui/material/colors';
import { toast } from 'react-toastify';

const fetchProducts = async (endpoint) => {
  let data = await fetch(constants.baseURL + '/json/' + endpoint);
  let response = await data.json();
  return response;
};

const ProductTableList = () => {
  const [endpoint, setEndpoint] = React.useState('');
  const [approved, setApproved] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [headers, setHeaders] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    let point = window.location.href.split('/db/')[1].toLowerCase();
    setEndpoint(point);
    fetchProducts(point).then((data) => {
      setRows(data);
      if (data.length > 0) {
        setHeaders(Object.keys(data[0]));
        setOrderBy(Object.keys(data[0])[0]); // Set the initial order by the first key
      }
    });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    headers.some((header) => row[header]?.toString().toLowerCase().includes(search.toLowerCase())),
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const handlePrint = (ReceiptNo) => {
    if (!endpoint) {
      toast.error('Endpoint is required');
    }
    if (endpoint === 'cash-receipts') window.location.href = `/print?ReceiptNo=${ReceiptNo}`;
    if (endpoint === 'cash-payments') window.location.href = `/print?voucherNo=${ReceiptNo}`;
    if (endpoint === 'godown') window.location.href = `/printGodownT?godownId=${ReceiptNo}`;
    if (endpoint === 'invoicing') window.location.href = `/printInvoicing?id=${ReceiptNo}`
  };

  const handleEdit = (subgroup) => {
    console.log('subgroup', subgroup);
    window.location.href = `/edit/${endpoint}?sub=${subgroup}`;
  };

  const handleApproveAdd = (itemId) => {
    setApproved((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle Select All functionality
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Select all items across all pages
      const allItemIds = sortedRows
        .map((row) => {
          if (endpoint === 'account-master') {
            return row.subgroup;
          } else if (endpoint === 'cash-receipts') {
            return row.receiptNo;
          } else if (endpoint === 'godown') {
            return row.id;
          } else if (endpoint === 'cash-payments') {
            return row.voucherNo;
          }
          return null;
        })
        .filter((id) => id !== null);
      setApproved(allItemIds);
    } else {
      // Deselect all items
      setApproved([]);
    }
  };

  // Determine if all items are selected
  const isAllSelected = () => {
    const allItemIds = sortedRows
      .map((row) => {
        if (endpoint === 'account-master') {
          return row.subgroup;
        } else if (endpoint === 'cash-receipts') {
          return row.receiptNo;
        } else if (endpoint === 'godown') {
          return row.id;
        } else if (endpoint === 'cash-payments') {
          return row.voucherNo;
        }
        return null;
      })
      .filter((id) => id !== null);
    return allItemIds.length > 0 && allItemIds.every((id) => approved.includes(id));
  };

  // Determine if some items are selected
  const isSomeSelected = () => {
    return approved.length > 0 && !isAllSelected();
  };

  // Handle Approve Button Click
  const handleApprove = () => {
    // Send POST request to /approve endpoint
    fetch(`${constants.baseURL}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, approved }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Items approved successfully');
          // Clear approved list after successful approval
          setApproved([]);
        } else {
          toast.error('Failed to approve items');
        }
      })
      .catch((error) => {
        console.error('Error approving items:', error);
        toast.error('Error approving items');
      });
  };

  React.useEffect(() => {
    console.log('approved', approved);
  }, [approved]);

  return (
    <Box>
      <Toolbar>
        <Box sx={{ flex: '1 1 100%' }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
            size="small"
            onChange={handleSearch}
            value={search}
          />
        </Box>
        <Tooltip title="Filter list">
          <IconButton>
            <IconFilter size="1.2rem" icon="filter" />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          color="primary"
          disabled={approved.length === 0}
          onClick={handleApprove}
          sx={{ ml: 2 }}
        >
          Approve {approved.length} items
        </Button>
      </Toolbar>
      <Paper variant="outlined">
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                {['Approve', ...headers, 'Action'].map((header) => (
                  <TableCell
                    key={header}
                    sortDirection={orderBy === header ? order : false}
                    onClick={(event) => {
                      if (header !== 'Approve') handleRequestSort(event, header);
                    }}
                  >
                    {header === 'Approve' ? (
                      <Checkbox
                        indeterminate={isSomeSelected()}
                        checked={isAllSelected()}
                        onChange={handleSelectAllClick}
                        inputProps={{
                          'aria-label': 'select all items',
                        }}
                      />
                    ) : (
                      header.charAt(0).toUpperCase() + header.slice(1)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows
                .reverse()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const itemId =
                    endpoint === 'account-master'
                      ? row.subgroup
                      : endpoint === 'cash-receipts'
                        ? row.receiptNo
                        : endpoint === 'godown'
                          ? row.id
                          : endpoint === 'cash-payments'
                            ? row.voucherNo
                            : null;

                  const isItemSelected = approved.includes(itemId);

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell>
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => {
                            handleApproveAdd(itemId);
                          }}
                          color="primary"
                          inputProps={{ 'aria-label': 'select item' }}
                        />
                      </TableCell>
                      {headers.map((header) => (
                        <TableCell key={header}>
                          {header === 'items' ? row[header].length : row[header]}
                        </TableCell>
                      ))}

                      <TableCell>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (endpoint === 'account-master') {
                              handleEdit(row.subgroup);
                            } else if (endpoint === 'cash-receipts') {
                              handleEdit(row.receiptNo);
                            } else if (endpoint === 'godown') {
                              handleEdit(row.id);
                            } else if (endpoint === 'cash-payments') {
                              handleEdit(row.voucherNo);
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        {endpoint !== 'account-master' ? (
                          <IconButton
                            onClick={() => {
                              if (endpoint === 'account-master') {
                                handlePrint(row.subgroup);
                              } else if (endpoint === 'cash-receipts') {
                                handlePrint(row.receiptNo);
                              } else if (endpoint === 'godown') {
                                handlePrint(row.id);
                              } else if (endpoint === 'cash-payments') {
                                handlePrint(row.voucherNo);
                              }
                              else if (endpoint === 'invoicing') {
                                handlePrint(row.id);
                              }
                            }}
                          >
                            <PrintIcon />
                          </IconButton>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ProductTableList;
