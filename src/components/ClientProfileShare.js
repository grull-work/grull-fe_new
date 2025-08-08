import React from 'react';
import '../styles/Freelancerprofile.css';
import '../styles/Employerprofile.css';
import { useNavigate,useParams} from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { Box, Button, Typography} from '@mui/material';
import { CiLocationOn } from "react-icons/ci";
import { MdWorkOutline } from "react-icons/md";
import Header2 from './Header2';
import BAPI from '../helper/variable'
import Navbar from './Navbar';
import Footer from "./Footer";
import { RiStarSFill } from "react-icons/ri";

const EmployerprofileShare = () => {
    const {userid}=useParams();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const avatarBackgroundColor = 'Grey'; 
   
    const container = useRef();
    const [showDropdown, setShowDropdown] = useState(false);
    const clickProfileImage = () => {
        // setShowDropdown(!showDropdown);
        setShowDropdown((prevState) => ({ open: !prevState.open }));
    }
    const handleClickOutside = (e) => {
        if (container.current && !container.current.contains(e.target)) {
            setShowDropdown({ open: false });
        }
    };
    // attaches an eventListener to listen when componentDidMount
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        // optionally returning a func in useEffect runs like componentWillUnmount to cleanup
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const [inputcompdesc,setInputCompDesc]=useState({
        "company_name":'',
        "company_description":""
    });
    const [newinputval,setnewinputval]= useState('');

    const updateTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      };

    const [rightBoxEditMode, setRightBoxEditMode] = useState(false);
    const [topBoxEditMode, setTopBoxEditMode] = useState(false);

    const [savedName, setSavedName] = useState('');
    const [savedJobCategory, setSavedJobCategory] = useState('');
    const [savedLocation, setSavedLocation] = useState('');

    const [jobsPostedCount, setJobsPostedCount] = useState('');
    const [avgRateOffered, setAvgRateOffered] = useState('');
    const [reviews,setReviews]=useState([]);

    const formatDate = (timestamp) => {
        console.log(timestamp)
        const date = new Date(timestamp);

        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    };

    useEffect(() => {
      const fetchUserReviews = async () => {
          try {
              const response = await axios.get(`${BAPI}/api/v0/reviews/${userid}`,
                  {
                      headers: {
                          'Content-Type': 'application/json',
                      },
                  });
                  setReviews(response.data.filter(item => !item.is_freelancer));
              
          } catch (error) {
              // Handle network error or other issues
              console.error('Network error:', error);
          }
      };
      fetchUserReviews()
  }, []);
    //giving initial values to the variables
    
    const [profileImage,setProfileImage]=useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            
            const response = await axios.get(`${BAPI}/api/v0/users/public/${userid}`);
    
            if (response.status === 200) {
              const { full_name, role, location,jobs_posted_count,average_rate_offered,description } = response.data;
              console.log(response.data)
              setProfileImage(response.data.photo_url && response.data.photo_url !== '' ? response.data.photo_url : null);
                    
              setSavedName(full_name);
              setSavedJobCategory(role);
              if(location){
              setSavedLocation(location?.country);}
              else{
                setSavedLocation('Location Here')
              }
              setJobsPostedCount(jobs_posted_count);
              setAvgRateOffered(average_rate_offered);
              setnewinputval(description);
              setInputCompDesc({
                "company_name":response.data.company_name,
                "company_description":response.data.company_description
              })
            } else {
              console.error('Error fetching user profile:', response.data.error);
            }
          } catch (error) {
            console.error('Network error:', error);
          }
        };
    
        fetchUserProfile();
      }, []);



    //view posted jobs
    const [postedJobs, setPostedJobs] = useState([]);
    const TimeDiff = (created_at) => {
        const createdat = new Date(created_at);
        const timeDifference = new Date() - createdat;
        const secondsDifference = Math.floor(timeDifference / 1000);
        const minutesDifference = Math.floor(secondsDifference / 60);
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);
        const weeksDifference = Math.floor(daysDifference / 7);
        const monthsDifference = Math.floor(daysDifference / 30);
        const yearsDifference = Math.floor(daysDifference / 365);
    
        if (yearsDifference > 0) {
            return yearsDifference === 1 ? "1 year ago" : `${yearsDifference} years ago`;
        } else if (monthsDifference > 0) {
            return monthsDifference === 1 ? "1 month ago" : `${monthsDifference} months ago`;
        } else if (weeksDifference > 0) {
            return weeksDifference === 1 ? "1 week ago" : `${weeksDifference} weeks ago`;
        } else if (daysDifference > 0) {
            return daysDifference === 1 ? "1 day ago" : `${daysDifference} days ago`;
        } else if (hoursDifference > 0) {
            return hoursDifference === 1 ? "1 hour ago" : `${hoursDifference} hours ago`;
        } else if (minutesDifference > 0) {
            return minutesDifference === 1 ? "1 minute ago" : `${minutesDifference} minutes ago`;
        } else {
            return "Just now";
        }
    };
    
    useEffect(() => {
        const fetchPostedJobs = async () => {
            try {
                const response = await axios.get(`${BAPI}/api/v0/jobs/public/posted-jobs/${userid}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    params: {
                      status:"ONGOING,PENDING,COMPLETED"
                    },
                });

                if (response.status === 200) {
                    setPostedJobs(response.data.results); 
                } else {
                    console.error('Error fetching posted jobs:', response.data.error);
                }
            } catch (error) {
                console.error('Error occurred:', error);
            }
        };

        fetchPostedJobs();
    }, []);

    return (
        <div style={{ overflowX: 'hidden' }}>
             <Navbar />
            {/* second div for profile bg */}
            <div className='profilepage'>
               <div className='firstcompprofile'>
                <div style={{ position: 'relative' }}>
                    <img src={require('../assets/profileBg.png')} alt="" className='profile-background-image'></img>

                     <div style={{
                        position: 'absolute',
                        top:'51%',
                        display:'flex',
                        flexDirection:'column',
                        width:'94%',
                        left:'3%',
                        gap:'100px'
                     }} className='profiletosec-2' >
                           <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} className='profilesec-1'>
                               <div style={{display:'flex',flexDirection:'row',gap:'30px',alignItems:'center'}} className='profilesec-4'>
                                    <div className='user-picture'>
                                    {(profileImage && profileImage!=='') ? (
                                        <img
                                            className='user-picture-img'
                                            alt={savedName.first_name}
                                            src={profileImage}
                                            style={{ borderRadius:'50%',objectFit: 'cover'  }}
                                        />
                                    ) : (
                                        <Avatar
                                            className='user-picture-img'
                                            alt={savedName.first_name}
                                            style={{ backgroundColor: avatarBackgroundColor }}
                                        >
                                            {(savedName.first_name + " " + savedName.last_name)?.split(' ').slice(0, 2).map(part => part[0]).join('')}
                                        </Avatar>
                                    )}
                                          
                                    </div>
                                <>
                                    {!topBoxEditMode && (
                                        <div>
                                            <p style={{ fontSize: '32px', fontWeight: '700' }} className='text-1'>{savedName}</p>
                                            <p style={{ fontSize: '18px',marginTop:'3px' }} className='text-2'><MdWorkOutline style={{marginRight:'5px'}}/>{savedJobCategory}</p>
                                            <p style={{ fontSize: '18px',marginTop:'3px' }} className='text-2'><CiLocationOn style={{marginRight:'5px'}}/>{savedLocation}</p>
                                        </div>
                                    )}
                                </>
                                </div>
                                <div style={{display:'flex',flexDirection:'row',gap:'30px',alignItems:'center'}}>
                                    {!topBoxEditMode && (
                                            <div style={{
                                                display: 'flex',gap:'10px',flexDirection:'row'
                                            }}>
                                                <div className='profiletopinfo' style={{
                                                padding: '5px', background: 'white',
                                                width: '150px', height: '70px', borderRadius: '15px', border: '1px solid black',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                    <span style={{ color: '#ED8336', fontSize: '20px' }}>{jobsPostedCount}</span>
                                                    <span>Jobs Posted</span>
                                                </div>
                                                <div className='profiletopinfo' style={{
                                                padding: '5px', background: 'white',
                                                width: '150px', height: '70px', borderRadius: '15px', border: '1px solid black',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                    <span style={{ color: '#ED8336', fontSize: '20px' }}>${avgRateOffered}</span>
                                                    <span>Avg. Budget</span>
                                                </div>
                                            </div>
                                        )}
                                       
                                </div>
                           </div>
                     </div>
            </div>
            </div>
            </div>
            {/* third div for about and posted jobs */}
            <div className='about-postJobs'>

                <div className='first-box'>

                    <div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-between' }}>
                        <h2 style={{fontSize:'28px',marginLeft:'20px' }} className='profilesec-subheading'>About</h2>
                       
                    </div>

                    <textarea
                            type="text"
                            placeholder="Write something about you....."
                            value={newinputval}
                            className={`first-box-one ${rightBoxEditMode ? 'editable' : ''}`}
                            readOnly={!rightBoxEditMode}
                            rows="3"
                            ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                        />
                        
                        <input 
                            type="text"
                            placeholder="Company Name"
                            name="company_name"
                            value={inputcompdesc.company_name}
                            readOnly={!rightBoxEditMode}
                            className={rightBoxEditMode ? 'first-box-three-editable' : 'first-box-three'}
                            />
                    
                    <textarea
                        type="text"
                        placeholder=""
                        name="company_description"
                        value={inputcompdesc.company_description}
                        className={`first-box-two ${rightBoxEditMode ? 'editable' : ''}`}
                        readOnly={!rightBoxEditMode}
                        rows="2"
                        ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop:'40px'}}>
                        <h2 style={{fontSize:'28px' }} className='profilesec-subheading'>Posted Jobs</h2>
                    </div>

                    { (
                        <div className='inside-posted-jobs'>
                            {postedJobs?.map((job) => (
                                <Box key={job.job_id} sx={{ borderRadius: '16px', border: 'none',  padding: '16px 20px',boxShadow: '0px 0px 4px 0px #00000040',display:'flex',flexDirection:'column',gap:{xs:'6px',sm:'10px'}  }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize:{ xs:'18px',sm:'24px'}, fontWeight: '700', flex: '70%', margin: '0' }}>{job.title}</Typography>
                                        <Typography sx={{ fontSize: '15px', color: '#B27EE3', flex: '30%', margin: '0',display:{xs:'none',md:'block'} }}>{job.job_applicants_count} FREELANCERS APPLIED</Typography>
                                    </div>

                                    <div style={{  display: 'flex', alignItems: 'center',marginTop:'2px' }}>
                                        <Typography sx={{ fontSize:{ xs:'15px',sm:'19px'} ,fontWeight:'500'}}>Budget: $ {job.rate_per_hour}</Typography>
                                        <Typography sx={{ fontSize: '14px', color: '#00000080', marginLeft: '20px' }}>Posted {TimeDiff(job.created_at)}</Typography>
                                    </div>
                                    <Typography sx={{ fontSize:{xs:'12px',sm:'15px'}, color: '#B27EE3', flex: '30%', margin: '2px 0 0 0',display:{xs:'block',md:'none'} }}>{job.job_applicants_count} FREELANCERS APPLIED</Typography>
                                    <div style={{ display: 'flex', alignItems: 'center',gap:'7px',marginTop:'5px',flexWrap:'wrap' }}>
                                        {/* <p> {job.required_skills.join(', ')}</p> */}
                                        {job.required_skills.map((skill, index) => (
                                            <Box key={index} sx={{ backgroundColor: '#ED8335', color: 'white', borderRadius: '16px', padding:{ xs:'8px 12px',sm:'10px 15px'},fontSize:{xs:'13px',sm:'16px'} }}>
                                                {skill}
                                            </Box>
                                        ))}
                                    </div>
                                    <Box sx={{ borderRadius: '12px',boxShadow: '0px 0px 4px 0px #00000040', border: 'none',display: 'flex', alignItems: 'center',width:'fit-content',padding:{ xs:'9px 11px',sm:'10px 20px'},marginTop:{xs:'5px',sm:'3px'}}}>
                                        {job.status === 'PENDING' && (
                                            <Box sx={{ width:{xs:'9px',sm:'7px'}, height: {xs:'9px',sm:'7px'}, borderRadius: '50%', backgroundColor: 'orange', marginRight:{xs:'11px',sm:'15px'}}}></Box>
                                        )}
                                        {job.status === 'COMPLETED' && (
                                            <Box sx={{ width:{xs:'9px',sm:'7px'}, height: {xs:'9px',sm:'7px'}, borderRadius: '50%', backgroundColor: '#DA000D',marginRight:{xs:'11px',sm:'15px'}}}></Box>
                                        )}
                                        {job.status === 'ACTIVE' && (
                                            <Box sx={{ width:{xs:'9px',sm:'7px'}, height: {xs:'9px',sm:'7px'}, borderRadius: '50%', backgroundColor: '#2CAA00', marginRight:{xs:'11px',sm:'15px'}}}></Box>
                                        )}
                                        <Typography sx={{ fontSize:{ xs:'12px',sm:'16px',},color: '#4301A2'}}>{job.status}</Typography>
                                    </Box>

                                    {/* Display other job details as needed */}
                                </Box>
                            ))}
                        </div>
                    )}
                </div>
                <div className='review-box'>
                    <h2 style={{fontSize:'28px'}} className='profilesec-subheading'>Reviews</h2>
                    {
                        reviews.length===0? 
                        (<p style={{marginTop:'10px'}}>You have no reviews yet.</p>):
                        (reviews.map((review,index)=>(
                                <Box key={index} sx={{
                                    margin:'15px 0',
                                    borderRadius:'16px',
                                    boxShadow: '0px 0px 4px 0px #00000040',
                                    width:'100%',
                                    padding:'20px',
                                    display:'flex',
                                    flexDirection:'row',
                                    alignItems:'center'
                                }}>
                                    <Box sx={{
                                        width:{md:'180px',sm:"150px",xs:'100px'},
                                        display:'flex',flexDirection:'column',alignItems:'center',padding:'10px',justifyContent:'center'
                                    }}>
                                        <Avatar
                                        alt={savedName}
                                        sx={{ backgroundColor: '#B27EE3',width:{sm:'65px',xs:'40px'},height:{sm:'65px',xs:'40px'} }}
                                    >
                                       {/* {typeof savedName === 'string' && savedName.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()} */}
                                       {review.posted_by_name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()}
                                    </Avatar>
                                        <Typography sx={{color:'#000000',fontSize:{sm:'16px',xs:'13px'},textAlign:'center',marginTop:'5px'}}>{review.posted_by_name}</Typography>

                                    </Box>
                                    <Box sx={{
                                        display:'flex',
                                        flexDirection:'column',
                                        width:'auto',
                                        gap:'14px',
                                        justifyContent:'space-between',
                                        marginLeft:{sm:'50px',xs:'10px'}
                                    }}>
                                         <Box sx={{
                                        display:'flex',
                                        flexDirection:'row'
                                        }}>
                                            <Box sx={{display:'flex',
                                        flexDirection:'row',alignItems:'center',gap:'5px'}}>
                                            <RiStarSFill style={{color:'#B27EE3',fontSize:{sm:'20px',xs:'14px'}}} />  {review.stars}
                                            </Box>
                                            <Typography sx={{color:'#000000',fontSize:{sm:'16px',xs:'13px'},marginLeft:'16px'}}>Reviewed on {formatDate(review.created_at)}</Typography>
                                        </Box>
                                    <Box>
                                        <Typography sx={{color:'#454545',fontSize:{sm:'20px',xs:'15px'}}}>{review.review}</Typography>
                                    </Box>
                                    </Box>
                                </Box>
                            )))
                    }
                </div>
            </div>

            {/* foruth div for reviews */}
            {
                !accessToken && (<Footer />)
            }
        </div>
    )
};
export default EmployerprofileShare;