import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { HiDotsVertical } from 'react-icons/hi';
import { Button } from '@mui/material';
import Slider from '@mui/material/Slider';
import { FaHeart } from "react-icons/fa";
import '../styles/freelancermanagejobs.css';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import BAPI from '../helper/variable'
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const MilestonePoint = ({ completed, i }) => {
  return (
    <div
    style={{
        width: '17px',
        height: '17px',
        borderRadius: '50%',
        marginTop:'-22px',
        backgroundColor: '#D9D9D9',
        textAlign:'center',
        color:'#fff',
    }}
  ></div>
  );
};
const ClientJob = ({ passed_from,id, title, companyLogoUrl, companyName, postedDate, isLast, applicantcount, status,total_deliverables,completed_deliverables}) => {
  const container = useRef();
  const [showopts,setShowopts]=useState(false);
  const handleClickOutside = (e) => {
    if (container.current && !container.current.contains(e.target)) {
        setShowopts(false);
    }
};

useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const accessToken = localStorage.getItem('accessToken');
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
      };
   const Clickwithdraw=async(job_id)=>{
    console.log(job_id)
    try{
        const response = await axios.delete(`${BAPI}/api/v0/jobs/${job_id}`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
              },
          });
          console.log(response);
          if (response.status===200) {
              console.log('Jobs Withdrawn successfully');
          }
      }
      catch (error) {
        console.error('Error occurred:', error);
    }
   }
   const navigate=useNavigate()
   const handleView=(job_id)=>{
    navigate(`/clientchat`)
}
  console.log(companyLogoUrl)
  return (
    <React.Fragment>
      <Box sx={{ backgroundColor:passed_from ===1?'#B27EE31A':'#fff', padding: '30px', borderRadius: '16px', display: 'flex', flexDirection: 'row' }} className='job' >
        <Box sx={{ display: 'flex' }}>
        <Avatar
          //  className='resdash'
           alt={companyName[0]}
           style={{ backgroundColor: 'grey', cursor: 'pointer',borderRadius:passed_from!==1?'':'5px' }}
                 >
                    {companyName?.split(' ').slice(0, 2).map(part => part[0]).join('')}
          </Avatar>
          {/* <img className='jobcomplogo'
            style={{ width: '50px', height: '50px' }}
            alt={companyName}
            src={companyLogoUrl}
          /> */}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2px', justifyContent: 'space-between', paddingLeft: '22px', flex: 1 }} className='job-container'>
          <Box sx={{display:'flex',flexDirection:passed_from===1?'column':'row',justifyContent:'space-between',gap:'20px',marginRight:passed_from===1?'0px':'50px',flex:1,flexWrap:'wrap'}} className='job-description'>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography sx={{ color: "#000", fontSize: '22px' }} className='job-con1'>{title}</Typography>
                  <Typography sx={{ color: "#656565", fontSize: '15px' }} className='job-con3'>Posted On {formatDate(postedDate)}</Typography>
                  <Link style={{ display: status !== 'PENDING' ? 'none' : 'inline', color: '#2F66EC' }} to={`/jobapplications/${id}`}>View {applicantcount} Applicants</Link>

                </Box>
                {status === 'ONGOING' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Slider 
                      value={completed_deliverables}
                      max={total_deliverables}
                      min={0}
                      valueLabelFormat={(value) => {
                        // Show label as deliverable number
                        return `${value}/${total_deliverables}`;
                    }}
                    track={(index) => {
                        // Color completed deliverables green and pending ones gray
                        return index <= completed_deliverables ? '#47D487' : '#D7D7D7';
                    }}
                      marks={Array.from({ length: total_deliverables }, (_, i) => ({
                          value: i + 1,
                          label: <MilestonePoint completed={i < completed_deliverables} i={i+1} />,
                      }))}
                      step={1 / total_deliverables}
                      className={`${passed_from === 1 ? '' : 'ongoingjobslider'}`}
                      sx={{ color: '#ED8335', height: '8px', width:passed_from===1?'100%':'300px',minWidth:'0', marginLeft: '10px', '& .MuiSlider-thumb': { width: '20px', height: '20px',display:completed_deliverables!==0?'block':'block' },'& .MuiSlider-rail': {
                        height: '8px',
                        backgroundColor: '#B4B4B4',
                      }, }} /></Box>
                  ) : status === 'PENDING' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button className='job-action' sx={{ backgroundColor: '#B27EE3', color: '#fff', textAlign: 'center', borderRadius: '16px', padding: '8px 0px', width: '120px', textTransform: 'none', ':hover': { backgroundColor: '#B27EE3', color: '#fff' } }} onClick={()=>{Clickwithdraw(id)}}>Withdraw</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ backgroundColor:  '#2E81FF' , color: '#FFF', textAlign: 'center', borderRadius: '16px', padding: '8px 0px', width: '120px' }} className='job-action'>{status}</Typography>
                    </Box>
                  )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center',gap:'30px' }} className='job-opts'>
                <FaHeart style={{fontSize:'20px',display:status==='Saved'?'block':'none'}} />
                <Box sx={{display:{position:'relative'}}} ref={container}>
                <HiDotsVertical style={{ fontSize: '22px',cursor:'pointer' }} className='job-dots' onClick={()=>{setShowopts(!showopts)}} />
                {
                  showopts && (<Box
                    sx={{
                          padding:'15px 20px 15px 20px',
                          display: showopts?'block':'none',
                          position:'absolute',
                          backgroundColor:'#fff',
                          zIndex:'1',
                          top:{xs:'58px',sm:'40px'},
                          right:{xs:'-55px',sm:'-80px',md:'-25px'},
                          boxShadow: '0px 0px 4px 1px #00000040',
                          borderRadius:{xs:'10px',sm:'10px'},
                          width:{xs:'250px',sm:'170px'},
                          display:'flex',
                          flexDirection:'column',
                          gap:'15px'
                        }}
                    >
                      <Link component={NavLink} to={`/jobdetails/${id}`} style={{ backgroundColor:'#fff', textDecoration: 'none', color: 'black', fontWeight:'500', padding:'2px 0', marginTop:'5px', ':hover':{ backgroundColor:'transparent' }, minHeight:'0' }}>View Job Details</Link>
                    </Box>
                  )
                }
                </Box>
          </Box>
        </Box>
      </Box>
      {!isLast && !passed_from && <Divider />}
    </React.Fragment>
  );
};

export default ClientJob;
