import React, { useState } from 'react'
import '../styles/CommonWallet.css'
import { Box, Button, Grid, Typography } from '@mui/material'
import MUITable from './MUITable'
import Header3 from './Header3';


function CommonWallet() {

    // document.title = 'Wallet';

    const [hideAmount, setHideAmount] = useState(false);

    const showWalletBalance = () => {
        setHideAmount(!hideAmount);
    }

    return (
        <>
        <Header3 />
        <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // minHeight: '100vh',
                flexDirection: 'column',
                width: '100%',marginTop: '70px', marginBottom: '40px'
            }}>
            <Grid sx={{}}>
                <Grid sx={{display:'flex',flexDirection:'row',flexWrap:'wrap',alignItems:'center'}} >
                    <Typography style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center', outline: 'none', border: 'none' }} >₹8414.00</Typography>
                    <Typography onClick={showWalletBalance} sx={{ fontWeight: '200',  color: '#B27EE3', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer',marginLeft:'20px' }}>{hideAmount ? 'Hide Balance' : 'Show Balance'}</Typography>
                </Grid>
                <Grid sx={{marginTop:'13px'}} >
                    <Typography sx={{ fontWeight: '500', fontSize: '16px', textAlign: 'center', width: '100%' }}>Current Balance</Typography>
                </Grid>
                <Grid sx={{marginTop:'13px'}} >
                    <Button sx={{ backgroundColor: '#B27EE3', color: '#fff', width: '100%', borderRadius: '12px', textTransform: 'none', padding: '5px 40px', fontWeight:'600',fontSize:'16px', '&:hover': { backgroundColor: '#B27EE3' } }}>Withdraw Balance</Button>
                </Grid>
            </Grid>

            <Grid sx={{ width: '90%',marginTop:'55px' }}>
                <Typography sx={{ fontWeight: '600', fontSize: '18px' }}>Transaction History</Typography>
                <Box sx={{
                    display:'grid',
                    gridTemplateColumns:'1'
                }}>
                <MUITable />
                </Box>
            </Grid>
        </Box>
        </>
    )
}

export default CommonWallet