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
import { Typography } from '@mui/material'
import { RiStarSFill } from "react-icons/ri";
import { toast } from 'react-hot-toast';

const FreelancerProfile = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const avatarBackgroundColor = 'Grey';
    
    const switchToEmployerClick = () => {
        navigate('/clientprofile');
    }
    
    const [cloudinaryImage,setCloudinaryImage]=useState(null);
    const uploadImage = async () => {
        if(!cloudinaryImage){ return '';}
        const data = new FormData();
        data.append("file", cloudinaryImage);
        data.append("upload_preset", 'er103mfg');
        data.append("cloud_name", 'dlpcihcmz');
        const response = await fetch('https://api.cloudinary.com/v1_1/dlpcihcmz/image/upload', {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
              console.log(data)
              return data.url;
            })
          .catch((err) => {
            console.log(err);
            return '';
          });
        return response;
      }
      const updateUserPhoto = async () => {
       
        try { 
            let photourl;
            if(cloudinaryImage){
                photourl = await uploadImage();
                setCloudinaryImage(null);
            }
            // console.log("photo url is : ",photourl)
            const data_send={
                
                photo_url:photourl
            }
            const response = await axios.patch(`${BAPI}/api/v0/users/me`,data_send,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

            if (response.status === 200) {
                const responseData = response.data;
                
                setProfileImage(responseData.photo_url && responseData.photo_url !== '' ? responseData.photo_url : null);
                setSavedImage(responseData.photo_url && responseData.photo_url !== '' ? responseData.photo_url : null);                     
             

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
      const handleFileChange = (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        setCloudinaryImage(file);
        updateUserPhoto();
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const imageDataUrl = reader.result; 
        //         setProfileImage(imageDataUrl);
        //     };
    
        //     reader.readAsDataURL(file);
        // }
    }

    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newProject, setNewProject] = useState('');
    const [newPortfolio, setNewPortfolio] = useState('');

    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [projects, setProjects] = useState([]);
    const [portfolios, setPortfolios] = useState([]);

    const [tempSkills, setTempSkills] = useState([]);  // to store the newly added skills, but only save them if 'save' button is pressed, else discard them
    const [tempLanguages, setTempLanguages] = useState([]);  // to store the newly added languages, but only save them if 'save' button is pressed, else discard them
    const [tempProjects, setTempProjects] = useState([]);
    const [tempPortfolios, setTempPortfolios] = useState([]);

    const [leftBoxEditMode, setLeftBoxEditMode] = useState(false);
    const [rightBoxEditMode, setRightBoxEditMode] = useState(false);
    const [topBoxEditMode, setTopBoxEditMode] = useState(false);

    const [leftButtonImage, setLeftButtonImage] = useState(require('../assets/edit.jpg'));
    const [rightButtonImage, setRightButtonImage] = useState(require('../assets/edit.jpg'));
    const [topButtonImage, setTopButtonImage] = useState(require('../assets/edit.jpg'));

    const [newName, setNewName] = useState({"first_name":'',
    "last_name": ''});
    const [newJobCategory, setNewJobCategory] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [profileImage,setProfileImage]=useState(null);

    const [savedName, setSavedName] = useState({"first_name": '',
    "last_name": ''});
    const [savedJobCategory, setSavedJobCategory] = useState('');
    const [savedLocation, setSavedLocation] = useState('');
    const [savedImage,setSavedImage]=useState(null);

    const [jobsCompletedCount, setJobsCompletedCount] = useState('');
    const [newratePerHour, setnewRatePerHour] = useState('');
    const [ratePerHour, setRatePerHour] = useState('');

    const [inputAboutValue, setInputAboutValue] = useState('');
    const [newinputval,setnewinputval]= useState('');

    const [reviews,setReviews]=useState([]);

    const filters=['All','UI/UX','3d Visualization','Graphic Design','Video Editing']

    const handleAboutChange = (event) => {
        setnewinputval(event.target.value);
        updateTextareaHeight(event.target);
    };
    const updateTextareaHeight = (element) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      };
    const handleEditClick = (box) => {
        if (box === 'left') {
            setLeftBoxEditMode(true);
            setRightBoxEditMode(false);
            setTopBoxEditMode(false);
            setLeftButtonImage(require('../assets/editNew.jpg'));
            setRightButtonImage(require('../assets/edit.jpg'));
            setTopButtonImage(require('../assets/edit.jpg'));
        } else if (box === 'right') {
            setRightBoxEditMode(true);
            setLeftBoxEditMode(false);
            setTopBoxEditMode(false);
            setRightButtonImage(require('../assets/editNew.jpg'));
            setLeftButtonImage(require('../assets/edit.jpg'));
            setTopButtonImage(require('../assets/edit.jpg'));
        }
        else if (box === 'top') {
            setTopBoxEditMode(true);
            setLeftBoxEditMode(false);
            setRightBoxEditMode(false);
            setTopButtonImage(require('../assets/editNew.jpg'));
            setLeftButtonImage(require('../assets/edit.jpg'));
            setRightButtonImage(require('../assets/edit.jpg'));
        }
    };

    const handleAddSkill = () => {
        if (newSkill) {
            setTempSkills([...tempSkills, newSkill]);
            setNewSkill('');
        }
    };
    
    const handleDeleteSkill = (index) => {
        const updatedSkills = [...tempSkills];
        updatedSkills.splice(index, 1);
        setTempSkills(updatedSkills);
      };

    const handleAddLanguage = () => {
        if (newLanguage) {
            setTempLanguages([...tempLanguages, newLanguage]);
            setNewLanguage('');
        }
    };

    const handleDeleteLanguage = (index) => {
        const updatedLanguages = [...tempLanguages];
        updatedLanguages.splice(index, 1);
        setTempLanguages(updatedLanguages);
    };

    const handleAddProject = () => {
        if (newProject) {
            setTempProjects([...tempProjects, newProject]);
            // console.log(tempProjects);
            setNewProject('');
        }
    };

    const handleAddPortfolio = () => {
        if (newPortfolio) {
            setTempPortfolios([...tempPortfolios, newPortfolio]);
            setNewPortfolio('');
        }
    };
    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const response = await axios.get(`${BAPI}/api/v0/reviews/reviews`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
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
                const response = await axios.get(`${BAPI}/api/v0/users/me`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });

                if (response.status === 200) {
                    const responseData = response.data;
                    console.log(responseData)
                    setSavedName({"first_name": responseData.first_name,
                    "last_name": responseData.last_name});
                    setNewName({"first_name": responseData.first_name,
                    "last_name": responseData.last_name});

                    setNewJobCategory(responseData.role);
                    setSavedJobCategory(responseData.role);

                    setNewLocation(responseData.location?.country);
                    if(responseData.location){
                        setSavedLocation(responseData.location?.country);}
                        else{
                          setSavedLocation('Location Here')
                    }
                    setProfileImage(responseData.photo_url && responseData.photo_url !== '' ? responseData.photo_url : null);
                    setSavedImage(responseData.photo_url && responseData.photo_url !== '' ? responseData.photo_url : null);                    
                    setSkills(responseData.skills);
                    setTempSkills(responseData.skills);

                    setTempLanguages(responseData.languages);
                    setLanguages(responseData.languages);

                    setInputAboutValue(responseData.description);
                    setnewinputval(responseData.description);

                    setJobsCompletedCount(responseData.jobs_completed_count);
                    setnewRatePerHour(responseData.rate_per_hour);
                    setRatePerHour(responseData.rate_per_hour);
                    setProjects(responseData.work_sample_urls ? responseData.work_sample_urls : []);
                    setPortfolios(responseData.portfolio_urls ? responseData.portfolio_urls : []);
                    setTempProjects(responseData.work_sample_urls ? responseData.work_sample_urls : [])
                    setTempPortfolios(responseData.portfolio_urls ? responseData.portfolio_urls : [])
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


    //updating user profile values
    const updateUserProfile = async () => {
       
        try { 
            // console.log("photo url is : ",photourl)
            const data_send={
                first_name: newName.first_name,
                last_name:newName.last_name,
                role: newJobCategory,
                location: {
                    city: '',
                    state: '',
                    country: newLocation,
                },
                rate_per_hour:newratePerHour,
            }
            const response = await axios.patch(`${BAPI}/api/v0/users/me`,data_send,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

            if (response.status === 200) {
                const responseData = response.data;
                console.log(responseData)
                setNewName({"first_name": responseData.first_name,
                "last_name": responseData.last_name})
                setSavedName({"first_name": responseData.first_name,
                "last_name": responseData.last_name});
                setSavedJobCategory(responseData.role);
                if(responseData.location){
                   setSavedLocation(responseData.location?.country);}
                    else{
                      setSavedLocation('Location Here')
                    }
                setJobsCompletedCount(responseData.jobs_completed_count);
                setnewRatePerHour(responseData.rate_per_hour);
                setRatePerHour(responseData.rate_per_hour);
               setTopBoxEditMode(false);

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

    // updating skills and languages
    const updateSkillsAndLanguages = async () => {
        try {
            const response = await axios.patch(`${BAPI}/api/v0/users/me`, {
                skills: [...tempSkills],
                languages: [...tempLanguages],
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                const responseData = response.data;
                // console.log(response)
                // Update the state with the response from the backend
                setSkills(responseData.skills || []);
                setLanguages(responseData.languages || []);
                setTempSkills(responseData.skills || []);
                setTempLanguages(responseData.languages || []);
                setLeftBoxEditMode(false);
            } else {
                // Handle error
                console.error('Failed to update skills and languages');
            }
        } catch (error) {
            // Handle network error or other issues
            console.error('Network error:', error);
        }
    };

    // updating about and projects
    const updateProjectsAndAbout = async () => {
        console.log(tempProjects)
        try {
            const response = await axios.patch(`${BAPI}/api/v0/users/me`, {
                description: newinputval,
                work_sample_urls: [...tempProjects],
                portfolio_urls: [...tempPortfolios],
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                const responseData = response.data;
                // console.log(response)
                // Update the state with the response from the backend
                setInputAboutValue(responseData.description);
                setnewinputval(responseData.description);
                setProjects(responseData.work_sample_urls || []);
                setPortfolios(responseData.portfolio_urls || []);
                setTempProjects(responseData.work_sample_urls ? responseData.work_sample_urls : [])
                setTempPortfolios(responseData.portfolio_urls ? responseData.portfolio_urls : [])
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
        setnewRatePerHour(ratePerHour);
        setProfileImage(savedImage);
        setCloudinaryImage(null);
        setTopButtonImage(require('../assets/edit.jpg'));
    }

    //for skills and languages
    const handleSaveLeft = async () => {
        setLeftBoxEditMode(false);
        await updateSkillsAndLanguages();
        setNewSkill('');
        setNewLanguage('');
        setLeftButtonImage(require('../assets/edit.jpg'));
    };

    const handleCancelLeft = () => {
        setLeftBoxEditMode(false);
        setNewSkill('');
        setNewLanguage('');
        setTempSkills(skills);
        setTempLanguages(languages);
        setLeftButtonImage(require('../assets/edit.jpg'));
    };

    //for about and projects
    const handleSaveRight = async () => {
        setRightBoxEditMode(false);
        await updateProjectsAndAbout();
        // setProjects([...projects, ...tempProjects, newProject]); // Add the new project
        setNewProject('');
        setNewPortfolio('');
        setRightButtonImage(require('../assets/edit.jpg'));
    };

    const handleCancelRight = () => {
        setRightBoxEditMode(false);
        setNewProject('');
        setTempProjects(projects);
        setNewPortfolio('');
        setTempPortfolios(portfolios);
        setnewinputval(inputAboutValue)
        setRightButtonImage(require('../assets/edit.jpg'));
    };

    

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
        console.log(timestamp)
        const date = new Date(timestamp);

        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    };

    return (
        <div>

            {/* first div for header */}
            <Header1 />

            {/* second div for profile bg */}
            <div className='profilepage'>
                <div className='firstcompprofile'>
                    <button className='switch-to-employer-button'  style={{cursor:'pointer'}} onClick={switchToEmployerClick}>SWITCH TO AN EMPLOYER</button>

                    <div style={{ position: 'relative' }}>
                        <img src={require('../assets/profileBg.png')} alt="" className='profile-background-image' />
                        <div style={{
                            position: 'absolute',
                            top: '5%',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '94%',
                            left: '3%',
                            gap: '100px'
                        }} className='profiletosec-2' >
                            <div>
                                <button className='edit-button'
                                    style={{ backgroundImage: `url('${topButtonImage}')` }}
                                    onClick={() => handleEditClick('top')}>
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} className='profilesec-1'>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'center' }} className='profilesec-4'>
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
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '5px',
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
                                                        className='profilesecinputs'
                                                        value={newJobCategory}
                                                        onChange={(e) => setNewJobCategory(e.target.value)}
                                                        style={{ padding: '10px', width: '190px', borderRadius: '16px', border: '1px solid #DDD' }}
                                                    >
                                                        <option value="" disabled>Select Job Category</option>
                                                        {JobCategoryOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>{option.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <select
                                                        className='profilesecinputs'
                                                        value={newLocation}
                                                        onChange={(e) => setNewLocation(e.target.value)}
                                                        style={{ padding: '10px', width: '190px', borderRadius: '16px', border: '1px solid #DDD' }}
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
                                    {topBoxEditMode && (
                                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', }}>
                                            <div style={{ display: 'flex',flexDirection:'row',alignItems:'center' }}>
                                            <input
                                             type="text"
                                             placeholder="500"
                                             value={newratePerHour}
                                             onChange={(e) => setnewRatePerHour(e.target.value)}
                                             className='profilesecinputs'
                                             style={{ padding: '10px', width: '120px', textAlign:'center', borderRadius: '16px', border: '1px solid #DDD' }}
                                           />
                                           <p style={{color:'#000',fontWeight:'800'}}>
                                             $/hour
                                           </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }} className='edit-buttons-container'>
                                                <div>
                                                    <button className='cancel-button' onClick={handleCancelTop}>Cancel</button>
                                                </div>
                                                <div>
                                                    <button className='save-button' onClick={handleSaveTop}>Save</button>
                                                </div>
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
                                <button
                                    className='edit-button-three'
                                    style={{ backgroundImage: `url('${leftButtonImage}')` }}
                                    onClick={() => handleEditClick('left')}
                                ></button>
                            </div>

                            {/* Display newly added skills */}
                            {!leftBoxEditMode && (
                            <ul style={{listStyle: 'none',gap:'7px',display:'flex' ,flexDirection:'column',marginTop:'12px'}}>
                                {skills.map((skill, index) => (
                                        <li key={index} className='li-li' style={{ textTransform:'capitalize',color: 'black',backgroundColor:'#E9E9E9', padding: '7px 40px 7px 12px',borderRadius:'16px',fontSize:'18px',width:'fit-content',fontWeight:'500',cursor:'default' }}>{skill}</li>
                                ))}
                            </ul>
                            )}

                            {leftBoxEditMode && (
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{gap:'7px',display:'flex' ,flexDirection:'column',marginBottom:'7px'}}>
                                            {tempSkills.map((skill, index) => (
                                                    <div key={index} className='li-li1' style={{ textTransform:'capitalize',color: 'black',backgroundColor:'#E9E9E9', padding: '7px 12px 7px 12px',borderRadius:'16px',fontSize:'18px',width:'fit-content',fontWeight:'500',cursor:'default',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:'50px' }}>
                                                        <p>{skill}</p>
                                                        <button onClick={() => handleDeleteSkill(index)} 
                                                        style={{color:'#000',cursor:'pointer',fontSize:'22px',backgroundColor:'transparent',border:'none',outline:'none'}}>×</button>
                                                    </div>
                                            ))}
                                    </div>
                                    <input
                                        style={{borderRadius:'16px',border:'1px solid #9c9b9b',padding:'10px'}}
                                        type="text"
                                        placeholder="Add new skill"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                    />
                                    <button style={{marginLeft:'10px',padding:'5px 10px',borderRadius:'5px',border:'none',fontSize:'22px',cursor:'pointer'}} onClick={handleAddSkill}>+</button>
                                </div>
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
                            {leftBoxEditMode && (
                                <div style={{ marginTop: '7px' }}>
                                    <div style={{gap:'7px',display:'flex' ,flexDirection:'column',marginBottom:'7px'}}>
                                            {tempLanguages.map((language, index) => (
                                                    <div key={index} className='li-li1' style={{ textTransform:'capitalize',color: 'black',backgroundColor:'#E9E9E9', padding: '7px 12px 7px 12px',borderRadius:'16px',fontSize:'18px',width:'fit-content',fontWeight:'500',cursor:'default',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:'50px' }}>
                                                        <p>{language}</p>
                                                        <button onClick={() => handleDeleteLanguage(index)} 
                                                        style={{color:'#000',cursor:'pointer',fontSize:'22px',backgroundColor:'transparent',border:'none',outline:'none'}}>×</button>
                                                    </div>
                                            ))}
                                    </div>
                                    <input
                                        style={{borderRadius:'16px',border:'1px solid #9c9b9b',padding:'10px'}}
                                        type="text"
                                        placeholder="Add new language"
                                        value={newLanguage}
                                        onChange={(e) => setNewLanguage(e.target.value)}
                                    />
                                    <button style={{marginLeft:'10px',padding:'5px 10px',borderRadius:'5px',border:'none',fontSize:'22px',cursor:'pointer'}} onClick={handleAddLanguage}>+</button>
                                </div>
                            )}

                        </div>

                        {leftBoxEditMode && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',gap:'8px' }} className='left-box-butcont'>
                                <div >
                                    <button className='save-button' onClick={handleSaveLeft}>Save</button>
                                </div>
                                <div >
                                    <button className='cancel-button' onClick={handleCancelLeft}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* div for about and projects */}
                    <div className='right-box'>
                        <div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-between' }}>
                            <h2 style={{paddingTop:'20px',fontSize:'28px',marginLeft:'20px'}} className='profilesec-subheading'>About</h2>
                            <button
                                className='edit-button-three'
                                style={{ backgroundImage: `url('${rightButtonImage}') ` }}
                                onClick={() => handleEditClick('right')}
                            ></button>
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
                            <a href="/managejobs/applied" style={{ marginLeft: 'auto', color: '#ED8335', fontWeight: 'bold' }}>Manage Projects</a>
                        </div>

                        <Box sx={{ marginTop:'25px',marginBottom:'45px',display:'flex',flexDirection:'row',gap:'15px',flexWrap:'wrap'}}>
                            {filters.map((filter, index) => (
                                <Chip key={index} label={filter} variant="outlined" sx={{width:'150px',border: '0.8px solid #000000',color:'#000',padding:'5.6px 13.6px 5.6px 13.6px',borderRadius:'12.8px'}}/>
                            ))}
                        </Box>

                        {rightBoxEditMode && (
                            <div className="box-container">
                                <input
                                    style={{padding:'12px 18px',borderRadius:'15px',border:'1px solid #9c9b9b'}}
                                    type="text"
                                    placeholder="Add ongoing work"
                                    value={newProject}
                                    onChange={(e) => setNewProject(e.target.value)}
                                />
                                <button style={{height:'20px',width:'20px',marginLeft:'10px',marginTop:'10px',color:'#000',backgroundColor:'#ffff'}} onClick={handleAddProject}>+</button>
                            </div>
                        )}


                        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                            {/* Displaying the projects */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px',gap:'20px'}}>
                            { rightBoxEditMode && tempProjects.map((project, index) => (
                                    <div 
                                    style={{
                                         minWidth: '150px', height: '150px', boxShadow: '0px 0px 4px 0px #00000040 ',
                                        borderRadius: '16px',cursor:'pointer'
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
                                { !rightBoxEditMode && projects.map((project, index) => (
                                    <div onClick={()=>{
                                         window.open(project,'_blank')
                                    }}
                                    style={{
                                         minWidth: '150px', height: '150px', boxShadow: '0px 0px 4px 0px #00000040 ',
                                        borderRadius: '16px',cursor:'pointer'
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

                            {rightBoxEditMode && (
                                <div className="box-container">
                                    <input
                                        style={{padding:'12px 18px',borderRadius:'16px',border:'1px solid #9c9b9b'}}
                                        type="text"
                                        placeholder="Add ongoing portfolio"
                                        value={newPortfolio}
                                        onChange={(e) => setNewPortfolio(e.target.value)}
                                    />
                                    <button style={{height:'20px',width:'20px',marginLeft:'10px',marginTop:'10px'}} onClick={handleAddPortfolio}>+</button>
                                </div>
                            )}

                            {/* Displaying the portfolio values */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px',gap:'20px' }}>
                            {rightBoxEditMode && tempPortfolios.map((portfolio, index) => (
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
                                {!rightBoxEditMode && portfolios.map((portfolio, index) => (
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


                        {rightBoxEditMode && (
                            <div>
                                <div className="buttons-container">
                                    <div >
                                        <button className='cancel-button' onClick={handleCancelRight}>Cancel </button>
                                    </div>
                                    <div >
                                        <button className='save-button' onClick={handleSaveRight}>Save</button>
                                    </div>
                                </div>
                            </div>
                        )}
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
        </div>
    )
};
export default FreelancerProfile;
