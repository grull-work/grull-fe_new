import React, { useState } from 'react'
import MUIDataTable from "mui-datatables";
import '../styles/CommonWallet.css'
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { DatePicker, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


function MUITable() {

    const { RangePicker } = DatePicker;

    const data = [
        ['12 Dec 2023', '+₹8414.00', 'Success', 'ID-1234567890'],
        ['12 May 2023', '+₹8414.00', 'Failed', 'ID-1234567890'],
        ['12 Dec 2023', '-₹8414.00', 'Success', 'ID-1234567890'],
        ['12 Dec 2023', '+₹8414.00', 'Success', 'ID-1234567890'],
        ['12 Dec 2023', '+₹8414.00', 'Success', 'ID-1234567890'],
        ['12 Dec 2023', '-₹8414.00', 'Pending', 'ID-1234567890'],
        ['12 Dec 2023', '+₹8414.00', 'Success', 'ID-1234567890'],
        ['12 Dec 2022', '+₹8414.00', 'Success', 'ID-1234567890'],
        ['12 Dec 2024', '-₹8414.00', 'Failed', 'ID-1234567890'],
        ['12 Dec 2023', '-₹8414.00', 'Success', 'ID-1234567890'],
        ['12 Dec 2023', '+₹8414.00', 'Success', 'ID-1234567890'],
        ['12 Dec 2023', '+₹8414.00', 'Pending', 'ID-1234567890'],
    ];
    
    const columns = [
        'Date',
        'Amount',
        'Status',
        'Transaction ID',
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'success':
                return 'green';
            case 'failed':
                return 'red';
            case 'pending':
                return 'orange';
            default:
                return 'black';
        }
    };
    const [searchBox, setSearchBox] = useState('');
    const [transactionType, setTransactionType] = useState(0);
    const [selectedDateRange, setSelectedDateRange] = useState(null);

    const handleTransactionTypeChange = (e) => {
        setTransactionType(parseInt(e.target.value, 10));
    };

    const handleDateRangeChange = (dates) => {
        setSelectedDateRange(dates);
    };

    const filterData = () => {
        return data.filter((row) => {
            const [date, amount, status, transactionId] = row;
            const matchesSearchBox = searchBox === '' || row.some((cell) => cell.toLowerCase().includes(searchBox.toLowerCase()));
            const matchesTransactionType = transactionType === 0 || status.toLowerCase() === (transactionType === 1 ? 'success' : transactionType === 2 ? 'failed' : 'pending');
            const matchesDateRange = !selectedDateRange || (new Date(date) >= new Date(selectedDateRange[0]) && new Date(date) <= new Date(selectedDateRange[1]));

            return matchesSearchBox && matchesTransactionType && matchesDateRange;
        });
    };

    const filteredData = filterData();

    return (
        <Box sx={{ marginTop: '15px' }}>
        <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',gap:'12px' }}>
            <div style={{ position: 'relative' }}>
                <input
                    value={searchBox}
                    onChange={(e) => setSearchBox(e.target.value)}
                    type="text"
                    placeholder="Search or Filter Transactions"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0px 0px 4px 0px #00000040',
                        border: 'none',
                        width: '100%',
                        padding: '10px 45px',
                        fontSize: '16px',
                        color: '#00000080',
                    }}
                />
                <FontAwesomeIcon icon={faSearch} style={{
                    color: '#957474', position: 'absolute',
                    left: '16px', top: '12px'
                }} />
            </div>
            <select className='MUITable_Select' value={transactionType} onChange={handleTransactionTypeChange}>
                <option value={0}>All Transactions</option>
                <option value={1}>Success</option>
                <option value={2}>Failed</option>
                <option value={3}>Pending</option>
            </select>
            <RangePicker
                style={{
                    borderRadius: '12px', boxShadow: '0px 0px 4px 0px #00000040',
                }}
                onChange={handleDateRangeChange}
                value={selectedDateRange}
            />
        </Grid>

        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column} style={{ borderBottom: '1px solid #000000', padding: '30px 0', textAlign: 'center' }}>
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                    {filteredData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={{
                                    padding: '30px 0',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    borderBottom:'1px solid #00000080 ',
                                    color: cellIndex === 2 ? getStatusColor(cell) : 'inherit',
                                }}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
        </table>
    </Box>
    )
}

export default MUITable