import { useState, useEffect } from 'react';
import React from 'react';
import constants from 'src/constants';
import Iframe from 'react-iframe'
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';


export default function PrintInvoicing() {



  // const printRef = React.useRef();

    const queryParams = new URLSearchParams(window.location.search);
    const queryKey = queryParams.keys().next().value;
  const invoiceId = queryParams.get(queryKey);

  

  return (
    <>
      <div >
      <Iframe src={constants.baseURL+"/slink/printPage?"+ new URLSearchParams
      ({id:invoiceId}).toString()
      } height="800" width="1200"/>
      </div>
    </>
  );
}
