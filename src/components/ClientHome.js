import React,{useEffect, useState} from 'react'
import Typography from '@mui/material/Typography';
import { Box, Button, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import BAPI from '../helper/variable';
import '../styles/freelancerhome.css';
import axios from 'axios'
import ClientJob from './ClientJob';

export default function ClientHome() {

    const accessToken = localStorage.getItem('accessToken');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [firstname,setFirstname]=useState('');
    const [walletbalance,setwalletbalance]=useState('');
    const [availability, setAvailability] = useState('available');
    const [jobData,setJobdata]=useState([]);
    const navigate=useNavigate();
    
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
      
    const clickpostjobs =()=>{
      navigate('/postjob')
    }

    // to get user details
    useEffect(() => {
      const infofetch = async () => {
        try {
          const response = await fetch(`${BAPI}/api/v0/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const responseData = await response.json();
          setFirstname(responseData?.first_name);
          setwalletbalance(responseData?.wallet_balance);
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
    
      infofetch();
    }, []);
    
    // to get jobs details that are ongoing and completed
    useEffect(() => {
      const getJobs = async () => {
        try {
          const response = await axios.get(`${BAPI}/api/v0/users/me/jobs`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            params: {
              status: "ONGOING,COMPLETED"
            },
          });
    
          if (response.status === 200) {
            const allJobs = response.data.results;
            const ongoingJobs = allJobs.filter(job => job.status === "ONGOING").slice(0, 2);
            const completedJobs = allJobs.filter(job => job.status === "COMPLETED").slice(0, 2);
            const limitedJobs = [...ongoingJobs, ...completedJobs]; 
            console.log(limitedJobs);
            setJobdata(limitedJobs);
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
      };
    
      getJobs();
    }, []);
    

  return (
    <Box sx={{padding:'90px 90px 70px'}} className='home-container'>

     {/* section 1 */}
       <Box>
         <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Welcome, {firstname}</Typography>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px'}} className='home-container-grid'>
            <Box sx={{ backgroundColor: '#B27EE31A', padding: '25px 30px',borderRadius:'16px',display:'flex',flexDirection:'column',gap:'7px' }}>
                <Typography sx={{color:"#000",fontSize:'22px'}} className='home-subheading'>Post your next job</Typography>
                <Typography sx={{color:"#656565",fontSize:'20px'}} className='home-content'>Explore exclusive freelancers.</Typography>
                <Button sx={{width:'fit-content',boxShadow:' 0px 0px 4px 0px #00000040',backgroundColor:'#fff',borderRadius:'16px',padding:'8px 20px',color:'#000',textTransform:'none',marginTop:'10px'}} onClick={clickpostjobs}>Post Jobs</Button>
            </Box>
         </Grid>
       </Box>

       {/* section 2 */}
       <Box sx={{marginTop:windowWidth>=600?'40px':'25px'}}>
         <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Wallet</Typography>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px', }} className='home-container-grid'>
            <Box sx={{ backgroundColor: '#B27EE31A', padding: '25px 30px',borderRadius:'16px',display:'flex',flexDirection:'column',gap:'7px',alignItems:'center' }}>
                <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                   <Typography sx={{color:"#000",fontSize:'25px',fontWeight:'800',}} className='home-subheading'>₹{walletbalance}</Typography>
                   <Link style={{color:'#B27EE3',marginLeft:'10px'}}>Hide Balance</Link>
                </Box>
                <Typography sx={{color:"#656565",fontSize:'20px'}} className='home-subheading'>Current Balance</Typography>
                <Button sx={{width:'fit-content',boxShadow:' 0px 0px 4px 0px #00000040',backgroundColor:'#B27EE3',borderRadius:'16px',padding:'10px 30px',color:'#fff',textTransform:'none',marginTop:'10px',':hover':{backgroundColor:'#B27EE3'}}} onClick={()=>navigate("/addbalance")} >Add Balance</Button>
            </Box>
         </Grid>
       </Box>

       {/* section 3 - ongoing jobs  */}
       <Box sx={{ marginTop: windowWidth >= 600 ? '80px' : '50px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-1px' }} className='home-heading'>
              Ongoing Jobs
            </Typography>
            <Link style={{ color: '#ED8335', marginLeft: '10px' }} to='/clientmanagejobs/ongoing'>
              View All
            </Link>
          </Box>

          <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px' }} className='home-container-grid'>
            {jobData.filter(job => job.status === 'ONGOING').length === 0 ? (
              <p >No Ongoing Jobs yet</p>
            ) : (
              jobData.filter(job => job.status === 'ONGOING').map((job, index) => (
                <ClientJob
                  passed_from={1}
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  companyLogoUrl={job.companyLogoUrl}
                  companyName={job.company_name}
                  postedDate={job.created_at}
                  isLast={index === jobData.filter(job => job.status === 'ONGOING').length - 1}
                  applicantcount={job.applicants}
                  status={job.status}
                  total_deliverables={job.total_deliverables}
                  completed_deliverables={job.completed_deliverable}
                />
              ))
            )}
          </Grid>
        </Box>

        {/* section 4 - completed jobs  */}
       <Box sx={{marginTop:windowWidth>=600?'80px':'50px'}}>
         <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Typography sx={{fontSize:'32px',fontWeight:'600',letterSpacing:'-1px'}} className='home-heading'>Completed Jobs</Typography>
                <Link style={{color:'#ED8335',marginLeft:'10px'}} to='/clientmanagejobs/completed'>View All</Link>
         </Box>
         <Grid sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '10px', }} className='home-container-grid'>
              No Completed Jobs yet.
         </Grid>
       </Box>
    </Box>
  )
}
