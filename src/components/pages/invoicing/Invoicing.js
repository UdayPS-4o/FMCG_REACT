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

const FormVertical = () => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ParentCard title="Invoicing">
            <FormSeparator />
          </ParentCard>
        </Grid>
      </Grid>
    </>
  );
};

export default FormVertical;
