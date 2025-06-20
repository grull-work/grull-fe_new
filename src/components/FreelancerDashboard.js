import React,{useEffect, useRef, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button,Divider,Grid } from '@mui/material';
import { FiHome } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi"
import Avatar from '@mui/material/Avatar';
import {useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FreelancerHome from './FreelancerHome';
import Freelancerwallet from './Freelancerwallet';
import '../styles/freelancerdashboard.css';


import { useLocation } from 'react-router-dom';
import BAPI from '../helper/variable'
import { useParams } from 'react-router-dom';

import NavDash from './NavDashFreelancer'; // Import the NavDash component



export default function FreelancerDashboard(props) {

  let { '*' : section } = useParams();
  if(!section){
    section=''
  }

  const { windows } = props;
  const [fullname,setFullname]=useState('');
  const [role,setRole]=useState('');
  const [profileImage,setProfileImage]=useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const avatarBackgroundColor = 'Grey';
  const container = windows !== undefined ? () => windows().document.body : undefined;
  const container1 = useRef();
  const navigate = useNavigate(); 
  const [prof,setProf]=useState();
  const { pathname } = useLocation();

  const container2 = useRef();


  const getDrawerWidth = () => {
    if (windowWidth < 1075) return 0;
    if (windowWidth < 1150) return 260;
    if (windowWidth < 1350) return 300;
    return 340;
  };

    useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
      window.scrollTo(0, 0);
  }, [pathname]);
  

  return (
    <Box sx={{ display: 'flex', }}>
      <CssBaseline />
      {/* <Box sx={{display:'flex',flexDirection:'column'}}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${getDrawerWidth()}px)` },
          ml: { sm: `${getDrawerWidth()}px` }
        }}
      >
        <Toolbar sx={{
          width:'100%',
          padding:"0",
          // display: 'block'
          display:{xs:'block',md:'none'}
        }} >
           <Header1 />
        </Toolbar>
        <Toolbar sx={{
            height:{sm:'80px',xs:'60px'},
            backgroundColor:'#EDEDED',
            boxShadow:" 0px 0px 4px 0.5px #00000040",
        }}>
          <Box sx={{
            display:'flex',
            justifyContent:'space-between',
            width:'100%',
            padding:'0 70px 0 60px'
          }}  className='dashboard-navbar-con'>
            <Box >
                <Typography style={{
                    // fontFamily: 'Urbanist',
                    fontSize: '40px',
                    fontWeight: 780,
                    color:'#000000',
                    lineHeight: '58px',
                    letterSpacing: '-2px',
                    textAlign: 'left', }} >
                Dashboard </Typography>
            </Box>
            <Box sx={{display:'flex',gap:'40px',alignItems:'center'}} className='dashboard-navbar-buttons'>
                 <Button
                  sx={{width: '160px',height: '40px',padding: '10px',gap: '10px',background: '#FFF',boxShadow: '0px 0px 4px 0px #00000040',borderRadius: '16px',color:'#000',textTransform: 'none', fontSize:'16px'}} onClick={()=>handleShareProfile()} > 

                  {<CiShare2 style={{height:'1.5em',width:'1.3em'}}/>}  Share Profile
                </Button>
                <ToastContainer />
                <FiMessageSquare style={{color:'#0c0c0c',fontSize:'30px',cursor:'pointer'}} onClick={()=>navigate('/freelancerchat')} className='resdash' />
                <Box ref={container2} sx={{position:'relative'}} onClick={()=>{setNotificationmodel(!notificationmodel);UpdateNotificationStatus()}}>
                  
                     <IoMdNotificationsOutline style={{color:'#414141',fontSize:'35px',cursor:'pointer'}} className='resdash' />
                     {!notificationsSeen && ( // Render red dot if notificationSeen is false
                        <div
                            style={{
                                position: 'absolute',
                                top: '5px', // Adjust the position of the dot as needed
                                right: '5px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: 'red',
                            }}
                        />
                    )}
                     {
                      notificationmodel && (
                        <Box
                           sx={{
                                padding:'15px',
                                display: notificationmodel?'block':'none',
                                position:'absolute',
                                backgroundColor:'#fff',
                                zIndex:'1',
                                top:{xs:'58px',sm:'65px'},
                                right:{xs:'-55px',sm:'-80px',md:'-20px'},
                                boxShadow: '0px 0px 4px 1px #00000040',
                                borderRadius:'10px',
                                width:{xs:'250px',sm:'280px'},
                                maxHeight:'250px',
                                overflow:'auto'
                            }}>
                              {
                              notifications.length===0?(<p style={{textAlign:'center',color:'#000000'}}>No notifications received.</p>):(
                              <Box>{notifications.map((notification,index)=>(
                                <>
                                   <Box key={index} sx={{padding:'5px',backgroundColor: notification.isSeen ? '#fff' : '#f0f0f0',}}>
                                      <Typography sx={{fontSize:'14px',fontWeight:'600',color:'#000',}}>{notification.title}</Typography>
                                      <Typography sx={{fontSize:'12px',fontWeight:'400',color:'#000',}}>{notification.content}</Typography>
                                   </Box>
                                    <Divider />
                                    </>
                                  ))}
                                </Box>)
                              }
                                  
                            </Box>
                      )
                     }
                </Box>
                <Box ref={container1} sx={{position:'relative'}}>

                {(profileImage && profileImage!=='') ? (
                                        <img
                                        className='resdash'
                                            // className='user-picture-img'
                                            alt={fullname[0]}
                                            src={profileImage}
                                            style={{ borderRadius:'50%',cursor:'pointer',width:'50px',height:'50px',objectFit: 'cover'  }}
                                            onClick={() => { 
                                              setShowDropdown(!showDropdown); 
                                              if (changeopts) {
                                                handlesettings();
                                              }
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                        className='resdash'
                                            // className='user-picture-img'
                                            onClick={() => { 
                                              setShowDropdown(!showDropdown); 
                                              if (changeopts) {
                                                handlesettings();
                                              }
                                            }}
                                            alt={fullname[0]}
                                            style={{ backgroundColor: avatarBackgroundColor,cursor:'pointer' }}
                                        >
                                            {fullname?.split(' ').slice(0, 2).map(part => part[0]).join('')}
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
                                                      // className='user-picture-img'
                                                      alt={fullname[0]}
                                                      src={profileImage}
                                                      style={{ borderRadius:'50%',width:'80px',height:'80px',marginRight:'10px',objectFit: 'cover'   }}
                                                  />
                                              ) : (
                                                  <Avatar
                                                      // className='user-picture-img'
                                                      alt={fullname}
                                                      style={{ backgroundColor: avatarBackgroundColor,width:'80px',height:'80px',marginRight:'10px'  }}
                                                  >
                                                      {fullname?.split(' ').slice(0, 2).map(part => part[0]).join('')}
                                                  </Avatar>
                                              )}
                                                <div style={{ marginRight: '30px', display: 'flex', flexDirection: 'column' }}>
                                                    <Typography style={{ margin: '0', fontWeight:'700',fontSize:'20px',color:'#000000'}}>{fullname}</Typography>
                                                    <Typography style={{ margin: '0',color:'#454545',fontWeight:'500',fontSize:'16px'}}>{role}</Typography>
                                                </div>
                                            </div>
                                        </Box>
                                        <Link to="/freelancerprofile" style={{padding:'0',marginTop:'5px',':hover':{backgroundColor:'transparent',minHeight:'0'},backgroundColor:'#fff',}}>
                                            <Button sx={{border: '1px solid #B27EE3',fontWeight:'600',color:'#B27EE3',width:'100%',borderRadius:'16px'}}>View Profile</Button>
                                        </Link>
                                        {
                                          !changeopts? 
                                          (<>
                                        <Link to="/freelancer" style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Dashboard</Link>
                                        <Link to="/freelancer/wallet" style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Wallet</Link>
                                        <Link onClick={handlesettings} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Settings</Link>
                                        <Divider style={{ width: '100%',height:'2px',backgroundColor:'#0000004D' }} />
                                        <Link to="/"
                                            style={{ backgroundColor: '#fff', textDecoration: 'none', color: 'black', fontWeight: '500', padding: '4px 0', ':hover': { backgroundColor: 'transparent' }, minHeight: '0' }}
                                        >
                                            <div onClick={clickLogout} style={{ cursor: 'pointer' }}>Logout</div>
                                        </Link>
                                          </>) : 
                                          (<>
                                            <Link to='/managejobs/applied' style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Manage Jobs</Link>
                                        <Link to='/browsejobs' style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Find Work</Link>
                                        <Link to='/coming-soon' style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Learn</Link>
                                        <Link to='/coming-soon' style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Collaborate</Link>
                                          </>)
                                        }
                                        </Box>
                                    )}

                                    </Box>
            </Box>
            </Box>
        </Toolbar>
      </AppBar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: getDrawerWidth() }, flexShrink: { sm: 0 }, backgroundColor:'#000' }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. 
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            backgroundColor:'#000',
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: getDrawerWidth() },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: getDrawerWidth() },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box> */}
      <NavDash section={"Home"}
      />

    {/* Left-side Drawer (active only for width > 1075) */}
      <Box
        component="main"
        sx={{ py:3, width: { sm: `calc(100% - ${getDrawerWidth()}px)` } }}
      >
        <Toolbar />
        {section === '' && (
          <FreelancerHome />
        )}
        {section === 'wallet' && (
          <Freelancerwallet />
        )}
      </Box>
    </Box>
  );
}