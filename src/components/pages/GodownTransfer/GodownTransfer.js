import { Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import FormSeparator from './GFormSeparator';
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Vertical Form',
  },
];

const GodownTransfer = () => {
  return (
    <PageContainer description="this is Vertical Form page">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ParentCard>
            <FormSeparator />
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default GodownTransfer;
