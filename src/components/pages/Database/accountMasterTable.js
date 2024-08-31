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
  IconButton, // Keep this import
} from '@mui/material';

import { IconSearch, IconFilter } from '@tabler/icons';
import { set } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import constants from 'src/constants';

const fetchProducts = async (endpoint) => {
  let data = await fetch('http://103.184.192.68/json/' + endpoint);
  let response = await data.json();
  return response;
};

const ProductTableList = () => {
  const [endpoint, setEndpoint] = React.useState('');

  const [rows, setRows] = React.useState([]);
  const [headers, setHeaders] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    let point = window.location.href.split('/db/')[1].toLowerCase();
    // console.log('point', point);
    setEndpoint(point);
    fetchProducts(point).then((data) => {
      console.log('data', data);
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
      </Toolbar>
      <Paper variant="outlined">
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    sortDirection={orderBy === header ? order : false}
                    onClick={(event) => handleRequestSort(event, header)}
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover tabIndex={-1} key={index}>
                    {headers.map((header) => {
                      console.log('header', header);

                      console.log('row[header]', row[header]);
                      return (
                        <TableCell key={header}>
                          {header === 'items' ? row[header].length : row[header]}
                        </TableCell>
                      );
                    })}

                    <TableCell>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                      {endpoint !== 'account-master' ? (
                        <IconButton>
                          <PrintIcon />
                        </IconButton>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
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