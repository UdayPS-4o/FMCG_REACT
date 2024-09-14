import React, { useEffect, useState } from 'react';
import constants from 'src/constants';

export default function PrintInvoicing() {
    const [invoiceData, setInvoiceData] = useState(null);
    const printRef = React.useRef();

    const queryParams = new URLSearchParams(window.location.search);
    const queryKey = queryParams.keys().next().value;
    const invoiceId = queryParams.get(queryKey);
    const [partyname, setPartyname] = useState('');

    useEffect(() => {
        let invoicedata;
        // Fetch the invoice data
        fetch(`${constants.baseURL}/slink/printInvoice?id=${invoiceId}`)
            .then((res) => res.json())
            .then((data) => {
                invoicedata = data;
                setInvoiceData(data);

                fetch(`${constants.baseURL}/cmpl`).then((res) => res.json()).then((data) => {
                    const party = data.find((party) => party.id === invoicedata.party);
                    setPartyname(party.name);
                });
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

    const { date, series, cash, id, party, sm, dueDays, ref, items } = invoiceData;

    return (
        <>
            <button onClick={handlePrint}>Print</button>
            <div ref={printRef}>
                <div className='TopMostDIv'
                    style={{
                        display: 'flex',
                    }}
                >
                    <div className="invoice-container" style={{ width: '1000px' }}>
                        <div className="invoice-header">
                            <div>
                                <div>
                                    <strong>GSTN : 23 AJBPS6285R1ZF</strong>
                                </div>
                                <div>
                                    <strong>Subject to SEONI Jurisdiction</strong>
                                </div>
                                <div>
                                    <strong>FSSAI NO : 11417230000027</strong>
                                </div>
                            </div>
                            <div id="company-name">
                                <h4>Tax Invoice</h4>
                                <h1>EKTA ENTERPRISE</h1>
                                <h5>BUDHWARI BAZAR, GN ROAD SEONI,</h5>
                            </div>
                            <div>
                                <h6>Ph : 9179174888 , 9826623188</h6>
                                <p>Office No. 07692-220897</p>
                                <h6>State code: 23</h6>
                            </div>
                        </div>

                        <div className="DLno">
                            <strong>
                                D.L. No.: 20B/807/54/2022 , 21B/808/54/2022 , 20/805/54/2022 ,
                                21/806/54/2022
                            </strong>
                        </div>

                        <div className="invoice-details section-2">
                            <table style={{ borderRight: '2px solid black', height: '175px' }}>
                                <tr>
                                    <th>Party</th>
                                    <th colSpan="2">{partyname}</th>
                                    <th></th>
                                    <th style={{ position: 'relative' }}>
                                        <img src="./qr_ekta.png" alt="" style={{ position: 'absolute' }} />
                                    </th>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td colSpan="2">
                                        BUS STAND
                                        <br />
                                        ADEGAON
                                    </td>
                                </tr>
                                <tr>
                                    <th>GSTIN</th>
                                    <td>23BPAPA8654L1ZW</td>
                                    <th>State Code : 23</th>
                                </tr>
                                <tr>
                                    <th>Mobile No.</th>
                                    <td colSpan="2">9752899120</td>
                                    <th>Balance B/f</th>
                                    <td>55448.00 Dr</td>
                                </tr>
                            </table>
                            <table>
                                <tr>
                                    <th>Inv. No : B-3114</th>
                                    <th>Mode: CREDIT</th>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Date</strong>: {
                                            date
                                        }
                                    </td>
                                    <td>07:07:48 PM</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Due Date</strong> 20.06.2024
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <section className="section-2-bottom">
                            <div

                            >
                                <span
                                    style={{

                                        padding: '10px',
                                    }}
                                >Ack. No.</span>
                                <p>162417426714120</p>
                            </div>
                            <div>
                                <span

                                    style={
                                        {

                                            padding: '10px',
                                        }
                                    }

                                >Ack. Date</span>
                                <p>2024/06/13 07:08:00</p>
                            </div>
                            <div>
                                <span
                                    style={{

                                     
                                        padding: '10px',
                                    }}
                                >IRN No.</span>
                                <p>
                                    0265cdbc86f02a327272925c34fd6014d5701a832b58d00f5b5b85cf452f30b8
                                </p>
                            </div>
                        </section>

                        <div className="invoice-details">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Particulars/HSN</th>
                                        <th>Pack</th>
                                        <th>M.R.P.</th>
                                        <th>GST %</th>
                                        <th>Rate (incl of Tax)</th>
                                        <th>Unit</th>
                                        <th>Qty</th>
                                        <th>Free</th>
                                        <th>Sch Rs.</th>
                                        <th>Co. Sch% Cash Disc%</th>
                                        <th>Net Amt.</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.particular}</td>
                                            <td>{item.pack}</td>
                                            <td>{item.mrp}</td>
                                            <td>{item.gst}</td>
                                            <td>{item.rate}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.qty}</td>
                                            <td>0</td>
                                            <td>{item.sch}</td>
                                            <td>{item.cd}</td>
                                            <td>{item.netAmount}</td>
                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                        </div>

                        <div className="invoice-details" style={{ display: 'flex' }}>
                            <div style={{ borderBottom: '2px solid black', width: '20%', padding: '10px' }}>
                                <p>Items in Bill: {items.length}</p>
                                <p>Cases in Bill: 60.0</p>
                                <p>Loose items in Bill: {items.reduce((acc, item) => acc + parseInt(item.qty), 0)}</p>
                            </div>
                            <div
                                className="terms"
                                style={{
                                    borderLeft: '2px solid black',
                                    borderBottom: '2px solid black',
                                    width: '50%',
                                    padding: '10px',
                                }}
                            >
                                <p style={{ fontSize: '10px', fontWeight: 700, textDecoration: 'underline' }}>
                                    Terms & Conditions:
                                </p>
                                <p>
                                    1. We hereby certify that articles of food mentioned in the invoice
                                    are warranted to be of the nature and quality which they purport to
                                    be as per the Food Safety and Standards Act and Rules.
                                </p>
                                <p>2. Goods once sold will not be taken back. E & OE.</p>
                            </div>

                            <div>
                                <table style={{ border: '0px', height: '85.5%' }}>
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
                                        {
                                            items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.particular}</td>
                                                    <td>{item.gst / 2.0}</td>
                                                    <td>{
                                                        item.netAmount * 9 / 100
                                                    }</td>
                                                    <td>{item.gst / 2.0}</td>
                                                    <td>{
                                                        item.netAmount * 9 / 100
                                                    }</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        border: '1px solid black',
                                    }}
                                >
                                    <div>28450.35</div>
                                    <div>1573.76</div>
                                    <div>1573.76</div>
                                </div>
                            </div>

                            <div style={{ width: '37%' }}>
                                <table style={{ border: '0px', height: '72.9%' }}>
                                    <thead>
                                        <tr>
                                            <th>Gross Amt.</th>
                                            <th>{
                                                items.reduce((acc, item) => acc + item.netAmount, 0)
                                            }</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Less Sch.</td>
                                            <td>{
                                                items.reduce((acc, item) => acc + item.sch, 0)
                                            }</td>
                                        </tr>
                                        <tr>
                                            <td>Less CD</td>
                                            <td>{
                                                items.reduce((acc, item) => acc + item.cd, 0)
                                            }</td>
                                        </tr>
                                        <tr>
                                            <td>R.Off</td>
                                            <td>{
                                                items.reduce((acc, item) => acc + item.netAmount, 0) - items.reduce((acc, item) => acc + item.sch, 0) - items.reduce((acc, item) => acc + item.cd, 0)
                                            }</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div
                                    style={{
                                        display: 'flex',
                                        padding: '8px',
                                        justifyContent: 'space-between',
                                        border: '1px solid black',
                                        fontWeight: 700,
                                    }}
                                >
                                    <div>Net Amt.</div>
                                    <div>{
                                        items.reduce((acc, item) => acc + item.netAmount, 0) - items.reduce((acc, item) => acc + item.sch, 0) - items.reduce((acc, item) => acc + item.cd, 0)
                                    }</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-container">
                        <div className="invoice-header">
                            <div id="company-name">
                                <h4>Tax Invoice</h4>
                                <h1>EKTA ENTERPRISE</h1>
                                <h5>BUDHWARI BAZAR, GN ROAD SEONI,</h5>
                            </div>
                        </div>
                        <div className="DLno">&nbsp;</div>


                        {/* Section 2 */}
                        <div className="invoice-details section-2">
                            <table style={{ height: '175px' }}>
                                <tbody>
                                    <tr>
                                        <th>Inv. No : B-3114</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Date</strong>: {date}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Due Date</strong>: {date}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <section className="section-2-bottom">&nbsp;</section>

                        <div className="invoice-details">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Particulars/HSN</th>
                                        <th>M.R.P.</th>
                                        <th>Qty</th>
                                        <th>Free</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.particular}</td>
                                                <td>{item.mrp}</td>
                                                <td>{item.qty}</td>
                                                <td>
                                                    {item?.free || 0}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className="invoice-details" style={{ borderTop: '0' }}>
                            <table style={{ border: '0px', height: '72.9%' }}>
                                <thead>
                                    <tr>
                                        <th>Gross Amt.</th>
                                        <th>{
                                            items.reduce((acc, item) => acc + item.netAmount, 0)
                                        }</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Less Sch.</td>
                                        <td>{
                                            items.reduce((acc, item) => acc + item.sch, 0)
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>Less CD</td>
                                        <td>{
                                            items.reduce((acc, item) => acc + item.cd, 0)
                                        }</td>
                                    </tr>
                                    <tr>
                                        <td>R.Off</td>
                                        <td>{
                                            items.reduce((acc, item) => acc + item.netAmount, 0) - items.reduce((acc, item) => acc + item.sch, 0) - items.reduce((acc, item) => acc + item.cd, 0)
                                        }</td>
                                    </tr>
                                    <tr>
                                        <th>Net Amt.</th>
                                        <th>{
                                            items.reduce((acc, item) => acc + item.netAmount, 0) - items.reduce((acc, item) => acc + item.sch, 0) - items.reduce((acc, item) => acc + item.cd, 0)
                                        }</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <style>
                    {`

              

                .TopMostDIv {
                        font-size: 0.9rem;
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 10px;
                        width: max-content;
                }
                .invoice-container {
                  border: 2px solid black;
                }

                .invoice-header {
                  padding-bottom: 10px;
                  display: flex;
                  justify-content: space-evenly;
                }

                .DLno {
                  border-bottom: 2px solid black;
                }

                #company-name {
                  text-align: center;
                }

                .section-2 {
                  border: 0;
                }

                .section-2-bottom {
                  display: flex;
                  justify-content: space-between;
                  border-top: 2px solid black;
                  border-bottom: 2px solid black;
                  padding-top: 4px;
                  padding-bottom: 10px;
                  font-size: 0.8rem;
                }

                .section-2-bottom div {
                  display: flex;
                }

                .invoice-title {
                  text-align: center;
                  font-size: 20px;
                }

                .invoice-details {
                  width: 100%;
                  display: flex;
                }

                .invoice-details th,
                .invoice-details td {
                  border: 1px solid black;
                  padding: 5px;
                  text-align: left;
                  font-size: 12px;
                }

                .section-2 th,
                .section-2 td {
                  border: 0;
                }

                .invoice-details table {
                  width: 100%;
                  border-collapse: collapse;
                }

                .terms {
                  margin-top: 20px;
                  font-size: 12px;
                }

                .terms p {
                  margin: 5px 0;
                }

                .bank-details {
                  margin-top: 10px;
                  font-size: 12px;
                  text-align: center;
                }

                .no-border td {
                  border: none;
                }
            `}
                </style>

            </div>
        </>
    );
}
