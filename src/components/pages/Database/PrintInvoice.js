import { useState, useEffect } from 'react';
import React from 'react';
import constants from 'src/constants';
import Iframe from 'react-iframe'
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';


export default function PrintInvoicing() {


  const [invoiceData, setInvoiceData] = useState(null);
  // const printRef = React.useRef();

    const queryParams = new URLSearchParams(window.location.search);
    const queryKey = queryParams.keys().next().value;
  const invoiceId = queryParams.get(queryKey);

  useEffect(() => { 
    // Fetch the invoice data
    ( async () => {
      const data= await fetch(`${constants.baseURL}/slink/invocingPage?id=${invoiceId}`);
      let base64Data = await data.json();
      console.log(base64Data);
  

      setInvoiceData(base64Data.value);
      

    })();
    
  
}, [invoiceId]);


  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div >
      <Iframe src={constants.baseURL+"/slink/printPage?value="+invoiceData} height="600" width="1000"/>
      </div>
    </>
  );
}
