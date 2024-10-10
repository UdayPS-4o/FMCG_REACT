import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import PrivateRoute from 'src/components/auth/PrivateRoute';
// Layouts
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Pages
const AccountMaster = Loadable(
  lazy(() => import('src/components/pages/AccountMaster/AccountMaster')),
);
const Invoicing = Loadable(lazy(() => import('src/components/pages/invoicing/Invoicing')));
const CashReceipt = Loadable(lazy(() => import('src/components/pages/CashRecipt/CashReceipt')));
const CashPayment = Loadable(lazy(() => import('src/components/pages/CashPayment/CashPayment')));
const GodownTransfer = Loadable(
  lazy(() => import('src/components/pages/GodownTransfer/GodownTransfer')),
);
const PrintCashReceipt = Loadable(
  lazy(() => import('src/components/pages/Database/PrintCashReceipt')),
);
const PrintGodownTransfer = Loadable(
  lazy(() => import('src/components/pages/Database/PrintGodown')),
);
const PrintInvoicing = Loadable(lazy(() => import('src/components/pages/Database/PrintInvoice')));
const Adduser = Loadable(lazy(() => import('src/components/pages/AddUser/create-new-user.js')));
const DBFReader = Loadable(lazy(() => import('src/components/pages/DBFReader/dbfReader')));

// Authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// Private Route

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
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
            <CashReceipt />
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
        path: '/edit/godown',
        exact: true,
        element: (
          <PrivateRoute>
            <GodownTransfer />
          </PrivateRoute>
        ),
      },
      {
        path: '/print-cash-receipt',
        exact: true,
        element: (
          <PrivateRoute>
            <PrintCashReceipt />
          </PrivateRoute>
        ),
      },
      {
        path: '/print-godown-transfer',
        exact: true,
        element: (
          <PrivateRoute>
            <PrintGodownTransfer />
          </PrivateRoute>
        ),
      },
      {
        path: '/print-invoicing',
        exact: true,
        element: (
          <PrivateRoute>
            <PrintInvoicing />
          </PrivateRoute>
        ),
      },
      {
        path: '/add-user',
        exact: true,
        element: (
          <PrivateRoute>
            <Adduser />
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
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
