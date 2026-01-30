import React from 'react';
import '../styles/Freelancerprofile.css';
import '../styles/Employerprofile.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { userService } from '../services/userService';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { reviewService } from '../services/reviewService';
import { cloudinaryService } from '../utils/cloudinary.utils';
import BAPI from '../helper/variable';
 
import { Box, Button, Typography} from '@mui/material';
import { MdArrowOutward } from "react-icons/md";
import { CiCamera } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { MdWorkOutline } from "react-icons/md";
import Header2 from './Header2';
import { RiStarSFill } from "react-icons/ri";
import { GrFormView } from "react-icons/gr";
import { toast } from 'react-hot-toast';

const Employerprofile = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const avatarBackgroundColor = 'Grey'; 
    const handlePostJobClick = () => {
        navigate('/postjob');
    }

    const handleBrowseFreelancerClick = () => {
        navigate('/browsefreelancer');
    }
    const handleImage2Click = () => {
        // logic for what will happen when clicked on notifications image
    }

    const viewProfileClick = () => {
        navigate('/employerprofile');
    }
    const clickLogout = () => {
        navigate('/')
    }
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


    const handleFreelancerClick = () => {
        navigate('/freelancerprofile');
    }

    const [inputAboutValue, setInputAboutValue] = useState('');
    const [inputcompdesc,setInputCompDesc]=useState({
        "company_name":'',
        "company_description":""
    });
    const [newinputcompdesc,setnewInputCompDesc]=useState({
        "company_name":'',
        "company_description":""
    });
    const [profileImage,setProfileImage]=useState(null);
    const [savedImage,setSavedImage]=useState(null);
    const [newinputval,setnewinputval]= useState('');

    const handleAboutChange = (event) => {
        setnewinputval(event.target.value);
        updateTextareaHeight(event.target);
    };
    const handlecompdesc= (event) => {
        const { name, value } = event.target;
        setnewInputCompDesc(prevState => ({
            ...prevState,
            [name]: value
        }));
        updateTextareaHeight(event.target);
    };
    const updateTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      };

    const [newProject, setNewProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [tempProjects, setTempProjects] = useState([]);

    const [rightBoxEditMode, setRightBoxEditMode] = useState(false);
    const [topBoxEditMode, setTopBoxEditMode] = useState(false);

    const [rightButtonImage, setRightButtonImage] = useState(require('../assets/edit.jpg'));
    const [topButtonImage, setTopButtonImage] = useState(require('../assets/edit.jpg'));

    const [newName, setNewName] = useState({"first_name":'',
    "last_name": ''});
    const [newJobCategory, setNewJobCategory] = useState('');
    const [newLocation, setNewLocation] = useState('');

    const [savedName, setSavedName] = useState({"first_name": '',
    "last_name": ''});
    const [savedJobCategory, setSavedJobCategory] = useState('');
    const [savedLocation, setSavedLocation] = useState('');

    const [jobsPostedCount, setJobsPostedCount] = useState('');
    const [avgRateOffered, setAvgRateOffered] = useState('');
    const [reviews,setReviews]=useState([]);

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await reviewService.getReviews();
                    // console.log(response.data)
                    setReviews(response.data.filter(item => !item.is_freelancer));
                
            } catch (error) {
                // Handle network error or other issues
                console.error('Network error:', error);
            }
        };
        fetchUserReviews()
    }, []);

    //giving initial values to the variables
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            
            const response = await userService.getMe();
    
            if (response.status === 200) {
              const { full_name, role, location,jobs_posted_count,average_rate_offered,description } = response.data;
              setSavedName({"first_name": response.data.first_name,
                    "last_name": response.data.last_name});
                    setNewName({"first_name": response.data.first_name,
                    "last_name": response.data.last_name});

                    setNewJobCategory(response.data.role);
                    setSavedJobCategory(response.data.role);
                    setNewLocation(response.data.location?.country);
                    if(response.data.location){
                        setSavedLocation(response.data.location?.country);}
                        else{
                          setSavedLocation('Location Here')
                    }

              setJobsPostedCount(jobs_posted_count);
              setAvgRateOffered(average_rate_offered);
              setInputAboutValue(description);
              setnewinputval(description);
              setInputCompDesc({
                "company_name":response.data.company_name,
                "company_description":response.data.company_description
              })
              setnewInputCompDesc({
                "company_name":response.data.company_name,
                "company_description":response.data.company_description
              });
              setProfileImage(response.data.photo_url && response.data.photo_url !== '' ? response.data.photo_url : null);
              setSavedImage(response.data.photo_url && response.data.photo_url !== '' ? response.data.photo_url : null);                    
              
            } else {
              console.error('Error fetching user profile:', response.data.error);
            }
          } catch (error) {
            console.error('Network error:', error);
          }
        };
    
        fetchUserProfile();
      }, []);
    const handleEditClick = (box) => {
        if (box === 'right') {
            setRightBoxEditMode(true);
            setTopBoxEditMode(false);
            setRightButtonImage(require('../assets/editNew.jpg'));
            setTopButtonImage(require('../assets/edit.jpg'));
        }
        else if (box === 'top') {
            setTopBoxEditMode(true);
            setRightBoxEditMode(false);
            setTopButtonImage(require('../assets/editNew.jpg'));
            setRightButtonImage(require('../assets/edit.jpg'));
        }
    };

    const handleAddProject = () => {
        if (newProject) {
            setTempProjects([...tempProjects, newProject]);
            setNewProject('');
        }
    };

      // usage of cloudinaryService instead
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const photourl = await cloudinaryService.uploadImage(file);
            
            if (photourl) {
                const data_send = { photo_url: photourl };
                const response = await userService.updateMe(data_send);

                if (response.status === 200) {
                    const responseData = response.data;
                    setProfileImage(responseData.photo_url || null);
                    setSavedImage(responseData.photo_url || null);                     
                    toast.success("Profile photo updated!");
                } else {
                     toast.error('Failed to update profile photo');
                }
            } else {
                toast.error('Image upload failed');
            }
        } catch (error) {
            console.error('Error updating profile photo:', error);
            toast.error('An error occurred');
        }
    };


    // change user details
    const updateUserProfile = async () => {
        try {
            const response = await userService.updateMe({
                first_name: newName.first_name,
                last_name:newName.last_name,
                description: newJobCategory,
                location: {
                    city: '',
                    state: '',
                    country: newLocation,
                },
            });

            if (response.status === 200) {
                const { jobs_posted_count, average_rate_offered } = response.data;

                setSavedName({"first_name": response.data.first_name,
                "last_name": response.data.last_name});
                setSavedJobCategory(newJobCategory);
                setSavedLocation(newLocation);
                setJobsPostedCount(jobs_posted_count);
                setAvgRateOffered(average_rate_offered);
               
                setTopBoxEditMode(false); // Exit edit mode

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
    const updateAbout = async () => {
        try {
            const response = await userService.updateMe({
                description: newinputval,
                company_name:newinputcompdesc.company_name,
                company_description:newinputcompdesc.company_description
            });

            if (response.status === 200) {
                const responseData = response.data;
                console.log(response)
                // Update the state with the response from the backend
                setInputAboutValue(responseData.description);
                setnewinputval(responseData.description);
                setInputCompDesc({
                    "company_name":response.data.company_name,
                    "company_description":response.data.company_description
                  })
                  setnewInputCompDesc({
                    "company_name":response.data.company_name,
                    "company_description":response.data.company_description
                  })
                setRightBoxEditMode(false);

            } else {
                // Handle error
                console.error('Failed to update skills and languages');
            }
        } catch (error) {
            // Handle network error or other issues
            console.error('Network error:', error);
        }
    };

    const handleSaveTop = async () => {
        setTopBoxEditMode(false);
        await updateUserProfile();
        setTopButtonImage(require('../assets/edit.jpg'));
    }

    const handleCancelTop = () => {
        setTopBoxEditMode(false);
        setNewName(savedName);
        setNewJobCategory(savedJobCategory);
        setNewLocation(savedLocation);
        setProfileImage(savedImage);

        setTopButtonImage(require('../assets/edit.jpg'));
    }

    const handleCancelAbout = () => {
        setRightBoxEditMode(false);
        setnewinputval(inputAboutValue);
        setnewInputCompDesc(inputcompdesc);
        setRightButtonImage(require('../assets/edit.jpg'));
    };

    const handleSaveAbout = async() => {
        setRightBoxEditMode(false);
        await updateAbout();
        setRightButtonImage(require('../assets/edit.jpg'));
    };


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
                const response = await axios.get(`${BAPI}/api/v0/users/me/jobs`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    params: {
                      status:"ONGOING,PENDING,COMPLETED"
                    },
                });

                if (response.status === 200) {
                    console.log(response.data)
                    setPostedJobs(response.data.results); 
                } else {
                    console.error('Error fetching posted jobs:', response.data.error);
                }
            } catch (error) {
                console.error('Error occurred:', error);
            }
        };

        fetchPostedJobs();
    }, [accessToken]);

    const JobCategoryOptions = [
        { value: 'GRAPHIC_DESIGNER', label: 'Graphic Designer' },
        { value: 'ILLUSTRATOR', label: 'Illustrator' },
        { value: 'PROGRAMMER', label: 'Programmer' },
        { value: 'VIDEO_EDITOR', label: 'Video Editor' },
        { value: 'THREE_D_ARTIST', label: '3D Artist' },
        { value: 'PRODUCT_DESIGNER', label: 'Product Designer' },
      ];
      

    const LocationOptions = [
        { value: 'INDIA', label: 'India' },
        { value: 'USA', label: 'USA' },
        { value: 'CANADA', label: 'Canada' },
        { value: 'ENGLAND', label: 'England' },
        { value: 'CHINA', label: 'China' },
        { value: 'RUSSIA', label: 'Russia' }
    ];

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const daySuffix = (day) => {
            switch (day % 10) {
                case 1: return day + "st";
                case 2: return day + "nd";
                case 3: return day + "rd";
                default: return day + "th";
            }
        };

        const options = { year: 'numeric', month: 'short' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const day = daySuffix(date.getDate());

        return `${day} ${formattedDate}`;
    };

    return (
        <div style={{ overflowX: 'hidden' }}>

            {/* first div for header */}
            <Header2 />

            {/* second div for profile bg */}
            <div className='profilepage'>
               <div className='firstcompprofile'>
                <button className='switch-to-employer-button' style={{cursor:'pointer'}} onClick={handleFreelancerClick}>SWITCH TO FREELANCER</button>

                <div style={{ position: 'relative' }}>
                    <img src={require('../assets/profileBg.png')} alt="" className='profile-background-image'></img>

                     <div style={{
                        position: 'absolute',
                        top:'5%',
                        display:'flex',
                        flexDirection:'column',
                        width:'94%',
                        left:'3%',
                        gap:'100px'
                     }} className='profiletosec-2' >
                           <div>
                               <button className='edit-button'
                                    style={{ backgroundImage: `url('${topButtonImage}')` }}
                                    onClick={() => handleEditClick('top')}>
                                </button>
                           </div>
                           <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} className='profilesec-1'>
                               <div style={{display:'flex',flexDirection:'row',gap:'30px',alignItems:'center'}} className='profilesec-4'>
                                    <div className='user-picture'>
                                        <label htmlFor="fileInput" className="user-picture" style={{ cursor: "pointer" }}>
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

                                            <div className='camera-icon-label'>
                                                <CiCamera className='camera-icon' />
                                            </div>
                                            
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileChange}
                                                />
                                                </label>
                                           
                                    </div>
                                <>
                                    {!topBoxEditMode && (
                                        <div>
                                         <p style={{ fontSize: '32px', fontWeight: '700' }} className='text-1'>{savedName.first_name} {savedName.last_name}</p>
                                                {
                                                    savedJobCategory && (
                                                        <p style={{ fontSize: '18px',marginTop:'3px' }} className='text-2'><MdWorkOutline style={{marginRight:'5px'}}/>{savedJobCategory}</p>)
                                                }
                                                {
                                                    savedLocation && (
                                                        <p style={{ fontSize: '18px',marginTop:'3px' }} className='text-2'><CiLocationOn style={{marginRight:'5px'}}/>{savedLocation}</p>)
                                                }
                                                </div>
                                    )}
                                    {topBoxEditMode && (
                                        <div style={{
                                            display:'flex',
                                            flexDirection:'column',
                                            gap:'5px',
                                            marginTop:'-50px',
                                        }}>
                                             <div>
                                                    <input
                                                        type="text"
                                                        placeholder="First name"
                                                        value={newName.first_name}
                                                        onChange={(e) => setNewName({ ...newName, first_name: e.target.value })}
                                                        className='profilesecinputs'
                                                        style={{ padding: '10px', width: '190px', borderRadius: '16px', border: '1px solid #DDD' }}
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        placeholder="Last name"
                                                        value={newName.last_name}
                                                        onChange={(e) => setNewName({ ...newName, last_name: e.target.value })}
                                                        className='profilesecinputs'
                                                        style={{ padding: '10px', width: '190px', borderRadius: '16px', border: '1px solid #DDD' }}
                                                    />
                                                </div>
                                            <div>
                                                <select
                                                    value={newJobCategory}
                                                    className='profilesecinputs'
                                                    onChange={(e) => setNewJobCategory(e.target.value)}
                                                    style={{padding:'10px',  width: '190px', borderRadius: '16px', border: '1px solid #DDD' }}
                                                >
                                                    <option value="" disabled>Select Job Category</option>
                                                    {JobCategoryOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <select
                                                    value={newLocation}
                                                    className='profilesecinputs'
                                                    onChange={(e) => setNewLocation(e.target.value)}
                                                    style={{padding:'10px', width: '190px', borderRadius: '16px', border: '1px solid #DDD' }}
                                                >
                                                    <option value="" disabled>Select Location</option>
                                                    {LocationOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
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
                                        {topBoxEditMode && (
                                            <div style={{display: 'flex',gap:'10px',flexDirection:'row'}} className='edit-buttons-container'>
                                                <div>
                                                    <button className='cancel-button' onClick={handleCancelTop}>Cancel</button>
                                                </div>
                                                <div>
                                                    <button className='save-button' onClick={handleSaveTop}>Save</button>
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
                        <button
                            className='edit-button-three'
                            style={{ backgroundImage: `url('${rightButtonImage}')` }}
                            onClick={() => handleEditClick('right')}
                        ></button>
                    </div>

                    <textarea
                            type="text"
                            placeholder="Write something about you....."
                            value={newinputval}
                            onChange={handleAboutChange}
                            className={`first-box-one ${rightBoxEditMode ? 'editable' : ''}`}
                            readOnly={!rightBoxEditMode}
                            rows="3"
                            ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                        />
                    
                    <input 
                            type="text"
                            placeholder="Company Name"
                            name="company_name"
                            value={newinputcompdesc.company_name}
                            onChange={handlecompdesc}
                            readOnly={!rightBoxEditMode}
                            className={rightBoxEditMode ? 'first-box-three-editable' : 'first-box-three'}
                            />
                    
                    <textarea
                        type="text"
                        placeholder="Company Description"
                        name="company_description"
                        value={newinputcompdesc.company_description}
                        onChange={handlecompdesc}
                        className={`first-box-two ${rightBoxEditMode ? 'editable' : ''}`}
                        readOnly={!rightBoxEditMode}
                        rows="2"
                        ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop:'40px'}}>
                        <h2 style={{fontSize:'28px' }} className='profilesec-subheading'>Posted Jobs</h2>

                        {!rightBoxEditMode && (
                            <a href="/clientmanagejobs/posted" style={{ marginRight: '80px', color: '#b27ee3', fontWeight: 'bold' }} className='profileseclink'>Edit Jobs</a>
                        )}
                    </div>

                    { (
                        <div className='inside-posted-jobs'>
                            {postedJobs.map((job) => (
                                <Box key={job.job_id} sx={{ borderRadius: '16px', border: 'none',  padding: '16px 20px',boxShadow: '0px 0px 4px 0px #00000040',display:'flex',flexDirection:'column',gap:{xs:'6px',sm:'10px'}  }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize:{ xs:'18px',sm:'24px'}, fontWeight: '700', flex: '50%', margin: '0' }}>{job.title}</Typography>
                                        <Typography sx={{ fontSize: '15px', color: '#B27EE3', margin: '0',display:{xs:'none',md:'block'} }}>{job.job_applicants_count} Freelancers Applied</Typography>
                                        <Button sx={{marginLeft:'10px', color: '#B27EE3',display:{xs:'none',md:'flex'},flexDirection:'row'}} onClick={()=>navigate(`/jobdetails/${job.id}`)} startIcon={<GrFormView style={{marginRight:'-8px'}}  />} >View Job</Button>
                                    </div>

                                    <div style={{  display: 'flex', alignItems: 'center',marginTop:'2px' }}>
                                        <Typography sx={{ fontSize:{ xs:'15px',sm:'19px'} ,fontWeight:'500'}}>Budget:  {job.rate_per_hour} {job.currency_type}</Typography>
                                        <Typography sx={{ fontSize: '14px', color: '#00000080', marginLeft: '20px' }}>Posted {TimeDiff(job.created_at)}</Typography>
                                    </div>
                                    <Typography sx={{ fontSize:{xs:'12px',sm:'15px'}, color: '#B27EE3', flex: '30%', margin: '2px 0 0 0',display:{xs:'block',md:'none'} }}>{job.job_applicants_count} Freelancers Applied</Typography>
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
                                        {job.status === 'ONGOING' && (
                                            <Box sx={{ width:{xs:'9px',sm:'7px'}, height: {xs:'9px',sm:'7px'}, borderRadius: '50%', backgroundColor: '#2CAA00', marginRight:{xs:'11px',sm:'15px'}}}></Box>
                                        )}
                                        <Typography sx={{ fontSize:{ xs:'12px',sm:'16px',},color: '#4301A2'}}>{job.status}</Typography>
                                    </Box>

                                    {/* Display other job details as needed */}
                                </Box>
                            ))}
                        </div>
                    )}
                    {rightBoxEditMode && (
                        <div className="postjob-profile" onClick={()=>{navigate('/postjob')}}>
                            <p style={{fontSize:'30px'}}>+</p>
                            <p>Post a Job</p>
                        </div>
                    )}
                    {rightBoxEditMode && (
                        <div>
                            <div className="buttons-container">
                                
                                <div>
                                    <button className='cancel-button' onClick={handleCancelAbout}>Cancel</button>
                                </div>
                                <div>
                                    <button className='save-button' onClick={handleSaveAbout}>Save</button>
                                </div>
                            </div>
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
            
        </div>
    )
};
export default Employerprofile;