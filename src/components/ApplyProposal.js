import React, { useRef, useState} from 'react';
import '../styles/Applyproposal.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header3 from './Header3';
import { Button, TextField, MenuItem, Box, Typography } from '@mui/material';
import { FaArrowUp } from "react-icons/fa6";
import BAPI from '../helper/variable'
const ApplyProposal = () => {
    const accessToken = localStorage.getItem('accessToken');
    const { jobid } = useParams();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const CurrencyOptions = [
        { value: 'INDIA', label: 'INR' },
        { value: 'USA', label: 'USD' },
        { value: 'CANADA', label: 'CAD' },
        { value: 'ENGLAND', label: 'GBP' },
        { value: 'CHINA', label: 'CNY' },
        { value: 'RUSSIA', label: 'RUB' },
    ];

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // console.log('Selected File:', file);
        setSelectedFile(file);
    };

    const handleArrowClick = () => {
        fileInputRef.current.click();
    };

    const handleReviewProfile = async (e) => {
        e.preventDefault();
        try {
          const jobDetailsResponse = await axios.get(`${BAPI}/api/v0/jobs/${jobid}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
      
          if (jobDetailsResponse.status === 200) {
            const jobDetails = jobDetailsResponse.data;
            const url = `https://grull.work/client/profile/${jobDetails?.posted_by?.id}`;
            window.open(url, "_blank");
          }
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      };

    const handleViewJobRequirements = (e) => {
        e.preventDefault();
        const blankLink = document.createElement('a');
        blankLink.href = `/jobdetails/${jobid}`;
        blankLink.target = '_blank';
        blankLink.click();
        // navigate(`/jobdetails/${jobid}`); 
    }



    const handleCancelClick = () => {
        navigate('/browsejobs');
    }

    const handleSaveClick = async() => {
        try{
            const proposal = document.querySelector('[name="proposal"]').value;
            const proposed_rate = document.querySelector('[name="proposed_rate"]').value;
            const response = await axios.post(`${BAPI}/api/v0/jobs/${jobid}/apply`, 
                 {"proposed_rate":proposed_rate,"proposal":proposal},{
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`,
                  },
              });
              if (response.status===200) {
                //   console.log('Applied Proposal successfully');
                  navigate('/managejobs/applied');
              }
          }
          catch (error) {
            console.error('Error occurred:', error);
        }
    }

    return (
        <div>
            {/* section - 1 */}
            <Header3 />

            {/* section 2 for making the input form */}
            <div className='input-form'>
                <Box className='proposal-form' sx={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <Typography variant="h4" sx={{fontWeight:'700'}}>Proposal</Typography>
                <Box className='form-group' >
                    <Typography variant="h6" sx={{marginBottom:'10px'}}>Why are you fit for this job?</Typography>
                    <TextField
                        multiline
                        minRows={6}
                        fullWidth
                        className='form-val proposaldesc' 
                        name='proposal' 
                        placeholder="Enter answer here"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: '#F9F9F9',
                                '& fieldset': { border: 'none' },
                            },
                        }}
                    />
                </Box>

                <div>
                    <Typography variant="h6" sx={{marginBottom:'10px'}}>What is your Proposed rate?</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className='bud-form'>
                        <Box sx={{flex:1}}>
                            <TextField 
                                fullWidth
                                className='form-val-5' 
                                name='proposed_rate' 
                                placeholder="Price" 
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                        backgroundColor: '#F9F9F9',
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{width:'150px'}}>
                            <TextField
                                select
                                defaultValue={CurrencyOptions[0].value}
                                fullWidth
                                className='form-val-4'
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                        backgroundColor: '#F9F9F9',
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            >
                                {CurrencyOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </div>
                </div>
                </Box>
                
                <div style={{marginTop:'10px',marginBottom:'5px'}}>
                    <div>
                        <a href="" style={{ color: '#b27ee3',fontSize:'17px' }} onClick={(e)=>handleReviewProfile(e)}>Review Profile</a>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <a href="" style={{ color: '#b27ee3',fontSize:'17px' }} onClick={handleViewJobRequirements}>View Job Requirements</a>
                    </div>
               </div>

                <div className='butcont-applyjob'>
                    <button className='cancel-button' onClick={handleCancelClick}>Cancel</button>
                    <button className='save-button' onClick={handleSaveClick}>Save</button>
                </div>

            </div>

        </div >
    )
};

export default ApplyProposal;