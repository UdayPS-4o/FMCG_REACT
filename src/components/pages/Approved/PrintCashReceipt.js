import React, { useEffect, useState } from 'react';
import constants from 'src/constants';

// function getEndpoint

export default function PrintCashReceipt() {
  const printRef = React.useRef();
  const [receipt, setReceipt] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);

  const queryKey = queryParams.keys().next().value;
  console.log('queryKey', queryKey);
  const retreat = queryParams.get(queryKey);
  console.log('retreat', queryKey);

  useEffect(() => {
    fetch(constants.baseURL + `/print?${queryKey}=${retreat}`)
      .then((res) => res.json())
      .then((data) => {
        setReceipt(data);
        console.log('data', data);
      });
  }, [retreat]);

  const handlePrint = () => {
    const printContent = printRef.current;
    const winPrint = window.open('', '', 'width=1000');
    winPrint.document.write(printContent.innerHTML);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
  };
  return (
    <div>
      <button onClick={handlePrint}>Print</button>
      <div ref={printRef}>{receipt && <Receipt receipt={receipt} />}</div>
    </div>
  );
}
const getFirstLetter = (name) => name.charAt(0).toUpperCase();

const Receipt = ({ receipt }) => {
  const {
    date,
    receiptNo,
    voucherNo,
    party,
    series,
    amount,
    discount,
    M_NAME,
    C_CODE,
    C_NAME,
    AmountInWords,
  } = receipt;

  return (
    <>
      <div className="receipt">
        <header className="header">
          <h1>Ekta Enterprises</h1>
          <p>Budhwari Bazar, Gn Road Seoni, Seoni</p>
        </header>
        <div className="content">
          <div className="details" style={{ margin: 0, padding: '30px 10px', fontSize: 'larger' }}>
            <div>
              Date: <span>{date}</span>
            </div>
            <div>
              Mode: <span>Cash</span>
            </div>
            <div>
              {receiptNo ? (
                <span> Receipt No: {receiptNo}</span>
              ) : (
                <span> Voucher No: {voucherNo}</span>
              )}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th> Name of A/c Head </th>
                <th>Code</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{C_NAME}</td>
                <td>{party}</td>
                <td id="amount">{amount}</td>
              </tr>
              <tr>
                <td>
                  {' '}
                  By R/no {series[0]}.-{receiptNo}
                </td>
                <td> </td>
                <td id="amount"> </td>
              </tr>
            </tbody>
          </table>
          <div className="in-words">
            In Words: <span>{AmountInWords}</span>
          </div>
        </div>
        <footer className="footer">
          <div>Passed By</div>
          <div>Cashier</div>
          <div>Authorised Signatory</div>
        </footer>
      </div>
      <style>
        {`
                                            .receipt {
                                                            width: 80%;
                                                            margin: 20px auto;
                                                            display: flex;
                                                            flex-direction: column;
                                                            gap: 50px;
                                                            padding: 20px;
                                                            font-family: Arial, sans-serif;
                                            }

                                            .header h1 {
                                                            margin: 0;
                                            }

                                            .header p {
                                                            margin: 10px 0;
                                            }
                                            
                                            .content .details {
                                                            display: flex;
                                                            justify-content: space-between;
                                                            margin: 20px 0;
                                            }

                                            .content .details div span {
                                                            font-weight: bold;
                                            }
.details{
                                              height: 100%;
                                              margin: 0;
              border: 1px solid black;
                                            }
                                            table {
                                                            min-height: 200px;
                                                            width: 100%;
                                                            border-collapse: collapse;
                                                            margin-bottom: 20px;
                                            }

                                            table,
                                            th
                                           {
                                                            border: 1px solid black;
                                            }

                                            th,
                                            td {
                                                            padding: 8px;
                                                            text-align: left;
                                            }

                                            #amount {
                                                            border-left: 1px solid black;
                                            }     
                                            .in-words {
                                                            font-weight: bold;
                                                             border-bottom: 1px solid black;
                                            }

                                            .footer {
                                                            display: flex;
                                                            justify-content: space-between;
                                                           
                                                            padding-top: 10px;
                                                            margin-top: 50px;
                                            }
                            `}
      </style>
    </>
  );
};
