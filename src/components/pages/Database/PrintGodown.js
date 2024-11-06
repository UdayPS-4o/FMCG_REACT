import React, { useEffect, useState, useRef } from 'react';
import constants from 'src/constants';
const itemsPerPage = 12;

export default function PrintGodownT() {
  const printRef = useRef();
  const [godownData, setGodownData] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);
  const retreat = queryParams.get(queryParams.keys().next().value);

  useEffect(() => {
    fetch(`${constants.baseURL}/slink/printGodown?retreat=${retreat}`)
      .then((res) => res.json())
      .then((data) => {
        setGodownData(data);
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

  if (!godownData) {
    return null;
  }

  // Calculate pages for print
  const pages = [];
  for (let i = 0; i < godownData.items.length; i += itemsPerPage) {
    pages.push(godownData.items.slice(i, i + itemsPerPage));
  }

  return (
    <div>
      <button onClick={handlePrint}>Print</button>
      <div ref={printRef}>
        {pages.map((pageItems, index) => (
          <div key={index} className="print-page " style={{ breakAfter: 'page', display: 'flex' }}>
            <TransferGodownData transferData={{ ...godownData, items: pageItems }} />
            <TransferGodownData transferData={{ ...godownData, items: pageItems }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const TransferGodownData = ({ transferData }) => {
  const { date, fromGodown, toGodown, id, items } = transferData;

  return (
    <>
      <div className="godownId">
        <header className="header" style={headerStyles}>
          <div>
            <h1>Ekta Enterprises</h1>
          </div>
          <div>
            <p>Phone: 9179174888</p>
            <p>Mobile: 9826623188</p>
            <p>GSTN: 23AJBPS6285R1ZF</p>
          </div>
        </header>
        <p id="address">BUDHWARI BAZAR, GN ROAD SEONI,, SEONI</p>
        <div
          className="details"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div>
              ID: <strong>{id}</strong>
            </div>
            <div>
              Date: <strong>{date}</strong>
            </div>
          </div>
          <div>
            <div>
              From Godown: <strong>{fromGodown}</strong>
            </div>
            <div>
              To Godown: <strong>{toGodown}</strong>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Particular</th>
              <th>Pack</th>
              <th>GST %</th>
              <th>Unit</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={index % 20 === 0 ? 'page-break' : ''}>
                <td>{item.code}</td>
                <td>{item.particular}</td>
                <td>{item.pack}</td>
                <td>{item.gst}</td>
                <td>{item.unit}</td>
                <td>{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="footer">
          <div>
            Total Items: <strong>{items.length}</strong>
          </div>
          <div>
            Total Quantity:{' '}
            <strong>{items.reduce((acc, item) => acc + parseInt(item.qty), 0)}</strong>
          </div>
        </footer>
      </div>

      <style>
        {`
                    .godownId {
                        width: 80%;
                        margin: 20px auto;
                        display: flex;
                        flex-direction: column;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        border: 1px solid black;
                    }

                    .header h1 {
                        margin: 0;
                        text-align: center;
                    }

                    .header p {
                        text-align: center;
                        margin: 5px 0;
                    }

                    .details {
                        display: flex;
                        gap: 10px;
                        border-top: 1px solid black;
                        padding-top: 3px;
                        padding-bottom: 10px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    table thead th {
                        border: 1px solid black;
                    }

                    th, td {
                        padding: 8px;
                        text-align: left;
                    }

                    td {
                        border-right: 1px solid black;
                    }

                    td:first-child {
                        border-left: 1px solid black;
                    }

                    .footer {
                        display: flex;
                        justify-content: space-between;
                        border-top: 1px solid black;
                        padding-top: 10px;
                        margin-top: 20px;
                    }

                    .page-break {
                        page-break-before: always;
                    }

                    @media print {
                        .godownId {
                            font-size: 10px;
                        }

                        .header h1 {
                            font-size: 14px;
                        }

                        .header p, .details div, .footer div {
                            font-size: 10px;
                        }

                        th, td {
                            font-size: 10px;
                        }

                        .page-break {
                            page-break-before: always;
                        }
                    }
                `}
      </style>
    </>
  );
};

const headerStyles = {
  display: 'flex',
  flexDirection: 'row',
  gap: '2px',
  padding: '20px',
};
