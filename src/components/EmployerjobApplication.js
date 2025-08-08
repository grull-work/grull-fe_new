import React, { useLayoutEffect, useRef } from "react";
import { useNavigate,useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/jobapplications.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import Header2 from "./Header2";
import { LiaFilterSolid } from "react-icons/lia";
import BAPI from '../helper/variable'
const JobApplications = () => {

  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFreelancers,setSearchFreelancers]=useState('');
  const sortByOptions = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Cheapest', label: 'Cheapest' },
  ]
  const [sort, setSort] = useState(sortByOptions[0]);
  const [category,setcategory]=useState('freelancers');

  const [expandedDesc, setExpandedDesc] = useState({});
  const toggleFreeDescription = (freeId) => {
    setExpandedDesc((prev) => ({
          ...prev,
          [freeId]: !prev[freeId]
      }));
  };
  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };
  
  //fetch all freelancers
  const [allFreelancers, setAllFreelancers] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  const { jobid } = useParams();

  useEffect(() => {
    const getFreelancers = async () => {
      try {
        const response = await axios.get(`${BAPI}/api/v0/jobs/${jobid}/applications?`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
         console.log("applications", response.data.results)
        if (response.status === 200) {
          // console.log('Freelancers Fetched successfully');

          // Set all freelancers
          setAllFreelancers(response.data.results);
          // createrefs(response.data.results)
        } else {
          console.error('Error fetching freelancers:', response.data.error);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    getFreelancers();
  }, [accessToken]);

  const handleReject=async(applicationId)=>{
    try{
      const response = await axios.post(`${BAPI}/api/v0/applications/${applicationId}/reject`, {
        
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
       console.log(response)
       setAllFreelancers(prevFreelancers => prevFreelancers.filter(freelancer => freelancer.id !== applicationId));
    }
    catch (error) {
      console.error('Error occurred while rejecting :', error);
    }
}
const handleAccept = async (applicationId) => {
  console.log(applicationId);
  try {
    const response = await axios.post(`${BAPI}/api/v0/applications/${applicationId}/accept`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    console.log(response);
    await rejectAllRemainingFreelancers(applicationId);
    navigate("/clientchat");
  } catch (error) {
    console.error('Error occurred while accepting:', error);
  }
};

const rejectAllRemainingFreelancers = async (acceptedFreelancerId) => {
  try {
    for (const freelancer of allFreelancers) {
      if (freelancer.id !== acceptedFreelancerId && freelancer.status!=='REJECTED') {
        await handleReject(freelancer.id);
      }
    }
  } catch (error) {
    console.error('Error occurred while rejecting all remaining freelancers:', error);
  }
}

const handleSearch=()=>{
  setSearchFreelancers(searchQuery)
}


const filteredFreelancers = allFreelancers
.filter((freelancer) => {
  if (searchFreelancers && !(freelancer.employee.full_name.toLowerCase().includes(searchFreelancers.toLowerCase()) || freelancer.employee.description.toLowerCase().includes(searchFreelancers.toLowerCase()))) {
    return false;
  }
  return true;
})
.sort((a, b) => {
  if (sort.value === 'Newest') {
    return new Date(b.created_at) - new Date(a.created_at);
  }
  if (sort.value === 'Cheapest') {
    const rateA = a.proposed_rate;
    const rateB = b.proposed_rate;
    return rateA - rateB; 
  }
  return 0;
});

  return (
    <div>
      <Header2 />
      {/* div 2 for box and browse, search bar */}
      {/* <div className='rectangle'></div> */}
      <div className='search-bar'>
      <h1 style={{ color: 'white'}}>Browse</h1>
      <div style={{display:'flex',flexDirection:'column'}}>
        <Box sx={{display:'flex',flexDirection:{md:'row',xs:'column'},gap:{md:'20px',xs:'7px'},width:'100%'}}>
        <div style={{ position: 'relative',flex:1 }}>
          <input
          value={searchQuery}
          onChange={(e)=>setSearchQuery(e.target.value)}
            type="text"
            placeholder=" Search for Freelancers"
            style={{
              borderRadius: '16px',
              border: 'none',
              width:'100%',
              padding:'10px 45px',
              fontSize:'16px',
              color:'#00000080'
            }}
          />
          <FontAwesomeIcon icon={faSearch} style={{
            color: '#957474',position:'absolute',
            left:'16px',top:'12px'
          }} />
          </div>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <Button onClick={handleSearch}  style={{
                  backgroundColor: '#B27EE3', color: 'white', border: 'none', borderRadius: '16px',
                  fontSize: '16px',padding:'7px 22px'
              }}>Search</Button>
        {/* <Button style={{
              border: 'none', backgroundColor: 'transparent', color: 'white',
              cursor: 'pointer', fontSize: '16px',outline:'none',float:'right'
            }} sx={{display:{md:'none',xs:'block'}}}>   Show Advanced Options</Button> */}
              </div>
              </Box>
              {/* <Box sx={{display:{md:'block',xs:'none'}}}>
            <Button style={{
              border: 'none', backgroundColor: 'transparent', color: 'white',
              cursor: 'pointer', fontSize: '16px',outline:'none',float:'right'
            }}>   Show Advanced Options</Button>
          </Box> */}
        </div>

        <div >
            <Button sx={{color:category==='freelancers'?'#fff':'#FFFFFFB2',borderBottom:category==='freelancers'?'1px solid #fff':'1px solid transparent',outline:'none',background:'transparent',borderRadius:'0',fontSize:'16px'}} onClick={()=>setcategory('freelancers')}>Freelancers</Button >
            {/* <Button sx={{color:category==='projects'?'#fff':'#FFFFFFB2',borderBottom:category==='projects'?'1px solid #fff':'1px solid transparent',outline:'none',background:'transparent',borderRadius:'0',marginLeft:'20px',fontSize:'16px'}} onClick={()=>setcategory('projects')}>Projects</Button > */}
        </div>
      </div>
      <div className="sortingjobs" style={{marginBottom:'30px',cursor:'pointer'}}>
      <Button endIcon={<LiaFilterSolid />} sx={{boxShadow: '0px 0px 4px 0px #00000040',color:'#000',padding:'7px 20px',borderRadius:'16px',visibility:'hidden'}}>Filters</Button>
       <Form>
          <Form.Group className="form-group" controlId="formSortByOptions">
            <span style={{ marginRight: '5px' }}>Sort by:</span>
            <Select
              placeholder=""
              options={sortByOptions}
              value={sort}
              onChange={(selectedOption) => {
                  setSort(selectedOption); 
                  
              }}
              styles={{
                  control: (provided) => ({
                      ...provided,
                      border: 'none',
                      outline: 'none',
                      borderRadius: '16px',
                  }),
              }}
          />
          </Form.Group>
        </Form>
      </div>


      {/* div 3  */}
      <div style={{ marginBottom: '50px', marginTop: '30px',}} className='browseFreelancer'>

        <div className='browseFreelancer-box'>
        {((allFreelancers.length === 0) || 
    (allFreelancers?.filter((application) => ['PENDING'].includes(application.status)).length === 0)) ? (
    <>
      <Typography sx={{ fontSize: '18px', padding: '20px', textAlign: 'center' }}>No applications found.</Typography>
    </>
  ) : (
    filteredFreelancers?.filter((application) => ['PENDING'].includes(application.status)).map((freelancer, indx) => (
      <Box key={indx}>
        <Box sx={{ padding: { sm: '30px', xs: '18px 16px' } }}>
          <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Box style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            {(freelancer.employee.photo_url && freelancer.employee.photo_url!=='') ? (
                                        <img
                                            className='user-picture-img'
                                            alt={freelancer.employee.first_name[0]}
                                            src={freelancer.employee.photo_url}
                                            style={{ borderRadius:'16px',objectFit: 'cover' }}
                                        />
                                    ) : (
                                      <Avatar variant="square" sx={{ textTransform: 'uppercase', width: { sm: '200px', xs: '120px' }, height: { sm: '200px', xs: '120px' }, borderRadius: '16px' }}>
                                         {(freelancer.employee.first_name + " " + freelancer.employee.last_name)?.split(' ').slice(0, 2).map(part => part[0]).join('')}
                                   </Avatar>
                                      
                                    )}
              <Box style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', height: 'auto' }} key={indx * indx}>
                <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: '700', fontSize: { sm: '28px', xs: '22px' } }}>{freelancer.employee.full_name}</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: { sm: '17px', xs: '15px' } }}>{freelancer.employee.role}</Typography>
                    <Typography sx={{ fontWeight: '600', fontSize: { sm: '17px', xs: '15px' } }}>${freelancer.employee.rate_per_hour}/hr</Typography>
                  </Box>
                  {/* <Box style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <img
                      src={require('../assets/dislikeIcon.png')}
                      alt="Dislike"
                      style={{ cursor: 'pointer', height: '50px', width: '50px', borderRadius: '50%' }}
                      onClick={() => handleDislikeClick(freelancer.freelancer_id)}
                    />
                    <img
                      src={require('../assets/likeIcon.png')}
                      alt="Like"
                      style={{ cursor: 'pointer', height: '50px', width: '50px', borderRadius: '50%' }}
                      onClick={() => handleLikeClick(freelancer.freelancer_id)}
                    />
                  </Box> */}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: '500', fontSize: { sm: '17px', xs: '15px' }, color: '#454545' }}>

                  {expandedDesc[freelancer.id] ? freelancer.proposal : truncateText(freelancer.proposal, 40)}
                                    {!expandedDesc[freelancer.id] && freelancer.proposal.split(' ').length > 40 && (
                                        <Button onClick={() => toggleFreeDescription(freelancer.id)} sx={{ padding: 0, textTransform: 'none', color: '#B27EE3', fontSize: '14px' }}>Read More</Button>
                                    )}
                                    {expandedDesc[freelancer.id] && (
                                        <Button onClick={() => toggleFreeDescription(freelancer.id)} sx={{ padding: 0, textTransform: 'none', color: '#B27EE3', fontSize: '14px' }}>Read Less</Button>
                                    )}
                  {/* Your description rendering logic */}
                  
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ margin: { sm: '13px 0 5px 0', xs: '10px 0 3px 0' } }}>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>


              {
                freelancer.employee.skills.map((skill, index) => <li key={index} style={{ fontSize: '16px', padding: "10px 25px", backgroundColor: '#E9E9E9', color: '#000000', borderRadius: '16px', width: 'fit-content', fontWeight: '500' }}>{skill}</li>)
              }

            </ul>
          </Box>
          <Box sx={{ marginTop: '15px', display: 'flex', gap: '12px' }}>
            <Button sx={{ color: 'white', backgroundColor: '#B27EE3', borderRadius: '16px', padding: '6px 40px', fontSize: '16px', ':hover': { color: 'white', backgroundColor: '#B27EE3' } }} onClick={() => handleAccept(freelancer.id)}>Accept</Button>
            <Button sx={{ color: '#B27EE3', backgroundColor: 'white', borderRadius: '16px', padding: '6px 40px', fontSize: '16px', boxShadow: '0px 0px 4px 0.5px #00000040', ':hover': { color: '#B27EE3', backgroundColor: 'white' } }} onClick={() => handleReject(freelancer.id)} >Reject</Button>
          </Box>
        </Box>
      </Box>
      {indx !== allFreelancers.length - 1 && <Divider />}
    </Box>
  ))
)}

        </div>
      </div>

    </div>
  )
}
export default JobApplications;