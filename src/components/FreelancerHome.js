import React,{useEffect, useState} from 'react'
import Typography from '@mui/material/Typography';
import { Box, Button, Grid } from '@mui/material';
import { Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HiDotsVertical } from "react-icons/hi";
import Slider from '@mui/material/Slider';
import '../styles/freelancerhome.css';
import BAPI from '../helper/variable';
import axios from 'axios';
import Job from './Job';

import Modal from '@mui/material/Modal';
import { IoLocationOutline } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { toast } from 'react-hot-toast';

export default function FreelancerHome() {
    
    const navigate=useNavigate();
    const [availability, setAvailability] = useState('available');
    const handleChange = (event) => {
        setAvailability(event.target.value);
    };
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      const clickCompleteProfile=()=>{
        navigate('/freelancerprofile');
      }

      const clickDiscoverJobs=()=>{
        navigate('/browsejobs');
      }
    const [firstname,setFirstname]=useState('');
    const [walletbalance,setwalletbalance]=useState('')
    const accessToken = localStorage.getItem('accessToken');

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [paymentway,setpaymentway]=useState('');
    const [modalPage, setModalPage] = useState(0);
    const [country, setCountry] = useState('india'); 
    const [setuppaymethod,setSetupmethod]=useState(0);
    const previousAccounts = [
    { id: 1, type: 'Bank Account', details: 'XXXX1234 (HDFC)' },
    { id: 2, type: 'UPI', details: 'user@upi' },
  ];

    const [upidetails,setupidetails]=useState({name:'',email:'',upiid:''})
  const [bankdetails,setbankdetails]=useState({name:'',email:'',holdername:'',ifsc:'',accno:'',confaccno:''})

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

    const handlepaymentmethod =(method)=>{
    setpaymentway(method)
    }
      const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  const handleBack = () => {
    if (modalPage === 0) {
      handleClose();
    } else {
      setModalPage(modalPage - 1);
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
        // handleClose();
        setModalPage(2);
      }
    }
  };

  const handleBankdetails = (name, event) => {
    setbankdetails((prevBankdetails) => ({
      ...prevBankdetails,
      [name]: event.target.value,
    }));
  }

    const handleUpidetails = (name, event) => {
    setupidetails((prevUpidetails) => ({
      ...prevUpidetails,
      [name]: event.target.value,
    }));
  };

    useEffect(() => {
      const infofetch = async () => {
          try {
              const response = await fetch(
                  `${BAPI}/api/v0/users/me`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`,
                    },
                  }
                );
              const responseData = await response.json();
              setFirstname(responseData?.first_name);
              setwalletbalance(responseData?.wallet_balance);
          } catch (error) {
              console.error("Error fetching user information:", error);
          }
      }
      infofetch();
  }, []);

  const [applications, setApplications] = useState([]);
  const [jobData, setJobs] = useState([]);

  useEffect(() => {
    const getApplications = async (page = 1) => {
      try {
        const response = await axios.get(`${BAPI}/api/v0/users/me/job-applications`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          params: {
            page: page,
            per_page: 8,
          },
        });

        if (response.status === 200) {
        const acceptedApplications = response.data.results.filter(application =>
            application.status === "ACCEPTED"
        );
        const completedApplications = response.data.results.filter(application =>
            application.status === "COMPLETED"
        );

        const latestAccepted = acceptedApplications.slice(0, 2);
        const latestCompleted = completedApplications.slice(0, 2);

        const latestApplications = [...latestAccepted, ...latestCompleted];
        setApplications(latestApplications);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    getApplications();
  }, [accessToken]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const jobDetails = await getJobDetails(applications);
      setJobs(jobDetails);
    };
    fetchJobDetails();
  }, [applications]);

  const getJobDetails = async (applications) => {
    try {
      const jobDetailsPromises = applications.map(async (application) => {
        const response = await axios.get(`${BAPI}/api/v0/jobs/${application.job_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        response.data['applied_on']=application.modified_at;
        return response.data;
      });

      return Promise.all(jobDetailsPromises);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <Box sx={{padding:'90px 90px 70px'}} className='home-container'>
       <Box>
         <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Welcome, {firstname}</Typography>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px'}} className='home-container-grid'>
            <Box sx={{ backgroundColor: '#B27EE31A', padding: '25px 30px',borderRadius:'16px',display:'flex',flexDirection:'column',gap:'7px' }}>
                <Typography sx={{color:"#000",fontSize:'22px'}} className='home-subheading'>Build profile</Typography>
                <Typography sx={{color:"#656565",fontSize:'20px'}} className='home-content'>Get access to more features</Typography>
                <Button sx={{width:'fit-content',boxShadow:' 0px 0px 4px 0px #00000040',backgroundColor:'#fff',borderRadius:'16px',padding:'8px 20px',color:'#000',textTransform:'none',marginTop:'10px'}} onClick={clickCompleteProfile}>Complete Profile</Button>
            </Box>
            <Box sx={{ backgroundColor: '#B27EE31A', padding: '25px 30px',borderRadius:'16px',display:'flex',flexDirection:'column',gap:'7px' }}>
                <Typography sx={{color:"#000",fontSize:'22px'}} className='home-subheading'>Find your next job</Typography>
                <Typography sx={{color:"#656565",fontSize:'20px'}} className='home-content'>Explore exclusive opportunities.</Typography>
                <Button sx={{width:'fit-content',boxShadow:' 0px 0px 4px 0px #00000040',backgroundColor:'#fff',borderRadius:'16px',padding:'8px 20px',color:'#000',textTransform:'none',marginTop:'10px'}} onClick={clickDiscoverJobs}>Discover Jobs</Button>
            </Box>
         </Grid>
       </Box>

       <Box sx={{marginTop:windowWidth>=600?'35px':'25px'}}>
         <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Availability</Typography>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px', }} className='home-container-grid'>
            <Box sx={{ backgroundColor: '#B27EE31A', padding: '25px 30px',borderRadius:'16px' }}>
              <FormControl component="fieldset">
                <RadioGroup
                    aria-label="availability"
                    name="availability"
                    value={availability}
                    onChange={handleChange}
                    column
                >
                    <FormControlLabel value="available" control={<Radio style={{ color: availability ==='available' ?'#47D487':'#000' }}/>} label="Available" />
                    <FormControlLabel value="unavailable" control={<Radio style={{ color: availability ==='unavailable' ?'#47D487':'#000'  }}/>} label="Unavaible" />
                </RadioGroup>
              </FormControl>
            </Box>
         </Grid>
       </Box>

       <Box sx={{marginTop:windowWidth>=600?'40px':'25px'}}>
         <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Wallet</Typography>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px', }} className='home-container-grid'>
            <Box sx={{ backgroundColor: '#B27EE31A', padding: '25px 30px',borderRadius:'16px',display:'flex',flexDirection:'column',gap:'7px',alignItems:'center' }}>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                   <Typography sx={{color:"#000",fontSize:'25px',fontWeight:'800',}} className='home-subheading'>₹{walletbalance}</Typography>
                   <Link style={{color:'#B27EE3',marginLeft:'10px'}}>Hide Balance</Link>
                </Box>
                <Typography sx={{color:"#656565",fontSize:'20px'}} className='home-subheading'>Current Balance</Typography>
                <Button onClick={handleOpen} sx={{width:'fit-content',boxShadow:' 0px 0px 4px 0px #00000040',backgroundColor:'#B27EE3',borderRadius:'16px',padding:'10px 30px',color:'#fff',textTransform:'none',marginTop:'10px',':hover':{backgroundColor:'#B27EE3'}}}>Withdraw Balance</Button>
            </Box>
         </Grid>
       </Box>
       <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
            <Box sx={style} className='modalcon1'>
             {modalPage === 0 && (
          <>
            <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'24px',}}>
              Your saved payout methods
            </Typography>
            <Box sx={{display:'flex',flexDirection:'row',gap:'30px',padding:'40px 50px'}} className='modalcon2'>
              {previousAccounts.map(acc => {
                const icon = <BsBank size={26} />;
                return (
                  <Box
                    key={acc.id}
                    onClick={() => {/* maybe select existing */}}
                    sx={{
                      flex: 1,
                      borderRadius: '16px',
                      boxShadow: '0px 0px 4px rgba(0,0,0,0.25)',
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      // border: paymentWay === acc.id ? '2px solid #000' : 'none',
                    }}
                  >
                    {icon}
                    <Typography sx={{ fontSize: 20, fontWeight: 500 }}>{acc.type}</Typography>
                    <Typography sx={{ fontSize: 16, color: '#676767' }}>{acc.details}</Typography>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
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
                {
                  modalPage===2 && <>
                   <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px',}}>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} >Your Legal Name</Typography>
                                <input
                                        value={bankdetails.name}
                                        onChange={(e) => handleBankdetails('name', e)}
                                        placeholder='Name'
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
                            {paymentway === 'bank' && (<>
                               <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px'}} className='walletcon4'>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletlabel1'>Account No</Typography>
                                <input
                                        value={bankdetails.accno}
                                        onChange={(e) => handleBankdetails('accno', e)}
                                        placeholder='123456789'
                                        type='text'
                                        style={{color:'#090909',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                                    <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} className='walletlabel1'>IFSC Code</Typography>
                                    <input
                                        value={bankdetails.ifsc}
                                        onChange={(e) => handleBankdetails('ifsc', e)}
                                        placeholder='IFSC Code'
                                        type='text'
                                        style={{color:'#090909',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                            </>
                            )}
                            {paymentway === 'upi' && (
                              <>
                              <Box sx={{marginTop:'30px',display:'flex',flexDirection:'column',gap:'18px',}}>
                                <Typography sx={{fontSize: '24px',fontWeight: '700',letterSpacing: '-0.005em',lineHeight:'28px',}} >Upi Id</Typography>
                                <input
                                        value={upidetails.upiid}
                                        onChange={(e) => handleUpidetails('upiid', e)}
                                        placeholder='Upi Id'
                                        style={{color:'#676767',boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'20px 30px',border:'none',fontSize:'20px',fontWeight:'300'}}
                                    />
                            </Box>
                              </>
                            )}
                  </>
                }
                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'right',gap:'12px',marginTop:'20px'}} className='modalbuts'>
                    <Button onClick={handleBack} className='modalbut'
                    sx={{backgroundColor:'#E3E3E3',color:'#000',textAlign:'center',fontSize:'20px',borderRadius:'16px',padding:'8px',width:'120px',textTransform:'none',':hover':{backgroundColor:'#E3E3E3',color:'#000'}}}>Back</Button>
                    <Button onClick={()=>handleContinue()} className='modalbut'
                    sx={{backgroundColor:'#B27EE3',color:'#fff',textAlign:'center',fontSize:'20px',borderRadius:'16px',padding:'8px',width:'120px',textTransform:'none',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}}>{modalPage===0?"Add new":"Continue"}</Button>
                </Box>
            </Box>
        </Modal>
       <Box sx={{marginTop:windowWidth>=600?'80px':'50px'}}>
         <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Ongoing Jobs</Typography>
                <Link style={{color:'#ED8335',marginLeft:'10px'}} to='/managejobs/ongoing'>View All</Link>
         </Box>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px',width:'100%' }} className='home-container-grid'>
            {jobData.filter(job => job.status === 'ONGOING').length > 0 ? (
                  jobData
                  .filter((job) => ['ONGOING'].includes(job.status))
                  .map((job, index) => (
                    <Job
                      passed_from={1}
                      key={index}
                      position={job.title}
                      companyName={job.company_name}
                      companyLogoUrl={job.companyLogoUrl}
                      location={job.location}
                      startDate={job.applied_on}
                      isLast={index === jobData.length - 1}
                      status={job.status}
                      job_id={job.id}
                      total_deliverables={job.total_deliverables}
                      completed_deliverables={job.completed_deliverable}
                    />
                  ))
                  ) : (
                      <p >No Ongoing Jobs yet</p>
                  )}
         </Grid>
       </Box>

       <Box sx={{marginTop:windowWidth>=600?'80px':'50px'}}>
         <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Completed Jobs</Typography>
                <Link style={{color:'#ED8335',marginLeft:'10px'}} to='/managejobs/completed'>View All</Link>
         </Box>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px', }} className='home-container-grid'>
         {jobData.filter(job => job.status === 'COMPLETED').length > 0 ? (
                  jobData
                  .filter((job) => ['COMPLETED'].includes(job.status))
                  .map((job, index) => (
                    <Job
                      passed_from={1}
                      key={index}
                      position={job.title}
                      companyName={job.company_name}
                      companyLogoUrl={job.companyLogoUrl}
                      location={job.location}
                      startDate={job.applied_on}
                      isLast={index === jobData.length - 1}
                      status={job.status}
                      job_id={job.id}
                      total_deliverables={job.total_deliverables}
                      completed_deliverables={job.completed_deliverable}
                    />
                  ))
                  ) : (
                      <p >No Completed Jobs yet</p>
                  )}
         </Grid>
       </Box>
    </Box>
  )
}
