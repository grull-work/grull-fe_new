import React from "react";
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header3 from "./Header3";
import { SlCalender } from "react-icons/sl";
import { LuClock4 } from "react-icons/lu";
import BAPI from '../helper/variable';
import { GoHeart } from "react-icons/go";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineSettingsSuggest } from "react-icons/md"
import { Box, Button, Divider, Typography } from "@mui/material";
import { CiLocationOn } from "react-icons/ci";
import ClientDashboard from "./ClientDashboard";

const JobDetails = () => {
    const accessToken = localStorage.getItem('accessToken');
    const useR=localStorage.getItem('user');
    const userId=JSON.parse(useR)?.id
    const { jobid } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [clientDetails,setClientDetails]=useState(null);
    const [clientReviews,setClientReviews]=useState({
        average:null,
        total:null
    });
    const navigate = useNavigate();

    function convertTimestampToNormalTime(timestamp) {
        const date = new Date(timestamp);
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const formattedDate = `${month} ${day}, ${year}`;
        return formattedDate;
    }

    const getTimeDifference = (modifiedAt) => {
        const now = new Date();
        const modifiedDate = new Date(modifiedAt);
        const differenceInMilliseconds = now - modifiedDate;
    
        const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
    
        if (years > 0) {
          return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        } else if (months > 0) {
          return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else if (weeks > 0) {
          return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (days > 0) {
          return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else if (hours > 0) {
          return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else {
          return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        }
      };

      const getDuration = (duration) => {
        const durations = Math.floor(duration/30);
        if (durations > 1){
            return `${durations} ${durations === 1 ? 'month' : 'months'}`
        }
        else {
            if(duration<7){
                return "< 1 Week"
            }
          return `${duration} days`;
        }
      };

      
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`${BAPI}/api/v0/jobs/${jobid}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
    
                if (response.status === 200) {
                    // console.log("job details : ",response.data)
                    setJobDetails(response.data);
                } else {
                    console.error('Error fetching job details:', response.data.error);
                }
            } catch (error) {
                console.error('Error occurred:', error);
            }
        };
    
        fetchJobDetails();
    }, [jobid, accessToken]);

    useEffect(()=>{
        const fetchClientDetails=async()=>{
          try {
              const response = await axios.get(`${BAPI}/api/v0/users/public/${jobDetails?.posted_by.id}`, {
                  headers: {
                      'Authorization': `Bearer ${accessToken}`,
                  },
              });
  
              if (response.status === 200) {
                //   console.log("client details : ",response.data)
                  setClientDetails(response.data);
                  fetchClientReviews(response.data.id);
              } else {
                  console.error('Error fetching job details:', response.data.error);
              }
          } catch (error) {
              console.error('Error occurred:', error);
          }
        }
  
        if(jobDetails){
          fetchClientDetails();
        }
      },[jobDetails])

    const fetchClientReviews=async(Id)=>{
        try {
            const response = await axios.get(`${BAPI}/api/v0/reviews/${Id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                let stars=0;
                for (let i=0; i<response.data.length;i++){
                    stars+=response.data[i].stars;
                }
                if(stars!==0){
                    const averageStars = stars / response.data.length;
                    setClientReviews({
                        average: averageStars,
                        total: response.data.length
                    });
                }
                // console.log("client reviews : ",response.data)
            } else {
                console.error('Error fetching job details:', response.data.error);
            }
        } catch (error) {
            console.error('Error occurred while getting reviews:', error);
        }
    }

    const handleSaveJob=async()=>{
        const job={
            "job_id": jobid,
            "title": jobDetails.title,
            "company_name": jobDetails.company_name,
            "location": jobDetails.location
        }
        try{
            const response = await axios.post(`${BAPI}/api/v0/jobs/save-job`,job, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.status === 200) {
                // console.log(response.data)
                navigate("/managejobs/saved")
            }
        }
        catch(err){
            console.log("Error while saving the job : ",err)
        }
    }

    const handleApplyNow = () => {
        navigate(`/applyproposal/${jobid}`);
    }

    return (
        <div>

            {/* section- 1 */}
           <Header3 />
            {/* section -2 containing left and right boxes  */}
           <Box sx={{display:'flex',flexDirection:{xs:'column',lg:'row'},marginTop:'40px',marginBottom:'60px',padding:{md:'10px 70px',xs:'10px 30px'},gap:'40px'}}>
             {/* left box  */}
            <Box sx={{ display: 'flex',flex:'1',boxShadow: '0px 0px 4px 0px #00000040', borderRadius: '16px',flexDirection:'column',height:'fit-content',padding:{sm:'0px 40px 30px',xs:'0px 25px 30px'}}}>
                <Box sx={{padding:'25px 0'}}>
                    <Typography sx={{fontWeight:'700',fontSize:'28px'}}>{jobDetails?.title}</Typography >
                    <Box sx={{ display: 'flex',flexDirection:{sm:'row',xs:'column'},justifyContent:'space-between',marginTop:'10px',gap:{xs:'5px',sm:'0'}}}>
                        <Box sx={{ display: 'flex',flexDirection:'row',gap:'20px'}}>
                            <Typography sx={{fontWeight:'500',fontSize:'16px',color:'#454545'}}>Posted {getTimeDifference(jobDetails?.created_at)}</Typography>
                            <Typography sx={{ fontWeight:'500',fontSize:'16px',color:'#454545'}}><CiLocationOn /> {jobDetails?.location}</Typography>
                        </Box>
                        {/* <a href="" style={{ fontWeight:'500',fontSize:'16px', color: '#ED8335' }}>Download reference files</a> */}
                    </Box>
                </Box>
                <Divider />
                <Box sx={{padding:'25px 0 35px'}}>
                    <Typography sx={{fontWeight:'500',fontSize:'16px',color:'#454545'}}>{jobDetails?.description}</Typography>
                    <Box>
                            <Typography  sx={{fontWeight:'700',fontSize:'18px',color:'#00000',marginTop:'30px'}}>About Company:</Typography>
                            <Typography sx={{ fontWeight: '500', fontSize: '16px', color: '#454545', marginTop: '8px' }}>
                            {jobDetails?.company_description ? jobDetails.company_description : "N/A"}
                            </Typography>
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex',flexDirection:'row',flexWrap:'wrap',padding:'25px 0 45px',gap:'20px' }}>
                        {/* <Box sx={{width: {sm:'150px',xs:'125px'}, height: '115px', backgroundColor: '#2E66EC', borderRadius: '21px', display: 'flex',gap:'5px', border:'1px solid #000000',padding:'15px 15px 2px',flexDirection:'column',boxShadow:'-3px -2px' }}>
                            <LuClock4 style={{color:'#fff',fontSize:'24px',marginLeft:'5px'}} />
                            <Typography sx={{color:'#fff',fontWeight:'600',fontSize:{sm:'19px',xs:'16px'}}}>30+ Hours a week</Typography>
                        </Box> */}

                        <Box sx={{width: {sm:'150px',xs:'125px'}, height: '115px', backgroundColor: '#2E66EC', borderRadius: '21px', display: 'flex',gap:'5px',border:'1px solid #000000',padding:'15px 15px 2px',flexDirection:'column',boxShadow:'-3px -2px'  }}>
                            <SlCalender style={{color:'#fff',fontSize:'24px',marginLeft:'5px'}} />
                            <Typography sx={{color:'#fff',fontWeight:'600',fontSize:{sm:'19px',xs:'16px'}}}>{getDuration(jobDetails?.duration)}</Typography>
                        </Box>

                        {/* <Box sx={{width: {sm:'150px',xs:'125px'}, height: '115px', backgroundColor: '#2E66EC', borderRadius: '21px', display: 'flex',gap:'5px',border:'1px solid #000000',padding:'15px 15px 2px',flexDirection:'column',boxShadow:'-3px -2px'  }}>
                            <MdOutlineSettingsSuggest style={{color:'#fff',fontSize:'24px',marginLeft:'5px'}} />
                            <Typography sx={{color:'#fff',fontWeight:'600',fontSize:{sm:'19px',xs:'16px'}}}>Intermediate</Typography>
                        </Box> */}

                        <Box sx={{width: {sm:'150px',xs:'125px'}, height: '115px', backgroundColor: '#2E66EC', borderRadius: '21px', display: 'flex',gap:'5px',border:'1px solid #000000',padding:'15px 15px 2px',flexDirection:'column',boxShadow:'-3px -2px'  }}>
                            <GiReceiveMoney style={{color:'#fff',fontSize:'24px',marginLeft:'5px'}} />
                            <Typography sx={{color:'#fff',fontWeight:'600',fontSize:{sm:'19px',xs:'16px'}}}>{jobDetails?.rate_per_hour} {jobDetails?.currency_type}</Typography>
                        </Box>
                </Box>
                <Divider />
                <Box sx={{padding:'20px 0'}}>
                    <Typography sx={{fontWeight:'500',fontSize:'22px'}}>Skills and Expertise</Typography >
                    <Box style={{ display: 'flex',flexDirection:'row',flexWrap:'wrap',gap:'10px',marginTop:'20px' }}>
                        {jobDetails?.required_skills.map((skill, index) => (
                            <Box key={index} style={{
                                color: 'white',
                                backgroundColor: '#ED8335',
                                borderRadius: '16px',
                                padding:'10px 40px'
                            }}>
                                {skill}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
             
             {/* right box  */}
            <Box sx={{width:{lg:'300px',xs:'auto'}, borderRadius: '16px',display: 'flex', flexDirection: 'column',boxShadow:'0px 0px 4px 0px #00000040',height:'fit-content'}}>
                <Box sx={{display:'flex',flexDirection:'column',gap:'8px',alignItems:'center',padding:'30px 0 20px'}}>
                    <Typography style={{ color: '#B27EE3', fontSize: '13px',}}>Non Negotiable</Typography>
                    {
                       jobDetails?.posted_by.id!==userId?( jobDetails?.employee===null?
                    //    when no employee is there
                       (<Button style={{ backgroundColor: '#B27EE3', color: 'white',borderRadius: '16px',padding:'8px',width:'160px'}} onClick={handleApplyNow}>Apply Now</Button>) :(
                       jobDetails?.employee?.id!==userId?(
                    //    when some employee else is selected
                       <Typography style={{ color: '#000',fontWeight:'600'}}>Job Closed or Expired</Typography>):
                       (
                        // when he is the selected
                        <Button style={{ backgroundColor: '#B27EE3', color: 'white',borderRadius: '16px',padding:'8px',width:'160px'}} onClick={()=>{navigate('/freelancerchat')}}>Chat Now</Button>
                         ) ) ):<Button style={{ backgroundColor: '#B27EE3', color: 'white',borderRadius: '16px',padding:'8px',width:'160px'}} onClick={() => { navigate(`/jobapplications/${jobid}`) }}>View Applicants</Button>
                    }

                    {
                        jobDetails?.posted_by.id!==userId? (jobDetails?.employee===null?(
                            <Button style={{backgroundColor: 'white',border: '1px solid #B27EE3', color: '#B27EE3', borderRadius: '16px',padding:'8px',width:'160px'}} startIcon={<GoHeart />} onClick={()=>handleSaveJob()} >Save Job</Button>):''):''
                    }
                    <Typography style={{ color: '#454545', fontSize: '16px',}}>Applicants : {jobDetails?.job_applicants_count }</Typography>
                </Box>
                    
                <hr style={{color:'#000000',height:'1px'}} />

                <Box sx={{padding:'15px 10px 15px 20px'}}>
                    <Typography style={{ color: '#000', fontSize: '26px',fontWeight:'700'}}>About the Client</Typography>
                    <Typography style={{ color: '#454545', fontSize: '16px', fontWeight: '500' }}>
                        {clientDetails?.location ? (<><CiLocationOn /> {clientDetails.location.country}</>) :
                         (
                            'Location : N/A'
                          )}
                        </Typography>
                    
                        <Typography style={{ color: '#454545', fontSize: '16px', fontWeight: '500', marginTop: '3px' }}>
                        {clientReviews.average && clientReviews.total ? (
                            `${clientReviews.average} stars from ${clientReviews.total} reviews`
                        ) : (
                            'No reviews available'
                        )}
                        </Typography>
                    <Typography style={{ color: '#000000', fontSize: '16px',fontWeight:'400',marginTop:'7px'}}>{clientDetails?.description}</Typography>
                </Box>

                <hr style={{color:'#000000',height:'1px'}} />

                <Box sx={{padding:'15px 10px 15px 20px'}}>
                    <Typography style={{ color: '#000000', fontSize: '20px',fontWeight:'500'}}>{clientDetails?.jobs_posted_count} jobs posted</Typography>
                    {/* <Typography style={{ color: '#454545', fontSize: '16px',fontWeight:'500'}}>79% hire rate, 1 open job</Typography> */}
                </Box>
                <hr style={{color:'#000000',height:'1px'}} />
                {/* <Box sx={{padding:'15px 10px 15px 20px'}}>
                    <Typography style={{ color: '#000000', fontSize: '20px',fontWeight:'500'}}>$21K total spent</Typography>
                    <Typography style={{ color: '#454545', fontSize: '16px',fontWeight:'500'}}>42 hires, 25 active</Typography>
                </Box>
                <hr style={{color:'#000000',height:'1px'}} /> */}
                <Box sx={{padding:'15px 10px 15px 20px'}}>
                    <Typography style={{ color: '#000000', fontSize: '20px',fontWeight:'500'}}>${clientDetails?.average_rate_offered} /hr avg hourly rate paid</Typography>
                    {/* <Typography style={{ color: '#454545', fontSize: '16px',fontWeight:'500'}}>1815 hours</Typography> */}
                </Box>
                <hr style={{color:'#000000',height:'1px'}} />
                <Box sx={{padding:'15px 10px 15px 20px'}}>
                    <Typography style={{ color: '#000000', fontSize: '20px', fontWeight: '500' }}>
                    {clientDetails?.company_name ? clientDetails.company_name : 'Company : N/A'}
                    </Typography>

                    <Typography style={{ color: '#454545', fontSize: '16px',fontWeight:'500'}}>{clientDetails?.company_description? clientDetails.company_description:'Description : N/A'}</Typography>
                </Box>
                <hr style={{color:'#000000',height:'1px'}} />
                <Box sx={{padding:'75px 10px 15px 20px'}}>
                     <Typography style={{ color: '#454545', fontSize: '16px',fontWeight:'500'}}>Member since {convertTimestampToNormalTime(clientDetails?.created_at)}</Typography>
                </Box>
            </Box>
        </Box>
    </div>
    )
}
export default JobDetails;