import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  Button,
  Typography,
  Avatar,
  Grid,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
} from '@mui/material';
import Logo from "../assets/grullLogoPurple.svg";
import mobilelogo from "../assets/grullPurpuleMobileLogo.svg"
import { LuMenu } from "react-icons/lu";
import BAPI from '../helper/variable'
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Header3() {
    const [changeopts,setChangeopts]=useState(false);
    const container = useRef();
    const container1=useRef()
    const [savedName,setSavedName]=useState('');
    const [category,setcategory]=useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const navigate =useNavigate()
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMangejobsDropdown, setshowMangejobsDropdown] = useState(false);
    
    const avatarBackgroundColor = 'Grey';
    const accessToken = localStorage.getItem('accessToken');
    const [profileImage,setProfileImage]=useState(null);
    useEffect(()=>{
        const infofetch=async()=>{
         try {
           const response = await fetch(
             `${BAPI}/api/v0/users/me`,
             {
               method: 'GET',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${accessToken}`,
               },
             }
           );
           const responseData = await response.json();
           setSavedName(responseData.full_name)
           setcategory(responseData.role);
           if(responseData.photo_url && responseData.photo_url!==''){
            setProfileImage(responseData.photo_url);
          }
         } catch (error) {
           console.error('Error during fetching data:', error);
         }
        }
        infofetch();
   },[]);
    const clickProfileImage = () => {
        setShowDropdown((prevState) => (!prevState));
    }
    const dropdownjobs=()=>{
        setshowMangejobsDropdown((prev)=>(!prev));
    }
    const clickLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        navigate('/')
    }
    const handleClickOutside = (e) => {
        if (container.current && !container.current.contains(e.target)) {
            setShowDropdown(false);
        }
        if (container1.current && !container1.current.contains(e.target)) {
            setshowMangejobsDropdown(false);
        }
    };
    // attaches an eventListener to listen when componentDidMount
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        // optionally returning a func in useEffect runs like componentWillUnmount to cleanup
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const viewProfileClick = () => {
        navigate('/freelancerprofile');
    }
    const handlesettings =()=>{
        setChangeopts((prev)=>!prev);
  }
  const handleMangaeJobsClick = ()=>{
    setshowMangejobsDropdown(false)
  }
  return (
    <Grid container sx={{ background: '#000000', height:{xs:'60px', sm:'70px'}, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding : {xs:'0px 4%',md:'0 6%'}, flexWrap: 'nowrap',gap:'50px' }}>
                <Grid item >
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap:{md:'25px',lg:'40px'}, alignItems: 'center' }}>
                       {/* <Typography sx={{color:'#B27EE3'}}>Grull</Typography> */}
                       {isSmallScreen ? (
                            <img src={mobilelogo} alt='GRULL' style={{ width: '60px', height: '38px',cursor:'pointer' }}  onClick={()=>navigate('/')}/>
                        ) : (
                            <img src={Logo} alt='GRULL' style={{ width: '100px', height: '38px',cursor:'pointer' }} onClick={()=>navigate('/')} />
                        )}
                    </Box>
                </Grid>

                <Grid item sx={{flex:{xs:'none',md:"1"}}} >
                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap:{md:'20px',lg:'36px'}, alignItems: 'center' }}>
                            <Box sx={{display:{xs:'none',md:'block'}}}>
                                <Button sx={{color:'#fff',fontSize:'16px'}} onClick={()=>navigate('/browsejobs')} >Browse Jobs</Button>
                            </Box>
                            <Box sx={{display:{xs:'none',md:'block',position:'relative'}}} ref={container1}>
                                <Button sx={{color:'#fff',fontSize:'16px'}} onClick={dropdownjobs} endIcon={<RiArrowDropDownLine style={{fontSize:'30px',marginLeft:'-11px'}}/>}>Manage Jobs</Button>
                                {showMangejobsDropdown && (
                                        <Box
                                        sx={{
                                              padding:'15px 20px 15px 20px',
                                              display: showMangejobsDropdown?'block':'none',
                                              position:'absolute',
                                              backgroundColor:'#fff',
                                              zIndex:'1',
                                              top:{xs:'58px',sm:'65px'},
                                              right:{xs:'-55px',sm:'-80px',md:'-30px'},
                                              boxShadow: '0px 0px 4px 1px #00000040',
                                              borderRadius:{xs:'10px',sm:'10px'},
                                              width:{xs:'250px',sm:'170px'},
                                              display:'flex',
                                              flexDirection:'column',
                                              gap:'15px'
                                            }}
                                        >
                                        <Link to="/managejobs/applied" onClick={handleMangaeJobsClick} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Applied Jobs</Link>
                
                                        <Link to="/managejobs/saved" onClick={handleMangaeJobsClick} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Saved Jobs</Link>
                                        <Link to="/managejobs/ongoing" onClick={handleMangaeJobsClick} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Ongoing Jobs</Link>
                                        <Link to="/managejobs/completed" onClick={handleMangaeJobsClick} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Completed Jobs</Link>

                                        
                                        </Box>
                                    )}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap:{xs:'8px',sm:'30px', md:'25px',lg:'36px'}, alignItems: 'center' }}>
                                <IconButton sx={{fontSize:{ xs:'24px',sm:'30px'}}}>
                                   <FiMessageSquare style={{ color: '#fff'}} onClick={()=>navigate('/freelancerchat')} />
                                </IconButton>
                                {/* <IconButton sx={{fontSize:{ xs:'27px',sm:'33px'}}}>
                                   <IoMdNotificationsOutline style={{ color: '#fff'}} />
                                </IconButton> */}
                                <Box ref={container} sx={{position:'relative'}}>
                                {(profileImage && profileImage!=='') ? (
                                        <img
                                            alt={savedName}
                                            src={profileImage}
                                            style={{ borderRadius:'50%',cursor:'pointer',height:'45px',width:'45px',objectFit: 'cover'  }}
                                            onClick={()=>{clickProfileImage()
                                                if (changeopts) {
                                                    handlesettings();
                                                  }
                                            }}
                                        />
                                    ) : (
                                        
                                    <Avatar
                                    alt={savedName}
                                    sx={{ backgroundColor: avatarBackgroundColor,cursor:'pointer' }}
                                    // className='dashboardavatar profile'
                                    onClick={()=>{clickProfileImage()
                                        if (changeopts) {
                                            handlesettings();
                                          }
                                    }}
                                >
                                   {typeof savedName === 'string' && savedName.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()}
                                </Avatar>
                                    )}
                                    {showDropdown && (
                                        <Box
                                        sx={{
                                              padding:'15px 30px 20px 20px',
                                              display: showDropdown?'block':'none',
                                              position:'absolute',
                                              backgroundColor:'#fff',
                                              zIndex:'1',
                                              top:{xs:'58px',sm:'65px'},
                                              right:{xs:'-55px',sm:'-80px',md:'-20px'},
                                              boxShadow: '0px 0px 4px 1px #00000040',
                                              borderRadius:{xs:'10px',sm:'40px'},
                                              width:{xs:'250px',sm:'280px'},
                                              display:'flex',
                                              flexDirection:'column',
                                              gap:'5px'
                                            }}
                                        >
                                        <Box sx={{padding:'2px 0',':hover':{backgroundColor:'transparent'},backgroundColor:'#fff',}}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {(profileImage && profileImage!=='') ? (
                                        <img
                                            alt={savedName}
                                            src={profileImage}
                                            style={{ borderRadius:'50%',width:'80px',height:'80px',marginRight:'10px',objectFit: 'cover'   }}
                                            
                                        />
                                    ) : (
                                        <Avatar
                                                    alt={savedName}
                                                    style={{ backgroundColor: avatarBackgroundColor,width:'80px',height:'80px',marginRight:'10px' }}                    
                                                >
                                                   {typeof savedName === 'string' && savedName.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase()}
                                                </Avatar>
                                    )}
                                                <div style={{ marginRight: '30px', display: 'flex', flexDirection: 'column' }}>
                                                    <Typography style={{ margin: '0', fontWeight:'700',fontSize:'20px'}}>{savedName}</Typography>
                                                    <Typography style={{ margin: '0',color:'#454545',fontWeight:'500',fontSize:'16px'}}>{category}</Typography>
                                                </div>
                                            </div>
                                        </Box>
                                        <Link to='/freelancerprofile' style={{padding:'0',marginTop:'5px',':hover':{backgroundColor:'transparent',minHeight:'0'},backgroundColor:'#fff',}}>
                                            <Button sx={{border: '1px solid #B27EE3',fontWeight:'600',color:'#B27EE3',width:'100%',borderRadius:'16px'}}>View Profile</Button>
                                        </Link>
                                        {
                                            !changeopts? (<>
                                            <Link component={NavLink} to="/freelancer" style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Dashboard</Link>
                                            <Link component={NavLink} to="/freelancer/wallet" style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Wallet</Link>
                                            <Link onClick={()=>setChangeopts(!changeopts)} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Settings</Link>
                                            <Divider style={{ width: '100%',height:'2px',backgroundColor:'#0000004D' }} />
                                            <Link
                                                to='/'
                                                onClick={clickLogout}
                                                style={{ backgroundColor: '#fff', textDecoration: 'none', color: 'black', fontWeight: '500', padding: '4px 0', ':hover': { backgroundColor: 'transparent' }, minHeight: '0' }}
                                            >
                                                Logout
                                            </Link>
                                            </>):(<>
                                        <Link to='/browsejobs' style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Browse Jobs</Link>
                                        <Link to='/coming-soon' style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Learn</Link>
                                        <Link to='/coming-soon' style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Collaborate</Link>
                                            </>)
                                        }
                                        </Box>
                                    )}
                                </Box>
                                <IconButton sx={{display:{xs:'block',md:'none'}, fontSize:{ xs:'24px',sm:'30px'}}}>
                                   <LuMenu style={{ color: '#fff', }} onClick={clickProfileImage}/>
                                </IconButton>
                            </Box>
                        </Box>
                </Grid>
    </Grid>
  )
}
