import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, TextField, Autocomplete } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import FormSeparator from './FormSeprator';

function CashReceipt() {
  return (
    <PageContainer title="Cash Receipts" description="Cash Receipts Form">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ParentCard title="Cash Receipts">
            <FormSeparator />
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default CashReceipt;
