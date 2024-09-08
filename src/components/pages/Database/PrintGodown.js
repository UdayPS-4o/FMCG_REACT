import React, { useEffect, useState } from 'react';
import constants from 'src/constants';

export default function PrintGodownT() {
    const printRef = React.useRef();
    const [godownId, setGodownId] = useState(null);
    const queryParams = new URLSearchParams(window.location.search);
    const queryKey = queryParams.keys().next().value;
    const retreat = queryParams.get(queryKey);

    useEffect(() => {
        fetch(`${constants.baseURL}/json/godown`)
            .then((res) => res.json())
            .then((data) => {
                // Filter data based on 'id' from query parameter
                const godown = data.find((godown) => godown.id === retreat);
                setGodownId(godown);
                console.log('Filtered Godown:', godown);
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
            <div ref={printRef}>
                {godownId && (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <TransferGodownData transferData={godownId} />
                        <TransferGodownData transferData={godownId} />
                    </div>
                )}
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
                <div className="details">
                    <div>
                        ID: <strong>{id}</strong>
                    </div>
                    <div>
                        Date: <strong>{date}</strong>
                    </div>
                    <div>
                        From Godown: <strong>{fromGodown}</strong>
                    </div>
                    <div>
                        To Godown: <strong>{toGodown}</strong>
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
                            <tr key={index}>
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
                        Total Quantity: <strong>{items.reduce((acc, item) => acc + parseInt(item.qty), 0)}</strong>
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
                        padding-top:3px;
                        padding-bottom: 10px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    table, th, td {
                        border: 1px solid black;
                    }

                    th, td {
                        padding: 8px;
                        text-align: left;
                    }

                    .footer {
                        display: flex;
                        justify-content: space-between;
                        border-top: 1px solid black;
                        padding-top: 10px;
                        margin-top: 20px;
                    }


                `}
            </style>
        </>
    );
};

const headerStyles = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '2px',
    // borderBottom: '1px solid black',
    padding: '20px',
};
