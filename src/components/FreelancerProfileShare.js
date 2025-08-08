import React from 'react';
import '../styles/Freelancerprofile.css';
import { useNavigate, NavLink,useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { CiLocationOn } from "react-icons/ci";
import { MdWorkOutline } from "react-icons/md";
import { CiCamera } from "react-icons/ci";
import Header1 from './Header1';
import Avatar from '@mui/material/Avatar';
import { Box, Chip } from '@mui/material';
import BAPI from '../helper/variable';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from "./Footer";
import { Typography } from '@mui/material'
import { RiStarSFill } from "react-icons/ri";
import { toast } from 'react-hot-toast'; 
const FreelancerProfileShare = () => {
    const { pathname } = useLocation();
    const {userid}=useParams();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    console.log("Token is : ",accessToken)
    const avatarBackgroundColor = 'Grey';

    const formatDate = (timestamp) => {
        console.log(timestamp)
        const date = new Date(timestamp);

        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    };

    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [projects, setProjects] = useState([]);
    const [portfolios, setPortfolios] = useState([]);

    const [tempSkills, setTempSkills] = useState([]);  // to store the newly added skills, but only save them if 'save' button is pressed, else discard them
    const [tempLanguages, setTempLanguages] = useState([]); 

    const [leftBoxEditMode, setLeftBoxEditMode] = useState(false);
    const [rightBoxEditMode, setRightBoxEditMode] = useState(false);
    const [topBoxEditMode, setTopBoxEditMode] = useState(false);

    const [newName, setNewName] = useState('');
    const [newJobCategory, setNewJobCategory] = useState('');
    const [newLocation, setNewLocation] = useState('');

    const [savedName, setSavedName] = useState('');
    const [savedJobCategory, setSavedJobCategory] = useState('');
    const [savedLocation, setSavedLocation] = useState('');

    const [jobsCompletedCount, setJobsCompletedCount] = useState('');
    const [ratePerHour, setRatePerHour] = useState('');

    const [inputAboutValue, setInputAboutValue] = useState('');
    const [newinputval,setnewinputval]= useState('');
    const [profileImage,setProfileImage]=useState(null);

    const filters=['All','UI/UX','3d Visualization','Graphic Design','Video Editing']

    const handleAboutChange = (event) => {
        setnewinputval(event.target.value);
        updateTextareaHeight(event.target);
    };
    const updateTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      };
      const [reviews,setReviews]=useState([]);
      useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await axios.get(`${BAPI}/api/v0/reviews/${userid}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    setReviews(response.data.filter(item => item.is_freelancer));
                
            } catch (error) {
                // Handle network error or other issues
                console.error('Network error:', error);
            }
        };
        fetchUserReviews()
    }, []);
    //fetching initial user profile values for name,skills, projects, etc.
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${BAPI}/api/v0/users/public/${userid}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                if (response.status === 200) {
                    const responseData = response.data;
                    setSavedName(responseData.full_name);
                    setNewName(responseData.full_name);
                    setNewLocation(responseData.location?.country);
                    setNewJobCategory(responseData.role);
                    setSavedJobCategory(responseData.role);
                    if(responseData.location){
                        console.log(responseData)
                        setSavedLocation(responseData.location?.country);}
                        else{
                          setSavedLocation('Location Here')
                        }
                    setJobsCompletedCount(responseData.jobs_completed_count);
                    setRatePerHour(responseData.rate_per_hour);
                    setSkills(responseData.skills);
                    setLanguages(responseData.languages);
                    setTempSkills(responseData.skills);
                    setTempLanguages(responseData.languages);
                    setInputAboutValue(responseData.description);
                    setnewinputval(responseData.description);
                    setProjects(responseData.work_sample_urls ? responseData.work_sample_urls : []);
                    setProfileImage(responseData.photo_url && responseData.photo_url !== '' ? responseData.photo_url : null);
                    setPortfolios(responseData.portfolio_urls ? responseData.portfolio_urls : []);
                    setTopBoxEditMode(false);
                    setLeftBoxEditMode(false);
                    setRightBoxEditMode(false);

                } else if (response.status === 400) {
                    // Handle error (e.g., show error message)
                    toast.error('A user with this email already exists');
                    console.error('Failed to update user profile');
                }
                else if (response.status === 401) {
                    toast.error('Missing token or inactive value');
                }
            } catch (error) {
                // Handle network error or other issues
                console.error('Network error:', error);
            }
        };
        fetchUserProfile()
    }, []);
   
    return (
        <div>

            {/* first div for header */}
           <Navbar />

            {/* second div for profile bg */}
            <div className='profilepage'>
                <div className='firstcompprofile'>
                    <div style={{ position: 'relative' }}>
                        <img src={require('../assets/profileBg.png')} alt="" className='profile-background-image' />
                        <div style={{
                            position: 'absolute',
                            top: '20%',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '94%',
                            left: '3%',
                            gap: '100px'
                        }} className='profiletosec-2' >
                            <div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} className='profilesec-1'>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'center' }} className='profilesec-4'>
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
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'center' }}>
                                    {!topBoxEditMode && (
                                        <div style={{
                                            display: 'flex', gap: '10px', flexDirection: 'row'
                                        }}>
                                            <div className='profiletopinfo' style={{
                                                padding: '5px', background: 'white',
                                                width: '150px', height: '70px', borderRadius: '15px', border: '1px solid black',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <span style={{ color: '#ED8336', fontSize: '20px' }}> {jobsCompletedCount}</span>
                                                <span>Projects Completed</span>
                                            </div>
                                            <div className='profiletopinfo' style={{
                                                padding: '5px', background: 'white',
                                                width: '150px', height: '70px', borderRadius: '15px', border: '1px solid black', textAlign: 'center',
                                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <span style={{ color: '#ED8336', fontSize: '20px' }}>${ratePerHour}</span>
                                                <span>Per Hour</span>
                                            </div>
                                        </div>
                                    )}
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* third div for skills,languages and about */}
                <div className='skills-about'>

                    <div className='left-box'>
                        <div className='skills' style={{ display: 'flex', flexDirection: 'column'}}>
                            <div style={{ display: 'flex', justifyContent:'space-between',alignItems:'center',gap:'10px' }}>
                                <h2 style={{paddingTop:'20px',fontSize:'28px'}} className='profilesec-subheading'>Skills</h2>
                         
                            </div>

                            {/* Display newly added skills */}
                            {!leftBoxEditMode && (
                            <ul style={{listStyle: 'none',gap:'7px',display:'flex' ,flexDirection:'column',marginTop:'12px'}}>
                                {skills.map((skill, index) => (
                                        <li key={index} className='li-li' style={{ textTransform:'capitalize',color: 'black',backgroundColor:'#E9E9E9', padding: '7px 40px 7px 12px',borderRadius:'16px',fontSize:'18px',width:'fit-content',fontWeight:'500',cursor:'default' }}>{skill}</li>
                                ))}
                            </ul>
                            )}
                        </div>

                        <div className='languages'>
                            <h2 style={{fontSize:'28px'}} className='profilesec-subheading'>Languages</h2>
                            
                            {/* Display newly added languages */}
                            {!leftBoxEditMode && (
                            <ul style={{listStyle: 'none',gap:'7px',display:'flex' ,flexDirection:'column',marginTop:'12px'}}>
                                {languages.map((language, index) => (
                                        <li key={index} className='li-li' style={{textTransform:'capitalize', color: 'black',backgroundColor:'#E9E9E9', padding: '7px 40px 7px 12px',borderRadius:'16px',fontSize:'18px',width:'fit-content',fontWeight:'500' }}>{language}</li>
                                ))}
                            </ul>
                             )}
                        </div>

                       
                    </div>


                    {/* div for about and projects */}
                    <div className='right-box'>
                        <div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-between' }}>
                            <h2 style={{paddingTop:'20px',fontSize:'28px',marginLeft:'20px'}} className='profilesec-subheading'>About</h2>
                           
                        </div>
                        <textarea
                            type="text"
                            placeholder="Write something about you....."
                            value={newinputval}
                            onChange={handleAboutChange}
                            className={`about-box ${rightBoxEditMode ? 'editable' : ''}`}
                            readOnly={!rightBoxEditMode}
                            rows="3"
                            ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                        />
                        <div style={{width:'90%',marginLeft:'20px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop:'30px'}} >
                            <h2 style={{fontSize:'28px'}} className='profilesec-subheading'>Ongoing Work/Portfolio</h2>
                        </div>

                        <Box sx={{ marginTop:'25px',marginBottom:'45px',display:'flex',flexDirection:'row',gap:'15px',flexWrap:'wrap'}}>
                            {filters.map((filter, index) => (
                                <Chip key={index} label={filter} variant="outlined" sx={{width:'150px',border: '0.8px solid #000000',color:'#000',padding:'5.6px 13.6px 5.6px 13.6px',borderRadius:'12.8px'}}/>
                            ))}
                        </Box>

                    

                        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                            {/* Displaying the projects */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px',gap:'20px'}}>
                                {projects.map((project, index) => (
                                    <div style={{
                                         minWidth: '150px', height: '150px', boxShadow: '0px 0px 4px 0px #00000040 ',
                                        borderRadius: '16px'
                                    }}>
                                        <div key={index} style={{ margin:'105px 12px 12px' }}>
                                            <div className="portfolio" style={{
                                                textAlign: 'center',
                                                lineHeight: '30px',
                                                color: 'white', backgroundColor: '#B27EE3', borderRadius: '16px'
                                                , fontWeight: 'bold', padding:'0 12px'
                                            }}>
                                                {project}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Margin between projects and portfolios */}
                            <div />

                        

                            {/* Displaying the portfolio values */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px',gap:'20px' }}>
                                {portfolios.map((portfolio, index) => (
                                    <div style={{
                                        minWidth: '150px', height: '150px', boxShadow: '0px 0px 4px 0px #00000040 ',
                                        borderRadius: '16px',margin: '10px 0'
                                    }}>
                                        <div key={index} style={{ margin:'105px 12px 12px' }}>
                                            <div className="portfolio" style={{
                                                textAlign: 'center',
                                                lineHeight: '30px',
                                                color: 'white', backgroundColor: '#B27EE3', borderRadius: '16px'
                                                , fontWeight: 'bold', padding:'0 12px'
                                            }}>
                                                {portfolio}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                    </div>
                </div>

                {/* foruth div for reviews */}
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
                                        alt={review.posted_by_name[0]}
                                        sx={{ backgroundColor: '#B27EE3',width:{sm:'65px',xs:'40px'},height:{sm:'65px',xs:'40px'} }}
                                    >
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

            {
                !accessToken && (<Footer />)
            }
        </div>
    )
};
export default FreelancerProfileShare;
