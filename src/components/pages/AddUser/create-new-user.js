import { Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import FormSeparator from './FormSeparator';
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
    <PageContainer title="Vertical Form" description="this is Vertical Form page">
      {/* breadcrumb */}
      <Breadcrumb title="Vertical Form" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ParentCard title="Create New User">
            <FormSeparator />
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default GodownTransfer;
