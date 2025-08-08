import React, { useState } from 'react';
import Header4 from './Header4';
import BAPI from '../helper/variable';
import { Box, Button, Typography } from '@mui/material';
import Select from 'react-select';
import axios from 'axios'

export default function Payment() {
  const user=localStorage.getItem('user');
  const accessToken = localStorage.getItem('accessToken');
  console.log(user);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [Amount, setAmount] = useState('');

  const CurrencyOptions = [
    { value: 'INR', label: 'India Rupee (INR)', symbol: '₹', processingFee: 400 },
    { value: 'USD', label: 'US Dollar (USD)', symbol: '$', processingFee: 5 },
    { value: 'CAD', label: 'Canadian Dollar (CAD)', symbol: 'C$', processingFee: 6 },
    { value: 'GBP', label: 'British Pound (GBP)', symbol: '£', processingFee: 4 },
    { value: 'CNY', label: 'Chinese Yuan (CNY)', symbol: '¥', processingFee: 30 },
    { value: 'RUB', label: 'Russian Ruble (RUB)', symbol: '₽', processingFee: 300 },
  ];

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const selectedCurrencyDetails = CurrencyOptions.find(
    (option) => option.value === selectedCurrency
  );
  const { symbol, processingFee } = selectedCurrencyDetails || { symbol: '', processingFee: 0 };
  const handlePayment = async () => {
    try {
        const orderResponse = await axios.post(`${BAPI}/api/v0/payments/create_order`, {
            "amount": parseInt(Amount),  
            "currency":"INR",
            receipt: 'order_rcptid_11'
        },{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const { amount, id: order_id, currency } = orderResponse.data;

        const options = {
            key: 'rzp_test_vDtp35HbZSgmy3',  // Enter the Key ID generated from the Dashboard
            amount: amount,
            currency: currency,
            name: 'Acme Corp',
            description: 'Test Transaction',
            order_id: order_id,
            handler: async function (response) {
                const paymentData = {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    "amount":amount
                };

                const verifyResponse = await axios.post(`${BAPI}/api/v0/payments/verify_payment`, paymentData,{
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                  },
                });

                if (verifyResponse.data.status === 'Payment verified successfully') {
                    alert('Payment Successful');
                } else {
                    alert('Payment verification failed');
                }
            },
            prefill: {
                name: user.full_name,
                email: user.email,
                contact: '9999999999'
            },
            notes: {
                address: 'Razorpay Corporate Office'
            },
            theme: {
                color: '#3399cc'
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    } catch (error) {
        console.error('Error in creating order', error);
    }
};
  return (
    <Box>
      <Header4 />
      <Box sx={{ padding: {sm:'40px',xs:'20px'} }}>
        <Box
          sx={{
            borderRadius: '16px',
            boxShadow: '0px 0px 4px 1px #00000040',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottom: '1px solid #00000080',
            }}
          >
            <Typography sx={{ fontWeight: '600', fontSize: '22px' }}>
              Select Amount
            </Typography>
            <Typography sx={{ fontWeight: '600', fontSize: '22px' }}>
              ({selectedCurrency})
            </Typography>
          </Box>
          <Box sx={{ padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderBottom: '1px solid #000000B3',
                padding: '16px 0',
                gap: '15px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap:'10px'
                }}
              >
                <Typography sx={{ color: '#000000B3' }}>Currency</Typography>
                <Select
                  options={CurrencyOptions}
                  value={CurrencyOptions.find((option) => option.value === selectedCurrency)}
                  onChange={handleCurrencyChange}
                  placeholder="Select Currency"
                  name="curropts"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: '200px',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      padding: '0 10px',
                      borderRadius: '16px',
                      boxShadow: '0px 0px 4px 1px #00000040',
                      textAlign: 'center',
                    }),
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap:'10px'
                }}
              >
                <Typography sx={{ color: '#000000B3' }}>Amount</Typography>
                <input
                  type="text"
                  value={Amount}
                  onChange={handleAmountChange}
                  placeholder="Amount here"
                  style={{
                    width: '200px',
                    padding: '10px',
                    borderRadius: '16px',
                    boxShadow: '0px 0px 4px 1px #00000040',
                    outline: 'none',
                    border: 'none',
                    textAlign: 'right',
                    fontSize: '16px',
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap:'10px'
                }}
              >
                <Typography sx={{ color: '#000000B3' }}>Processing Fee</Typography>
                <Typography sx={{ color: '#000000' }}>
                  {symbol}
                  {processingFee.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', padding: '16px 0', gap: '15px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#000000', fontWeight: '600' }}>Total Amount</Typography>
                <Typography sx={{ color: '#000000', fontWeight: '600' }}>
                  {symbol}
                  {(parseFloat(Amount) + processingFee).toFixed(2) || '0.00'}
                </Typography>
              </Box>
              <Box sx={{textAlign:'center'}}>
                <Button onClick={handlePayment} sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 25px',fontSize:'14px', fontWeight:'700',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Confirm and Pay  {symbol}
                  {(parseFloat(Amount) + processingFee).toFixed(2) || '0.00'}</Button>
              </Box>
              <Box sx={{textAlign:'center'}}>
              <Typography sx={{ color: '#454545', fontWeight: '500',fontSize:'14px' }}>
                 You agree to authorize the use of your card for this deposit and future payments, 
                 and agree to be bound to the <span ><a href="/terms-and-conditions" style={{color:'#0038FF',}} target="_blank" rel="noopener noreferrer">Terms & Conditions.</a></span>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
