import { useState, useEffect } from 'react';
import React from 'react';
import constants from 'src/constants';

export default function PrintInvoicing() {
    const [invoiceData, setInvoiceData] = useState(null);
    const printRef = React.useRef();

    const queryParams = new URLSearchParams(window.location.search);
    const queryKey = queryParams.keys().next().value;
    const invoiceId = queryParams.get(queryKey);

    useEffect(() => {
        // Fetch the invoice data
        fetch(`${constants.baseURL}/slink/printInvoice?id=${invoiceId}`)
            .then((res) => res.json())
            .then((data) => {
                setInvoiceData(data);
            });
    }, [invoiceId]);

    const handlePrint = () => {
        const printContent = printRef.current;
        const winPrint = window.open('', '', 'width=1000');
        winPrint.document.write(printContent.innerHTML);
        winPrint.document.close();
        winPrint.focus();
        winPrint.print();
    };

    if (!invoiceData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <button onClick={handlePrint}>Print</button>
            <div ref={printRef}>
                <Invoice invoiceData={invoiceData} />
            </div>
        </>
    );
}

export function Invoice({ invoiceData }) {
    return (
        <>
            <div className="invoice-container">
                {/* Header */}
                <div className="invoice-header">
                    <div className="left-header">
                        <p>GSTN : {invoiceData.company.gstin}</p>
                        <p>{invoiceData.company.subject}</p>
                        <p>FSSAI NO : {invoiceData.company.fssaiNo}</p>
                    </div>
                    <div className="center-header">
                        <p className="uppercase">Tax Invoice</p>
                        <h1>{invoiceData.company.name}</h1>
                        <p>{invoiceData.company.address}</p>
                    </div>
                    <div className="right-header">
                        <p>{invoiceData.company.phone}</p>
                        <p>Office No. {invoiceData.company.officeNo}</p>
                        <p>State Code: {invoiceData.company.stateCode}</p>
                    </div>
                </div>

                {/* DL No */}
                <div className="dl-no">
                    <p>D.L. No.: {invoiceData.dlNo}</p>
                </div>

                {/* Party Details and Invoice Info */}
                <div className="party-details">
                    <div>
                        <p><span className="font-bold">Party: </span>{invoiceData.party.name}</p>
                        <p><span className="font-bold">Address: </span>{invoiceData.party.address}</p>
                        <p><span className="font-bold">GSTIN: </span>{invoiceData.party.gstin} <span className="font-bold">State Code: </span>{invoiceData.party.stateCode}</p>
                        <p><span className="font-bold">Mobile No.: </span>{invoiceData.party.mobileNo} <span className="font-bold">Balance B/f: </span>{invoiceData.party.balanceBf}</p>
                    </div>
                    <div>
                        <p><span className="font-bold">Inv. No.: </span>{invoiceData.invoice.no} <span className="font-bold">Mode: </span>{invoiceData.invoice.mode}</p>
                        <p><span className="font-bold">Date: </span>{invoiceData.invoice.date} {invoiceData.invoice.time}</p>
                        <p><span className="font-bold">Due Date: </span>{invoiceData.invoice.dueDate}</p>
                    </div>
                </div>

                {/* Ack and IRN */}
                <div className="party-details">
                    <p>Ack. No. {invoiceData.ack.no} <span className="ml-4">Ack.Date: {invoiceData.ack.date}</span></p>
                    <p>IRN No. {invoiceData.irn}</p>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Particulars/HSN</th>
                                <th>Pack</th>
                                <th>M.R.P</th>
                                <th>GST%</th>
                                <th>Rate (incl of Tax)</th>
                                <th>Unit</th>
                                <th>Qty</th>
                                <th>Free</th>
                                <th>Sch Rs.</th>
                                <th>Net Amt.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.particular}</td>
                                    <td>{item.pack}</td>
                                    <td>{item.mrp.toFixed(2)}</td>
                                    <td>{item.gst.toFixed(2)}</td>
                                    <td>{item.rate.toFixed(2)}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.free}</td>
                                    <td>{item.sch}</td>
                                    <td>{item.netAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary and Totals */}
                <div className="invoice-summary">
                    <div className="w-[30%]">
                        <p>Items in Bill: {invoiceData.summary.itemsInBill}</p>
                        <p>Cases in Bill: {invoiceData.summary.casesInBill}</p>
                        <p>Loose items in Bill: {invoiceData.summary.looseItemsInBill}</p>
                    </div>
                    <div className="w-[70%]">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p>1. We hereby certify that articles of food mentioned in the invoice are warranted to be of the nature and quality which they purport to be as per the Food Safety and Standards Act and Rules.</p>
                        <p>2. Goods once sold will not be taken back. E & OE.</p>
                    </div>
                </div>

                {/* Tax and Total Tables */}
                <div className="flex justify-between">
                    <table className="invoice-table w-1/2">
                        <thead>
                            <tr>
                                <th>Goods</th>
                                <th>SGST%</th>
                                <th>Value</th>
                                <th>CGST%</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{invoiceData.taxDetails[0].goods}</td>
                                <td>{invoiceData.taxDetails[0].sgst}%</td>
                                <td>{invoiceData.taxDetails[0].sgstValue}</td>
                                <td>{invoiceData.taxDetails[0].cgst}%</td>
                                <td>{invoiceData.taxDetails[0].cgstValue}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="invoice-table w-1/2">
                        <tbody>
                            <tr>
                                <td>Gross Amt.</td>
                                <td>{invoiceData.totals.grossAmt}</td>
                            </tr>
                            <tr>
                                <td>Less Sch.</td>
                                <td>{invoiceData.totals.lessSch}</td>
                            </tr>
                            <tr>
                                <td>Less CD</td>
                                <td>{invoiceData.totals.lessCd}</td>
                            </tr>
                            <tr>
                                <td>R.Off</td>
                                <td>{invoiceData.totals.rOff}</td>
                            </tr>
                            <tr className="font-bold">
                                <td>Net Amt.</td>
                                <td>{invoiceData.totals.netAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Style Block */}
            <style>
                {`
                    .invoice-container {
                      font-family: Arial, sans-serif;
                      max-width: 1300px;
                      margin: 0 auto;
                      padding: 20px;
                      border: 1px solid #000;
                    }
                    .invoice-header {
                      display: flex;
                      justify-content: space-between;
                      border-bottom: 1px solid #000;
                      padding-bottom: 10px;
                    }
                    .left-header, .right-header {
                      font-size: 12px;
                    }
                    .center-header {
                      text-align: center;
                    }
                    .center-header h1 {
                      margin: 0;
                      font-size: 24px;
                    }
                    .dl-no {
                      border-bottom: 1px solid #000;
                      padding: 5px 0;
                      font-size: 12px;
                    }
                    .party-details {
                      display: flex;
                      justify-content: space-between;
                      border-bottom: 1px solid #000;
                      padding: 10px 0;
                      font-size: 14px;
                    }
                    .invoice-table {
                      width: 100%;
                      border-collapse: collapse;
                      font-size: 12px;
                    }
                    .invoice-table th, .invoice-table td {
                      border: 1px solid #000;
                      padding: 5px;
                      text-align: left;
                    }
                    .invoice-summary {
                      display: flex;
                      justify-content: space-between;
                      margin-top: 20px;
                      font-size: 12px;
                    }
                    .invoice-total {
                      text-align: right;
                      margin-top: 20px;
                      font-size: 16px;
                    }
                    /* Overwrites for Tailwind */
                    .bg-white {
                      background-color: #fff;
                    }
                    .p-1 {
                      padding: 5px;
                    }
                    .p-4 {
                      padding: 16px;
                    }
                    .mx-auto {
                      margin-left: auto;
                      margin-right: auto;
                    }
                    .text-[0.6rem] {
                      font-size: 0.6rem;
                    }
                    .sm\\:text-xs {
                      font-size: 12px;
                    }
                    .print\\:text-[0.6rem] {
                      font-size: 0.6rem !important;
                    }
                    .max-w-[1300px] {
                      max-width: 1300px;
                    }
                    .border {
                      border: 1px solid #000;
                    }
                    .border-black {
                      border-color: black;
                    }
                    .text-center {
                      text-align: center;
                    }
                    .text-right {
                      text-align: right;
                    }
                    .font-bold {
                      font-weight: bold;
                    }
                `}
            </style>
        </>
    );
}

