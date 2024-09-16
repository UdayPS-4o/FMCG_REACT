import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import SearchTable from './SearchTable';

import MasterTable from './accountMasterTable';

function CashReceipt() {
  return (
    <PageContainer title="Cash Receipts" description="Cash Receipts Form">
      <Grid container spacing={3}>
        =
        <Grid item xs={12}>
          <MasterTable />
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default CashReceipt;
