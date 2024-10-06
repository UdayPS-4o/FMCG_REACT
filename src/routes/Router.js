import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';
import GodownTransfer from 'src/components/pages/GodownTransfer/GodownTransfer';
import Invoicing from 'src/components/pages/invoicing/Invoicing';
import Cash_Receipt from 'src/components/pages/CashRecipt/Cash_Receipt';
import AccountMaster from 'src/components/pages/AccountMaster/AccountMaster';
import CashPayment from 'src/components/pages/CashPayment/CashPayment';
import DBFReader from 'src/components/pages/DBFReader/dbfReader';
import DBaccountmaster from 'src/components/pages/Database/account-master.js';
import DBcashpayments from 'src/components/pages/Database/cash-payment';
import DBcashreceipt from 'src/components/pages/Database/cash-receipt';
import DBgodowntransfer from 'src/components/pages/Database/godown-transfer';
import DBinvoicing from 'src/components/pages/Database/invoicing';
import Adduser from 'src/components/pages/AddUser/create-new-user.js';
import PrintCashReceipt from 'src/components/pages/Database/PrintCashReceipt';
import PrintGodownTransfer from 'src/components/pages/Database/PrintGodown';
import PrintInvoicing from 'src/components/pages/Database/PrintInvoice';
import PrivateRoute from 'src/components/auth/PrivateRoute';
// approved
import APaccountmaster from 'src/components/pages/Approved/account-master.js';
import APcashpayments from 'src/components/pages/Approved/cash-payment';
import APcashreceipt from 'src/components/pages/Approved/cash-receipt';
import APgodowntransfer from 'src/components/pages/Approved/godown-transfer';
import APinvoicing from 'src/components/pages/Approved/invoicing';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));

/* ****Apps***** */
const Chats = Loadable(lazy(() => import('../views/apps/chat/Chat')));
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Calendar = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));
const Email = Loadable(lazy(() => import('../views/apps/email/Email')));
const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogPost')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts')));
const Ecommerce = Loadable(lazy(() => import('../views/apps/eCommerce/Ecommerce')));
const EcommerceDetail = Loadable(lazy(() => import('../views/apps/eCommerce/EcommerceDetail')));
const EcomProductList = Loadable(lazy(() => import('../views/apps/eCommerce/EcomProductList')));
const EcomProductCheckout = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceCheckout')),
);
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
const Followers = Loadable(lazy(() => import('../views/apps/user-profile/Followers')));
const Friends = Loadable(lazy(() => import('../views/apps/user-profile/Friends')));
const Gallery = Loadable(lazy(() => import('../views/apps/user-profile/Gallery')));

// Pages
const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL')));
const Treeview = Loadable(lazy(() => import('../views/pages/treeview/Treeview')));
const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting')),
);
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq')));

// widget
const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards')));
const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners')));
const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts')));

// form elements
const MuiAutoComplete = Loadable(
  lazy(() => import('../views/forms/form-elements/MuiAutoComplete')),
);
const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton')));
const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox')));
const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio')));
const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider')));
const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime')));
const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch')));

// form layout
const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts')));
const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom')));
const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard')));
const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation')));
const QuillEditor = Loadable(lazy(() => import('../views/forms/quill-editor/QuillEditor')));
const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal')));
const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical')));

// tables
const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable')));
const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable')));
const EnhancedTable = Loadable(lazy(() => import('../views/tables/EnhancedTable')));
const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable')));
const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable')));
const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable')));

// chart
const LineChart = Loadable(lazy(() => import('../views/charts/LineChart')));
const GredientChart = Loadable(lazy(() => import('../views/charts/GredientChart')));
const DoughnutChart = Loadable(lazy(() => import('../views/charts/DoughnutChart')));
const AreaChart = Loadable(lazy(() => import('../views/charts/AreaChart')));
const ColumnChart = Loadable(lazy(() => import('../views/charts/ColumnChart')));
const CandlestickChart = Loadable(lazy(() => import('../views/charts/CandlestickChart')));
const RadialbarChart = Loadable(lazy(() => import('../views/charts/RadialbarChart')));

