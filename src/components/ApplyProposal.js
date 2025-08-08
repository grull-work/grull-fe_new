import React, { useRef, useState} from 'react';
import '../styles/Applyproposal.css';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Header3 from './Header3';
import { Button } from '@mui/material';
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

    const updateTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

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
                <Form className='proposal-form'>
                <h2 >Proposal</h2>
                <Form.Group className='form-group' controlId="form">
                    <h4>Why are you fit for this job?</h4>
                    <Form.Control as="textarea"
                        rows="6"
                        ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                        onChange={(e) => updateTextareaHeight(e.target)}
                        className='form-val proposaldesc' 
                        type="text" name='proposal' placeholder="Enter answer here" />
                </Form.Group>
                {/* <div>
                    <h4>Any files to support your proposal</h4>
                    <div>
                        <Button onClick={handleArrowClick} endIcon={<FaArrowUp />}
                         sx={{display: 'flex', alignItems: 'center',
                           justifyContent: 'space-between',width:'100%', boxShadow: '0px 0px 4px 0px #00000040',padding: '15px 22px',borderRadius:'16px',color:'#000000B2'}}>Upload Your File Here</Button>
                        <input
                            type="file"
                            id="fileInput"
                            ref={fileInputRef}
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>
                </div> */}

                <div>
                    <h4 >What is your Proposed rate?</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className='bud-form'>
                        <Form.Group className="form-group" controlId="formBudget">
                            <Form.Control className='form-val-5' type="text" name='proposed_rate' placeholder="Price" />
                        </Form.Group>

                        <Form.Group className="form-group" controlId="formCurrency">
                            <Select
                                options={CurrencyOptions} placeholder="Select"
                                className='form-val-4'
                                styles={{ control: (provided) => ({ ...provided,border:'none',outline:'none'}) }}
                            />
                        </Form.Group>
                    </div>
                </div>
                </Form>
                
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