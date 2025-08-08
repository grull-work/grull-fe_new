import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { HiDotsVertical } from 'react-icons/hi';
import { Button } from '@mui/material';
import Slider from '@mui/material/Slider';
import { FaHeart } from "react-icons/fa";
import '../styles/freelancermanagejobs.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

const Job = ({ passed_from,position, companyName, companyLogoUrl, location, startDate, isLast, status,status_saved, job_id, total_deliverables, completed_deliverables}) => {
  const container = useRef();

  const handleView=(job_id)=>{
    navigate(`/jobdetails/${job_id}`)
}
  const [showopts,setShowopts]=useState(false);

  const navigate=useNavigate();
  const clickApplyNow=()=>{
    navigate(`/applyproposal/${job_id}`);
  }
  const appliedDate = new Date(startDate);
  const dayOfWeek = appliedDate.toLocaleDateString('en-US', { weekday: 'short' });

  const handleClickOutside = (e) => {
    if (container.current && !container.current.contains(e.target)) {
        setShowopts(false);
    }
};

useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
// onClick={()=>handleView(job_id)}
  return (
    <React.Fragment>
      <Box sx={{ backgroundColor:passed_from ===1?'#B27EE31A':'#fff', padding: '30px', borderRadius: '16px', display: 'flex', flexDirection: 'row', }} className='job' >
        <Box sx={{ display: 'flex' }}>
        <Avatar
          //  className='resdash'
           alt={companyName[0]}
           style={{ backgroundColor: 'grey', cursor: 'pointer' }}
                 >
                    {companyName?.split(' ').slice(0, 2).map(part => part[0]).join('')}
          </Avatar>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2px', justifyContent: 'space-between', paddingLeft: '22px', flex: 1 }} className='job-container'>
          <Box sx={{display:'flex',flexDirection:passed_from===1?'column':'row',justifyContent:'space-between',gap:'20px',marginRight:passed_from===1?'0px':'50px',flex:1,flexWrap:'wrap'}} className='job-description'>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography sx={{ color: "#000", fontSize: '22px' }} className='job-con1'>{position}</Typography>
                  <Typography sx={{ color: "#656565", fontSize: '18px' }} className='job-con2'>{companyName}</Typography>
                  <Typography sx={{ color: "#656565", fontSize: '18px' }} className='job-con2'>{location}</Typography>
                  {
                    (status==="PENDING" || status==="REJECTED") && (
                      <Typography sx={{ color: "#656565", fontSize: '15px' }} className='job-con3'>Applied on {dayOfWeek}</Typography>)
                  }
                  {
                    (status==="SAVED" || status==="HIRED") && (
                      <Typography sx={{ color: "#656565", fontSize: '15px' }} className='job-con3'>Saved on {dayOfWeek}</Typography>)
                  }
                </Box>
                {status === 'ONGOING' ? (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Slider 
      value={completed_deliverables}
      max={total_deliverables}
      min={0}
      valueLabelFormat={(value) => `${value}/${total_deliverables}`}
      // track={(index) => index <= completed_deliverables ? '#47D487' : '#D7D7D7'}
      marks={Array.from({ length: total_deliverables }, (_, i) => ({
        value: i + 1,
        label: <MilestonePoint completed={i < completed_deliverables} i={i+1} />,
      }))}
      step={1 / total_deliverables}
      className={`${passed_from === 1 ? '' : 'ongoingjobslider'}`}
      sx={{ color: '#ED8335', height: '8px', width:passed_from===1?'100%':'300px',minWidth:'0', marginLeft: '10px', '& .MuiSlider-thumb': { width: '20px', height: '20px',display:completed_deliverables!==0?'block':'block' },'& .MuiSlider-rail': {
        height: '8px',
        backgroundColor: '#B4B4B4',
      }, }}
    />
  </Box>
) : status === 'SAVED' ? (
  status_saved === "SAVED" ? (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button onClick={clickApplyNow} className='job-action' sx={{ backgroundColor: '#B27EE3', color: '#fff', textAlign: 'center', borderRadius: '16px', padding: '8px 0px', width: '120px', textTransform: 'none', ':hover': { backgroundColor: '#B27EE3', color: '#fff' } }} >Apply Now</Button>
    </Box>
  ) : (
    status_saved === "APPLIED" ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography sx={{ backgroundColor:'#47D48733', color:'#47D487', textAlign: 'center', borderRadius: '16px', padding: '8px 0px', width: '120px' }} className='job-action'>Applied</Typography>
  </Box> : <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography sx={{color:'#000', textAlign: 'center', }} className='job-action'>Job Closed or Expired</Typography>
  </Box> // You can render something else if needed
  )
) : status === 'COMPLETED' ? (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography sx={{ backgroundColor:'#2E81FF', color:'#FFF', textAlign: 'center', borderRadius: '16px', padding: '8px 0px', width: '120px' }} className='job-action'>{status}</Typography>
  </Box>
) : (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography sx={{ backgroundColor: status === 'Selected' ? '#47D48733' : '#D7D7D7', color: status === 'Selected' ? '#47D487' : '#000', textAlign: 'center', borderRadius: '16px', padding: '8px 0px', width: '140px' }} className='job-action'>{status === 'PENDING' ? 'IN PROGRESS' : status}</Typography>
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
                      <Link component={NavLink} to={`/jobdetails/${job_id}`} style={{ backgroundColor:'#fff', textDecoration: 'none', color: 'black', fontWeight:'500', padding:'2px 0', marginTop:'5px', ':hover':{ backgroundColor:'transparent' }, minHeight:'0' }}>View Job Details</Link>
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

export default Job;