// ui
const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert')));
const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion')));
const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar')));
const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip')));
const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog')));
const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList')));
const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover')));
const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating')));
const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs')));
const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip')));
const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList')));
const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// landingpage
const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/account-master" /> },
      { path: '/account-master', exact: true, element: <AccountMaster /> },
      { path: '/invoicing', exact: true, element: <Invoicing /> },
      { path: '/cash-receipts', exact: true, element: <Cash_Receipt /> },
      { path: '/cash-payments', exact: true, element: <CashPayment /> },
      { path: '/edit/account-master', exact: true, element: <AccountMaster /> },
      { path: '/edit/cash-receipts', exact: true, element: <Cash_Receipt /> },
      { path: '/edit/cash-payments', exact: true, element: <CashPayment /> },
      { path: '/edit/godown', exact: true, element: <GodownTransfer /> },
      { path: '/godown', exact: true, element: <GodownTransfer /> },
      { path: '/print', exact: true, element: <PrintCashReceipt /> },
      { path: '/printGodownT', exact: true, element: <PrintGodownTransfer /> },
      { path: '/printInvoicing', exact: true, element: <PrintInvoicing /> },
      { path: '/dbf', exact: true, element: <DBFReader /> },
      { path: '/adduser', exact: true, element: <Adduser /> },
      { path: '/editadduser', exact: true, element: <Adduser /> },
      { path: '/db/account-master', exact: true, element: <DBaccountmaster /> },
      { path: '/db/invoicing', exact: true, element: <DBinvoicing /> },
      { path: '/db/cash-receipts', exact: true, element: <DBcashreceipt /> },
      { path: '/db/cash-payments', exact: true, element: <DBcashpayments /> },
      { path: '/db/godown', exact: true, element: <DBgodowntransfer /> },

      { path: '/approved/account-master', exact: true, element: <APaccountmaster /> },
      { path: '/approved/invoicing', exact: true, element: <APinvoicing /> },
      { path: '/approved/cash-receipts', exact: true, element: <APcashreceipt /> },
      { path: '/approved/cash-payments', exact: true, element: <APcashpayments /> },
      { path: '/approved/godown', exact: true, element: <APgodowntransfer /> },
      { path: '/', element: <Navigate to="/account-master" /> },
      {
        path: '/account-master',
        exact: true,
        element: (
          <PrivateRoute>
            <AccountMaster />
          </PrivateRoute>
        ),
      },
      {
        path: '/invoicing',
        exact: true,
        element: (
          <PrivateRoute>
            <Invoicing />
          </PrivateRoute>
        ),
      },
      {
        path: '/cash-receipts',
        exact: true,
        element: (
          <PrivateRoute>
            <Cash_Receipt />
          </PrivateRoute>
        ),
      },
      {
        path: '/cash-payments',
        exact: true,
        element: (
          <PrivateRoute>
            <CashPayment />
          </PrivateRoute>
        ),
      },
      {
        path: '/edit/account-master',
        exact: true,
        element: (
          <PrivateRoute>
            <AccountMaster />
          </PrivateRoute>
        ),
      },
      {
        path: '/edit/cash-receipts',
        exact: true,
        element: (
          <PrivateRoute>
            <Cash_Receipt />
          </PrivateRoute>
        ),
      },
      {
        path: '/edit/cash-payments',
        exact: true,
        element: (
          <PrivateRoute>
            <CashPayment />
          </PrivateRoute>
        ),
      },
      {
        path: '/edit/godown',
        exact: true,
        element: (
          <PrivateRoute>
            <GodownTransfer />
          </PrivateRoute>
        ),
      },
      {
        path: '/godown',
        exact: true,
        element: (
          <PrivateRoute>
            <GodownTransfer />
          </PrivateRoute>
        ),
      },
      {
        path: '/print',
        exact: true,
        element: (
          <PrivateRoute>
            <PrintCashReceipt />
          </PrivateRoute>
        ),
      },
      {
        path: '/printGodownT',
        exact: true,
        element: (
          <PrivateRoute>
            <PrintGodownTransfer />
          </PrivateRoute>
        ),
      },
      {
        path: '/dbf',
        exact: true,
        element: (
          <PrivateRoute>
            <DBFReader />
          </PrivateRoute>
        ),
      },
      {
        path: '/adduser',
        exact: true,
        element: (
          <PrivateRoute>
            <Adduser />
          </PrivateRoute>
        ),
      },
      {
        path: '/editadduser',
        exact: true,
        element: (
          <PrivateRoute>
            <Adduser />
          </PrivateRoute>
        ),
      },
      {
        path: '/db/account-master',
        exact: true,
        element: (
          <PrivateRoute>
            <DBaccountmaster />
          </PrivateRoute>
        ),
      },
      {
        path: '/db/invoicing',
        exact: true,
        element: (
          <PrivateRoute>
            <DBinvoicing />
          </PrivateRoute>
        ),
      },
      {
        path: '/db/cash-receipts',
        exact: true,
        element: (
          <PrivateRoute>
            <DBcashreceipt />
          </PrivateRoute>
        ),
      },
      {
        path: '/db/cash-payments',
        exact: true,
        element: (
          <PrivateRoute>
            <DBcashpayments />
          </PrivateRoute>
        ),
      },
      {
        path: '/db/godown',
        exact: true,
        element: (
          <PrivateRoute>
            <DBgodowntransfer />
          </PrivateRoute>
        ),
      },
      { path: '/dashboards/modern', exact: true, element: <ModernDash /> },
      { path: '/dashboards/ecommerce', exact: true, element: <EcommerceDash /> },
      { path: '/apps/chats', element: <Chats /> },
      { path: '/apps/notes', element: <Notes /> },
      { path: '/apps/calendar', element: <Calendar /> },
      { path: '/apps/email', element: <Email /> },
      { path: '/apps/tickets', element: <Tickets /> },
      { path: '/apps/contacts', element: <Contacts /> },
      { path: '/apps/ecommerce/shop', element: <Ecommerce /> },
      { path: '/apps/blog/posts', element: <Blog /> },
      { path: '/apps/blog/detail/:id', element: <BlogDetail /> },
      { path: '/apps/ecommerce/eco-product-list', element: <EcomProductList /> },
      { path: '/apps/ecommerce/eco-checkout', element: <EcomProductCheckout /> },
      { path: '/apps/ecommerce/detail/:id', element: <EcommerceDetail /> },
      { path: '/apps/followers', element: <Followers /> },
      { path: '/apps/friends', element: <Friends /> },
      { path: '/apps/gallery', element: <Gallery /> },
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/pages/casl', element: <RollbaseCASL /> },
      { path: '/pages/treeview', element: <Treeview /> },
      { path: '/pages/pricing', element: <Pricing /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
      { path: '/pages/faq', element: <Faq /> },
      { path: '/forms/form-elements/autocomplete', element: <MuiAutoComplete /> },
      { path: '/forms/form-elements/button', element: <MuiButton /> },
      { path: '/forms/form-elements/checkbox', element: <MuiCheckbox /> },
      { path: '/forms/form-elements/radio', element: <MuiRadio /> },
      { path: '/forms/form-elements/slider', element: <MuiSlider /> },
      { path: '/forms/form-elements/date-time', element: <MuiDateTime /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/quill-editor', element: <QuillEditor /> },
      { path: '/forms/form-layouts', element: <FormLayouts /> },
      { path: '/forms/form-horizontal', element: <FormHorizontal /> },
      { path: '/forms/form-vertical', element: <FormVertical /> },
      { path: '/forms/form-custom', element: <FormCustom /> },
      { path: '/forms/form-wizard', element: <FormWizard /> },
      { path: '/forms/form-validation', element: <FormValidation /> },
      { path: '/tables/basic', element: <BasicTable /> },
      { path: '/tables/collapsible', element: <CollapsibleTable /> },
      { path: '/tables/enhanced', element: <EnhancedTable /> },
      { path: '/tables/fixed-header', element: <FixedHeaderTable /> },
      { path: '/tables/pagination', element: <PaginationTable /> },
      { path: '/tables/search', element: <SearchTable /> },
      { path: '/charts/line-chart', element: <LineChart /> },
      { path: '/charts/gredient-chart', element: <GredientChart /> },
      { path: '/charts/doughnut-pie-chart', element: <DoughnutChart /> },
      { path: '/charts/area-chart', element: <AreaChart /> },
      { path: '/charts/column-chart', element: <ColumnChart /> },
      { path: '/charts/candlestick-chart', element: <CandlestickChart /> },
      { path: '/charts/radialbar-chart', element: <RadialbarChart /> },
      { path: '/ui-components/alert', element: <MuiAlert /> },
      { path: '/ui-components/accordion', element: <MuiAccordion /> },
      { path: '/ui-components/avatar', element: <MuiAvatar /> },
      { path: '/ui-components/chip', element: <MuiChip /> },
      { path: '/ui-components/dialog', element: <MuiDialog /> },
      { path: '/ui-components/list', element: <MuiList /> },
      { path: '/ui-components/popover', element: <MuiPopover /> },
      { path: '/ui-components/rating', element: <MuiRating /> },
      { path: '/ui-components/tabs', element: <MuiTabs /> },
      { path: '/ui-components/tooltip', element: <MuiTooltip /> },
      { path: '/ui-components/transfer-list', element: <MuiTransferList /> },
      { path: '/ui-components/typography', element: <MuiTypography /> },
      { path: '/widgets/cards', element: <WidgetCards /> },
      { path: '/widgets/banners', element: <WidgetBanners /> },
      { path: '/widgets/charts', element: <WidgetCharts /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
