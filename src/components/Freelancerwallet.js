import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import creditCardImage from '../assets/Character_3_Credit_Card.png';
import { IoMdAdd } from "react-icons/io";
import Modal from '@mui/material/Modal';
import { BsBank } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegCreditCard } from "react-icons/fa6";
import Input from '@mui/material/Input';
import { LuUpload } from "react-icons/lu";
import Checkbox from '@mui/material/Checkbox';
import { Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';
import { FiEdit3 } from "react-icons/fi";
import { TfiReload } from "react-icons/tfi";
import '../styles/wallet.css';
import { toast } from 'react-hot-toast';
import BAPI from '../helper/variable'
export default function Freelancerwallet() {
  const [country, setCountry] = useState('india'); 
  const [paymentway,setpaymentway]=useState('');
  const [setuppaymethod,setSetupmethod]=useState(0);
  const [modalPage, setModalPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [upidetails,setupidetails]=useState({holdername:'',upiid:''})
  const [carddetails,setcarddetails] = useState({holdername:'',cardNumber:'',expiryMonth:'',expiryYear:'',cardHolderName:'',cvv:''})
  const [bankdetails,setbankdetails]=useState({firstname:'',lastname:'',email:'',dob:'',documenttype:'pancard',selectedFile:null,holdername:'',ifsc:'',accno:'',confaccno:''})
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeSteptwo,setActiveSteptwo]=useState(1);
  
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  const handlepaymentmethod =(method)=>{
    setpaymentway(method)
  }
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)
  const handleBack = () => {
    if (modalPage === 0) {
      handleClose();
    } else if (modalPage === 1) {
      setModalPage(0);
    }
  };
  const handleContinue = () => {
    if (modalPage === 0) {
      setModalPage(1);
    } else if (modalPage === 1) {
      if(paymentway === ''){
        toast.error('Please Select the Payment Method')
      }
      else{
        setSetupmethod(1)
        handleClose();
      }
    }
  };
  const handleUpidetails = (name, event) => {
    setupidetails((prevUpidetails) => ({
      ...prevUpidetails,
      [name]: event.target.value,
    }));
  };
  const handleCarddetails = (name, event) => {
    setcarddetails((prevCarddetails) => ({
      ...prevCarddetails,
      [name]: event.target.value,
    }));
  };
  const handleBankdetails = (name, event) => {
    setbankdetails((prevBankdetails) => ({
      ...prevBankdetails,
      [name]: event.target.value,
    }));
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setbankdetails((prevBankdetails) => ({
      ...prevBankdetails,
      selectedFile: file,
    }));
  };
  const handleConfirm1Change = () => {
    setConfirm1(!confirm1);
  };
  const handleConfirm2Change = () => {
    setConfirm2(!confirm2);
  };
  const isFormValid = bankdetails.selectedFile && confirm1 && confirm2;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '16px',
    maxWidth: '850px',
    p: 4 ,
  };
  return (
  <>
    {setuppaymethod===0 && 
    <Box sx={{padding:'0 70px',display:'flex',flexDirection:'row',marginTop:'120px',gap:'30px',marginBottom:'40px'}} className='walletsetuptpage'>
      <Box sx={{flex:'1',display:'flex',flexDirection:'column',gap:'60px',padding:'0 20px'}} className='walletsetuptsection'>
        <Box sx={{boxShadow:' 0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'30px',display:'flex',flexDirection:'column',gap:'25px'}} className='walletcon2'>
           <Box sx={{backgroundColor:'#E8E8E8',width:'100%',padding:'26px',borderRadius:'16px'}}>
             <Typography sx={{color:'#0000004D',fontSize:'20px',fontWeight:'500',letterSpacing:'-1px',marginLeft:'20px',lineHeight:'24px',}} className='walletcont1'>Wallet Balance</Typography>
             <Typography sx={{color:'#0000004D',marginTop:'5px',fontSize:'24px',fontWeight:'500',letterSpacing:'-1px',lineHeight:'24px',}} className='walletcont2'><span style={{fontSize:'32px'}} className='walletcont3'>₹</span> 0.00</Typography>
             <Box sx={{marginTop:'11px',visibility:'hidden'}}>
                <Typography sx={{color:'#00000080',fontSize:'18px',fontWeight:'500',letterSpacing:'-1px'}} className='walletcont1'>INR</Typography>
             </Box>
           </Box>
           <Button onClick={handleOpen} className='walletbut1'
            sx={{fontSize:'20px',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',borderRadius:'16px',padding:'8px 24px',width:'fit-content',textTransform:'none',margin:'auto',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>
            Add An Account</Button>
        </Box>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
            <Box sx={style} className='modalcon1'>
                {
                    modalPage===0 &&
                    <>
                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'24px',}} className='modaltxt1'>Set up your Contra Wallet to start earning</Typography>
                <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#676767',lineHeight:'24px',marginTop:'15px'}} className='modaltxt2'>
                    Enter your details to receive payments commission-free on Grull. Select the country in which you legally operate.
                </Typography>
                <Box sx={{borderRadius: '16px',marginTop: '25px',boxShadow: '0px 0px 4px 0.5px #00000040',border: 'none',padding:'10px 22px'}}>
                    <Typography sx={{fontSize: '18px',fontWeight: '500',letterSpacing: '-0.005em',color:'#676767',lineHeight:'20px'}} className='modaltxt2'>Country</Typography>
                    <Box sx={{display:'flex',justifyContent:'center',marginTop:'12px'}}>
                        <IoLocationOutline style={{fontSize:'25px'}} />
                        <select value={country} onChange={handleCountryChange} style={{cursor:'pointer',border: 'none', fontSize: '18px',flex:1, outline: 'none', }} >
                            <option value="india">India</option>
                            <option value="usa">USA</option>
                            <option value="germany">Germany</option>
                        </select>
                    </Box>
                </Box>
                <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#676767',lineHeight:'24px',marginTop:'15px'}} className='modaltxt2'>
                   This location must match the location on the ID you'll be using to verify your identity.
                </Typography>
                </>
                }
                {
                    modalPage===1 &&
                    <>
                   <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',}} className='modaltxt1'>Add an account</Typography>
                   <Box sx={{display:'flex',flexDirection:'row',gap:'30px',padding:'40px 50px'}} className='modalcon2'>
                    <Box onClick={()=>{handlepaymentmethod('bank')}} sx={{cursor:'pointer',width:'180px',padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',border:paymentway==='bank'?'1px solid #000':'none'}}>
                           <BsBank style={{fontSize:'26px'}}/>
                           <Typography 
                            sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#000',lineHeight:'24px',marginTop:'15px'}}>
                            Bank Account
                            </Typography>
                    </Box>
                    <Box onClick={()=>{handlepaymentmethod('card')}} sx={{cursor:'pointer',width:'180px',padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',border:paymentway==='card'?'1px solid #000':'none'}}>
                           <FaRegCreditCard style={{fontSize:'26px'}}/>
                           <Typography  
                           sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#000',lineHeight:'24px',marginTop:'15px'}}>
                            Debit Card
                            </Typography>
                    </Box>
                    <Box onClick={()=>{handlepaymentmethod('upi')}} sx={{cursor:'pointer',width:'180px',padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',border:paymentway==='upi'?'1px solid #000':'none'}}>
                           <BsBank style={{fontSize:'26px'}}/>
                           <Typography  
                           sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#000',lineHeight:'24px',marginTop:'15px'}}>
                            UPI
                            </Typography>
                    </Box>
                   </Box>
                    </>
                }
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'right',gap:'12px',marginTop:'20px'}} className='modalbuts'>
                    <Button onClick={handleBack} className='modalbut'
                    sx={{backgroundColor:'#E3E3E3',color:'#000',textAlign:'center',fontSize:'20px',borderRadius:'16px',padding:'8px',width:'120px',textTransform:'none',':hover':{backgroundColor:'#E3E3E3',color:'#000'}}}>Back</Button>
                    <Button onClick={()=>handleContinue()} className='modalbut'
                    sx={{backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',padding:'8px',width:'120px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Continue</Button>
                </Box>
            </Box>
        </Modal>
        <Box sx={{boxShadow:' 0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon2'>
           <Typography sx={{color:'#00000',fontSize:'24px',fontWeight:'500'}} className='walletcont2'>Payout Accounts</Typography>
           <Box sx={{width:'100%',padding:'26px',border: '1px dashed #00000080',display:'flex',flexDirection:'row',gap:'25px',alignItems:'center'}} className='walletcon1'>
                <Button onClick={handleOpen} 
                sx={{border: '1px solid #B27EE3',borderRadius: '50%',display: 'flex',alignItems: 'center',justifyContent: 'center',width: '80px',height: '72px',padding: '0', margin: '0',overflow: 'hidden', }}>
                    <IoMdAdd style={{ color: '#000', fontSize: '30px' }} />
                </Button>
                <Box >
                    <Typography className='walletcont2' sx={{fontSize: '24px',fontWeight: '500',letterSpacing: '-1px',lineHeight:'24px',}}>Add an Account</Typography>
                    <Typography className='walletcont1' sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-1px',color:'#00000080',lineHeight:'22px',marginTop:'5px'}}>
                        Add an account to make transactions
                    </Typography>
                </Box>
           </Box>
        </Box>
      </Box>
      <Box sx={{flex:'1',margin:'20px 0',display:'flex',flexDirection:'column',}} >
        <Typography className='walletcont4'  sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',textAlign: 'center',lineHeight:'24px',}}>Get Paid for your work</Typography>
        <Typography className='walletcont5' sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#676767',lineHeight:'20px',marginTop:'15px'}}>
            You Currently don’t have any transactions. Once you
            start working on paid projects, all your transactions
            will appear here.
        </Typography>
        <Box sx={{marginTop:'55px',}} className='walletsetuptsectionimg'>
           <img alt='credit_card' src={creditCardImage} style={{margin:'auto'}}/>
        </Box>
        <Typography className='walletcont2' sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',textAlign: 'center',marginTop:'0'}}>Need some help ?</Typography>
      </Box>
    </Box>
}

{setuppaymethod === 1 && 
       <Box sx={{padding:'0 80px',marginTop:'90px',width:'60%',marginBottom:'40px'}} className='walletsetuppage2'>
             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <Box sx={{ backgroundColor: activeStep >= 1 ? '#B27EE3' : '#D9D9D9', borderRadius: '16px', width: '100%', height:activeStep >= 1 ? '6px' : '8px' }}></Box>
                <Box sx={{ backgroundColor: activeStep >= 2 ? '#B27EE3' : '#D9D9D9', borderRadius: '16px', width: '100%', height:activeStep >= 2 ? '6px' : '8px' }}></Box>
                <Box sx={{ backgroundColor: activeStep >= 3 ? '#B27EE3' : '#D9D9D9', borderRadius: '16px', width: '100%', height:activeStep >= 3 ? '6px' : '8px' }}></Box>
            </Box>
            {
                activeStep === 1 && (
                    <Box sx={{marginTop:'50px',width:'88%'}} className='walletcon3'>
                        <Typography sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                        Verify your personal details</Typography>
                        <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#474747',lineHeight:'24px',marginTop:'16px'}} className='walletcont7'>
                        Grull collects this information to verity your identity and keep your account sate.
                        </Typography>
                        <Box sx={{display:'flex',flexDirection:'column',gap:'25px',marginTop:'25px'}} className='walletcon4'>
                            <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px',}}>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} >Your Legal Name</Typography>
                                <input
                                        value={bankdetails.firstname}
                                        onChange={(e) => handleBankdetails('firstname', e)}
                                        placeholder='First Name'
                                        style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                                <input
                                        value={bankdetails.lastname}
                                        onChange={(e) => handleBankdetails('lastname', e)}
                                        placeholder='Last Name'
                                        style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                            <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletlabel1'>Email</Typography>
                                <input
                                        value={bankdetails.email}
                                        onChange={(e) => handleBankdetails('email', e)}
                                        placeholder='astlebenjamin@gmail.com'
                                        type='email'
                                        style={{color:'#090909',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                            <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletlabel1'>Date of birth</Typography>
                                <input
                                        value={bankdetails.dob}
                                        onChange={(e) => handleBankdetails('dob', e)}
                                        placeholder='DD/MM/YYYY'
                                        type='date'
                                        style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column'}}>
                            <Button onClick={()=>{setActiveStep(activeStep+1)}} className='walletbut2'
                            sx={{margin:'50px auto 10px',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Continue</Button>
                            <Button className='walletbut2'
                            sx={{boxShadow: '0px 0px 2px 0px #00000040', margin:'10px auto',backgroundColor:'#fff',color:'#000',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#ffff',color:'#000'}}}>Save for later</Button>
                        </Box>
                    </Box>
                )
            }
            { activeStep === 2 && activeSteptwo === 1 &&(
                    <Box sx={{marginTop:'50px',width:'88%'}} className='walletcon3'>
                        <Typography sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                        ID Verification for Astle Benjamin</Typography>
                        <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#474747',lineHeight:'24px',marginTop:'16px'}} className='walletcont7'>
                        For additional security, please have this person finish verifying their identity with a government-issued ID.
                        </Typography>
                        <Box sx={{marginTop:'50px',display:'flex',flexDirection:'column',gap:'20px',}} className='walletcon5'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>Proof of identity document</Typography>
                                <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#474747',lineHeight:'24px',}} className='walletcont7'>
                                Please pick which document you'd like to upload in order to verify the identity of Astle Benjamin
                                </Typography>
                                <Box sx={{boxShadow: '0px 0px 2px 0px #00000040',borderRadius:'16px',padding:'15px'}}>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        aria-label="documents"
                                        name="documents"
                                        value={bankdetails.documenttype}
                                        onChange={(e) => handleBankdetails('documenttype', e)}
                                        column
                                    >
                                        <FormControlLabel value="pancard" control={<Radio style={{ color: bankdetails.documenttype ==='pancard' ?'#B27EE3':'#000' }}/>} label="Individual Pan Card" />
                                        <FormControlLabel value="other" control={<Radio style={{ color: bankdetails.documenttype ==='other' ?'#B27EE3':'#000'  }}/>} label="Other" />
                                    </RadioGroup>
                                </FormControl>
                                </Box>
                        </Box>
                         
                        <Box sx={{display:'flex',flexDirection:'column'}}>
                            <Button onClick={()=>{setActiveSteptwo(activeSteptwo+1)}} className='walletbut2'
                            sx={{margin:'50px auto 10px',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Continue</Button>
                            <Button className='walletbut2'
                            sx={{boxShadow: '0px 0px 2px 0px #00000040', margin:'10px auto',backgroundColor:'#fff',color:'#000',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#ffff',color:'#000'}}}>Save for later</Button>
                        </Box>
                    </Box>
                )
            }
            {
                activeStep === 2 && activeSteptwo ===2 &&(
                    
     <Box sx={{marginTop:'50px',width:'88%'}} className='walletcon3'>
                        <Typography sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                        ID Verification for Astle Benjamin</Typography>
                        <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#474747',lineHeight:'24px',marginTop:'16px'}} className='walletcont7'>
                        For additional security, please have this person finish verifying their identity with a government-issued ID.
                        </Typography>
                        <Box sx={{marginTop:'50px',display:'flex',flexDirection:'column',gap:'5px',}} className='walletcon5'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>Individual PAN card</Typography>
                                <Typography sx={{color:'#2F66EC',fontSize:'20px'}} className='walletcont7'>Choose a different file</Typography>
                                <Input
                                    type="file"
                                    id="file-input"
                                    inputProps={{accept: 'image/*, application/pdf' }}
                                    style={{ display: 'none'}}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-input">
                                    <Button component="span" className='walletbut2' startIcon={<LuUpload />} sx={{padding:'10px 25px',marginTop:'10px',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',fontSize:'16px',color:'#000000B2',fontWeight:'600',textTransform:'none'}}>
                                    Upload Document
                                    </Button>
                                </label>
                                {bankdetails.selectedFile && <p>Selected File: {bankdetails.selectedFile.name}</p>}
                                <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#474747',lineHeight:'24px',marginTop:'15px'}} className='walletcont7'>
                                Please maka sure the document you're about to upload meets the requirements below. If it does, please confirm by checking:
                                </Typography>
                                <Box sx={{marginTop:'15px'}}>
                                  <FormControlLabel
                                    control={<Checkbox checked={confirm1} onChange={handleConfirm1Change} />}
                                    label={
                                      <span className='walletcont7'>
                                        The document shows exactly this information:
                                        Legal name:
                                        <span style={{ color: '#676767' }}>{bankdetails.firstname} {bankdetails.lastname}</span>
                                      </span>
                                    }
                                    style={{ color: '#000',fontSize:'20px'}}
                                  />
                                  <FormControlLabel
                                    control={<Checkbox checked={confirm2} onChange={handleConfirm2Change} />}
                                    label="The uploaded document is in color"
                                    className='walletcont7'
                                    style={{ color: '#000',fontSize:'20px'}}
                                  />
                                </Box>
                        </Box>
                         
                        <Box sx={{display:'flex',flexDirection:'column'}}>
                            <Button onClick={()=>{setActiveSteptwo(activeSteptwo+1)}} className='walletbut2'
                            sx={{margin:'50px auto 10px',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} disabled={!isFormValid}>Continue</Button>
                            <Button className='walletbut2'
                            sx={{boxShadow: '0px 0px 2px 0px #00000040', margin:'10px auto',backgroundColor:'#fff',color:'#000',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#ffff',color:'#000'}}}>Save for later</Button>
                        </Box>
                    </Box>
                )
            }
            {
          activeStep === 2 && activeSteptwo ===3 &&(
        <Box sx={{marginTop:'50px',width:'88%'}} className='walletcon3'>
        { paymentway === 'upi' && <>
        <Typography sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>Add your UPI to receive payouts</Typography>
        <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#676767',lineHeight:'24px',marginTop:'15px'}} className='walletcont7'>
        A payout is the transfer of funds from Grull to your bank account.
        </Typography>
        <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'5px',}} className='walletcon5'>
        <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
           <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Account Holder Name</Typography>
           <input
                value={upidetails.holdername}
                onChange={(e) => handleUpidetails('holdername', e)}
                placeholder='Astle Benjamin'
                style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px'}}
            />
        </Box>
        <Typography sx={{marginTop:'5px',fontSize: '16px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',color:'#676767',}} className='walletcont7'>
           The bank account holder name should match your legal name.
            Your account application may be rejected if you fail to provide a
            bank account matching this criteria.</Typography>
        <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
           <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>UPI ID</Typography>
           <input
                value={upidetails.upiid}
                onChange={(e) => handleUpidetails('upiid', e)}
                placeholder='Enter UPI ID'
                style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px'}}
            />
        </Box>
        </Box>
        <Box sx={{display:'flex',flexDirection:'column'}}>
        <Button onClick={()=>{setActiveStep(activeStep+1);setActiveSteptwo(activeSteptwo+1)}} className='walletbut2'
        sx={{margin:'50px auto',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Continue</Button>
        </Box>
    </>    }
    
{paymentway === 'card' && <>
        <Typography sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
            Add your Debit card to receive payouts</Typography>
        <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#676767',lineHeight:'24px',marginTop:'15px'}} className='walletcont7'>
        A payout is the transfer of funds from Grull to your bank account.
        </Typography>
        <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'5px',}} className='walletcon5'>
        <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
           <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Account Holder Name</Typography>
           <input
                value={carddetails.holdername}
                onChange={(e) => handleCarddetails('holdername', e)}
                placeholder='Astle Benjamin'
                style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px'}}
            />
        </Box>
        <Typography sx={{marginTop:'5px',fontSize: '16px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',color:'#676767',}} className='walletcont7'>
           The bank account holder name should match your legal name.
            Your account application may be rejected if you fail to provide a
            bank account matching this criteria.</Typography>
        <Box sx={{display:'flex',flexDirection:'column'}}>
            <Box sx={{display:'flex',flexDirection:'row',gap:'30px'}} className='walletcon6' >
                <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px',width:'60%'}} className='walletcon4'>
                    <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Card Number</Typography>
                    <input
                             value={carddetails.cardNumber}
                             onChange={(e) => handleCarddetails('cardNumber', e)}
                            placeholder='XXXX XXXX XXXX XXXX'
                            style={{color:'#00000080',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'14px',fontWeight:'300'}}
                        />
                </Box>
                <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px',width:'40%'}} className='walletcon4'>
                    <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Expiry Date</Typography>
                    <Box sx={{display:'flex',flexDirection:'row',gap:'15px'}} className='cardinput' >
                    <input 
                            value={carddetails.expiryMonth}
                            onChange={(e) => handleCarddetails('expiryMonth', e)}
                            placeholder='MM'
                            maxLength={2}
                            minLength={2}
                            style={{color:'#00000080',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'6px',padding:'20px 30px',border:'none',fontSize:'14px',fontWeight:'300',width:'90px'}}
                        />
                        <input 
                            value={carddetails.expiryYear}
                            onChange={(e) => handleCarddetails('expiryYear', e)}
                            placeholder='YYYY'
                            maxLength={4}
                            minLength={4}
                            style={{color:'#00000080',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'6px',padding:'20px 30px',border:'none',fontSize:'14px',fontWeight:'300',width:'99px'}}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{display:'flex',flexDirection:'row',gap:'30px'}} className='walletcon6'>
                <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px',width:'60%'}} className='walletcon4'>
                    <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Card Holder Name</Typography>
                    <input
                            value={carddetails.cardHolderName}
                            onChange={(e) => handleCarddetails('cardHolderName', e)}
                            placeholder='eg. Astle Benjamin'
                            style={{color:'#00000080',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'14px',fontWeight:'300'}}
                        />
                </Box>
                <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4 cardinput'>
                    <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>CVV</Typography>
                    <input  
                            value={carddetails.cvv}
                            onChange={(e) => handleCarddetails('cvv', e)}
                            placeholder='XXX'
                            maxLength={3}
                            minLength={3}
                            style={{color:'#00000080',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'6px',padding:'20px 30px',border:'none',fontSize:'14px',fontWeight:'300',width:'100px'}}
                        />
                </Box>
            </Box>
            </Box>
        </Box>
        <Box sx={{display:'flex',flexDirection:'column'}}>
        <Button onClick={()=>{setActiveStep(activeStep+1);setActiveSteptwo(1)}} className='walletbut2'
        sx={{margin:'50px auto',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Continue</Button>
        </Box>
</>} 
{paymentway === 'bank' && <>
                      <Typography sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                        Add your bank to receive payouts</Typography>
                        <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#474747',lineHeight:'24px',marginTop:'16px'}} className='walletcont7'>
                        A payout is the transfer of funds from Grull to your bank account.
                        </Typography>
                        <Box sx={{display:'flex',flexDirection:'column',gap:'20px',marginTop:'25px'}}>
                            <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'15px',}} className='walletcon4'>
                            <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Account Holder Name</Typography>
                            <input
                                  value={bankdetails.holdername}
                                  onChange={(e) => handleBankdetails('holdername', e)}
                                  placeholder='Astle Benjamin'
                                  style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px'}}
                              />
                            
                            </Box>
                            <Typography sx={{marginTop:'5px',fontSize: '16px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',color:'#676767',}} className='walletcont7'>
                            The bank account holder name should match your legal name.
                              Your account application may be rejected if you fail to provide a
                              bank account matching this criteria.</Typography>
                            <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>IFSC Code</Typography>
                                <input
                                        value={bankdetails.ifsc}
                                        onChange={(e) => handleBankdetails('ifsc', e)}
                                        placeholder='HDFC0000261'
                                        style={{color:'#090909',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                            <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Account number</Typography>
                                <input
                                        value={bankdetails.accno}
                                        onChange={(e) => handleBankdetails('accno', e)}
                                        placeholder='000123456789'
                                        style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                            <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}}>Confirm account number</Typography>
                                <input
                                        value={bankdetails.confaccno}
                                        onChange={(e) => handleBankdetails('confaccno', e)}
                                        placeholder='000123456789'
                                        style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                        </Box>
                         
                        <Box sx={{display:'flex',flexDirection:'column'}}>
                            <Button onClick={()=>{setActiveStep(activeStep+1)}} className='walletbut2'
                            sx={{margin:'50px auto 10px',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Continue</Button>
                        </Box>
                      </>}
                      </Box>   
                  )
                }
                {
                activeStep === 3 &&(
                    <Box sx={{marginTop:'50px',width:'88%'}} className='walletcon3'>
                        <Typography sx={{fontSize: '32px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                        Review and finish up</Typography>
                        <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',color:'#474747',lineHeight:'24px',marginTop:'16px'}} className='walletcont7'>
                        You're almost ready to get started with Grull. Take a moment to review and confirm your information.
                        </Typography>
                        <Box sx={{marginTop:'50px',display:'flex',flexDirection:'column',gap:'20px'}}>
                            <Typography sx={{fontSize: '24px',fontWeight: '600',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                            PERSONAL DETAILS</Typography>
                            <Box sx={{borderRadius:'16px', boxShadow: '0px 0px 4px 0.5px #00000040', backgroundColor:'#B27EE31A', padding:'25px', display:'flex', flexDirection:'row', justifyContent: 'space-between',gap:'15px'}}>
                              <Box sx={{display:'flex',flexDirection:'column',gap:'20px'}}>
                                <Box sx={{display:'flex',flexDirection:'column',gap:'5px'}}>
                                   <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',}} className='walletcont1'>
                                   {bankdetails.firstname} {bankdetails.lastname}
                                   </Typography>
                                   <Typography sx={{color:'#00000080',fontSize: '16px',fontWeight: '400',letterSpacing: '-0.005em',lineHeight:'20px',}} className='walletcont7'>
                                   <TfiReload style={{marginRight:'5px'}}/> Pending Verification
                                   </Typography>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'column',gap:'5px'}}>
                                <Typography sx={{color:'#676767',fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',}} className='walletcont1'>
                                {bankdetails.email}
                                   </Typography>
                                   <Typography sx={{color:'#676767',fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'20px',}} className='walletcont1'>
                                     Born on {bankdetails.dob}
                                   </Typography>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'column',gap:'5px'}}>
                                <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',}} className='walletcont1'>
                                    Other Documents:
                                   </Typography>
                                   <Typography sx={{color:'#676767',fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'20px',}} className='walletcont1'>
                                    {bankdetails.documenttype} Provided
                                   </Typography>
                                </Box>
                              </Box>
                              <Box sx={{textAlign:'right'}}>
                                <Box sx={{border:'1px solid #000',padding:'6px 10px',borderRadius:'50%',cursor:'pointer'}}>
                                   <FiEdit3 style={{color:'#4c4c4c',fontSize:'18px'}} />
                                </Box>
                              </Box>
                            </Box>
                        </Box>
                        <Box sx={{marginTop:'50px',display:'flex',flexDirection:'column',gap:'20px'}}className='walletcon5' >
                            <Typography sx={{fontSize: '24px',fontWeight: '600',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                            BANK DETAILS</Typography>
                            <Box sx={{borderRadius:'16px', boxShadow: '0px 0px 4px 0.5px #00000040', backgroundColor:'#B27EE31A', padding:'25px', display:'flex', flexDirection:'row', justifyContent: 'space-between',gap:'15px'}}>
                               <Box sx={{display:'flex', flexDirection:'row',gap:'20px'}}>
                                <Box sx={{padding:'10px',borderRadius:'8px',border:' 0.2px solid #000000',backgroundColor:'#F6F2F2'}}><BsBank style={{fontSize:'24px'}}/>
                                </Box>
                                <Box sx={{display:'flex',flexDirection:'column',gap:'5px'}}>
                                 <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',}} className='walletcont1'>
                                    HDFC Bank
                                   </Typography>
                                   <Typography sx={{color:'#676767',fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'20px',}} className='walletcont5'>
                                   {bankdetails.accno}
                                   </Typography>
                                </Box>
                                </Box>
                                <Box sx={{textAlign:'right'}}>
                                  <Box sx={{border:'1px solid #000',padding:'6px 10px',borderRadius:'50%',cursor:'pointer'}}>
                                    <FiEdit3 style={{color:'#4c4c4c',fontSize:'18px'}} />
                                  </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{marginTop:'50px',display:'flex',flexDirection:'column',gap:'20px'}} className='walletcon5'>
                            <Typography sx={{fontSize: '24px',fontWeight: '600',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletcont6'>
                            USER SETTINGS</Typography>
                            <Box sx={{borderRadius:'16px', boxShadow: '0px 0px 4px 0.5px #00000040', backgroundColor:'#B27EE31A', padding:'25px', display:'flex', flexDirection:'row', justifyContent: 'space-between',gap:'15px'}}>
                                <Box sx={{display:'flex',flexDirection:'column',gap:'5px'}}>
                                 <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',}} className='walletcont1'>
                                    Email
                                   </Typography>
                                   <Typography sx={{color:'#676767',fontSize: '18px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'20px',}} className='walletcont5'>
                                   astlebenjamin7@gmail.com
                                   </Typography>
                                </Box>
                                <Box sx={{textAlign:'right'}}>
                                  <Box sx={{border:'1px solid #000',padding:'6px 10px',borderRadius:'50%',cursor:'pointer'}}>
                                    <FiEdit3 style={{color:'#4c4c4c',fontSize:'18px'}} />
                                  </Box>
                                </Box>
                            </Box>
                            <Box sx={{borderRadius:'16px', boxShadow: '0px 0px 4px 0.5px #00000040', backgroundColor:'#B27EE31A', padding:'25px', display:'flex', flexDirection:'row', justifyContent: 'space-between',gap:'15px'}}>
                                <Box sx={{display:'flex',flexDirection:'column',gap:'5px'}}>
                                 <Typography sx={{fontSize: '20px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'24px',}} className='walletcont1'>
                                    Mobile
                                   </Typography>
                                   <Typography sx={{color:'#676767',fontSize: '18px',fontWeight: '500',letterSpacing: '-0.005em',lineHeight:'20px',}} className='walletcont5'>
                                   +91 7349314026
                                   </Typography>
                                </Box>
                                <Box sx={{textAlign:'right'}}>
                                  <Box sx={{border:'1px solid #000',padding:'6px 10px',borderRadius:'50%',cursor:'pointer'}}>
                                    <FiEdit3 style={{color:'#4c4c4c',fontSize:'18px'}} />
                                  </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'column'}}>
                            <Button onClick={()=>{setActiveStep(1);setSetupmethod(0);setActiveSteptwo(1)}} className='walletbut2'
                            sx={{margin:'50px auto 10px',backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',width:'270px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>Continue</Button>
                        </Box>
                    </Box>
                )
            }
       </Box>
}
</>
  )
}