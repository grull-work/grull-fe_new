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
import FreelancerHome from './FreelancerHome';
import Freelancerwallet from './Freelancerwallet';
import '../styles/freelancerdashboard.css';
import { CiShare2 } from "react-icons/ci";
import Logo from "../assets/Logo1.png";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Header1 from './Header1';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MdArrowOutward } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import BAPI from '../helper/variable';

interface Props {
  window?: () => Window;
}

export default function FreelancerWalletPage(props: Props) {

  const { windows } = props;
  const [fullname,setFullname]=useState('');
  const [role,setRole]=useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [changeopts,setChangeopts]=useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const avatarBackgroundColor = 'Grey';
  const [activeButton, setActiveButton] = useState('wallet');
  const container = windows !== undefined ? () => windows().document.body : undefined;
  const container1 = useRef();
  const navigate = useNavigate(); 
  const { pathname } = useLocation();

  useEffect(() => {
      window.scrollTo(0, 0);
  }, [pathname]);
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          setFullname(responseData.full_name);
          setRole(responseData.role);
        } catch (error) {
          console.error('Error during fetching data:', error);
        }
       }
       infofetch();
  },[]);

  const getInitials = (name) => {
    return name[0]?.toUpperCase();
  };

  const handleButtonClick = (e,button) => {
    e.preventDefault()
    let route = '/freelancer';
    if (button === 'wallet') {
      route = '/wallet';
    } else if (button === 'manageJobs') {
      route = '/managejobs/applied';
    }
    navigate(route);
  };


  const clickProfileImage = () => {
    setShowDropdown(!showDropdown);
  }

  const clickLogout = () => {
      console.log("Logging out...");
  }

  const handleClickOutside = (e) => {
      if (container1.current && !container1.current.contains(e.target)) {
          setShowDropdown(false);
      }
  };

  const handlesettings =()=>{
        setChangeopts((prev)=>!prev);
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  const getDrawerWidth = () => {
    if (windowWidth <1075) {
      return 0;
    }if (windowWidth <1150) {
      return 260;
    }if (windowWidth<1350) {
      return 300;
    }
    else{
      return 340;
    }
  };

  const drawer = (
    <div style={{backgroundColor:'#000',paddingLeft:'80px',paddingRight:'40px',height:'100vh'}} className='dashboard-drawer'>
      <Box sx={{display:'flex',padding:'22px 0'}} >
        <img src={Logo} alt='GRULL' style={{ width: '100px', height: '38px' }} />
      </Box>
      <Box sx={{marginTop:'100px'}}>
         <Box sx={{padding:'10px 0px 25px',display:'flex',flexDirection:'row',gap:'18px',alignItems:'center',justifyContent:'center' }}>
         <Avatar
        alt={fullname}
        style={{ backgroundColor: avatarBackgroundColor }}
        onClick={()=>{navigate('/freelancerprofile')}}
      >
        {getInitials(fullname)}
      </Avatar>
             <Grid sx={{display:'flex', flexDirection:'column',gap:'0px'}}>
               <Typography sx={{fontSize:'18px',fontWeight:'500',color:'#fff'}}>{fullname}</Typography>
               <Typography sx={{fontSize:'15px',fontWeight:'500',color:'#fff',opacity:'0.8'}}>{role}</Typography>
             </Grid>
         </Box>
         <Box
            sx={{
              backgroundImage: 'linear-gradient(90deg, #ED8335 0%, #B27EE3 100%)',
              height: '1px',
              width: '100%',
            }}
          />
         <Box sx={{padding:'30px 7px 0',display:'flex',flexDirection:'column',gap:'14px'}}>
              <Button 
                sx={{color:'#fff',textTransform:'none',fontSize:'17px',fontWeight:'500',borderRadius:'16px',justifyContent:'left',paddingLeft:'16px',backgroundColor: activeButton === 'home' ? '#7C7C7C' : 'transparent','&:hover': {backgroundColor: activeButton === 'home' ? '#7C7C7C' : 'transparent',},}} 
                startIcon={<FiHome />} onClick={(e) => handleButtonClick(e,'home')}>Home</Button>
              <Button 
                sx={{color:'#fff',textTransform:'none',fontSize:'17px',fontWeight:'500',borderRadius:'16px',justifyContent:'left',paddingLeft:'16px',backgroundColor: activeButton === 'wallet' ? '#7C7C7C' : 'transparent','&:hover': {backgroundColor: activeButton === 'wallet' ? '#7C7C7C' : 'transparent',},}} 
                startIcon={<IoWalletOutline />} onClick={(e) => handleButtonClick(e,'wallet')} >Wallet</Button>

             <Button
                sx={{color:'#fff',textTransform:'none',fontSize:'17px',fontWeight:'500',borderRadius:'16px',justifyContent:'left',paddingLeft:'16px',backgroundColor: activeButton === 'manageJobs' ? '#7C7C7C' : 'transparent','&:hover': {backgroundColor: activeButton === 'manageJobs' ? '#7C7C7C' : 'transparent',},}} 
                startIcon={<FiShoppingBag />} onClick={(e) => handleButtonClick(e,'manageJobs')} >Manage Jobs</Button>
         </Box>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', }}>
      <CssBaseline />
      <Box sx={{display:'flex',flexDirection:'column'}}>
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
          display:{xs:'block',md:'none'}
        }} >
           <Header1 />
        </Toolbar>
        <Toolbar sx={{
            height:{sm:'80px',xs:'90px'},
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
                <Box
                  sx={{
                    background: 'linear-gradient(90deg, #ED8335 0%, #B27EE3 100%)',
                    // display: 'inline-block',
                    padding: '1px',
                    borderRadius: '17px',
                  }}
                >
                  <Button 
                    sx={{width: '160px',height: '40px',padding: '10px',gap: '10px',background: '#FFF',boxShadow: '0px 0px 4px 0px #00000040',border: 'none', borderRadius: '16px',color:'#000',textTransform: 'none',fontSize:'16px',':hover':{background:"#fff"}}}
                    >Grull Premium
                  </Button>
                </Box>
                <Button
                  sx={{width: '160px',height: '40px',padding: '10px',gap: '10px',background: '#FFF',boxShadow: '0px 0px 4px 0px #00000040',borderRadius: '16px',color:'#000',textTransform: 'none', fontSize:'16px'}}> 
                  {<CiShare2 style={{height:'1.5em',width:'1.3em'}}/>}Share Profile
                </Button>
                <FiMessageSquare style={{color:'#0c0c0c',fontSize:'30px',':hover':{}}} className='resdash' />
                <IoMdNotificationsOutline style={{color:'#414141',fontSize:'35px'}} className='resdash' />
                <Box ref={container1} sx={{position:'relative'}}>
                <Avatar
                  alt={fullname[0]}
                  style={{ backgroundColor: avatarBackgroundColor,cursor:'pointer' }}
                  className='dashboardavatar'
                  onClick={clickProfileImage}
                >
                  {getInitials(fullname)}
                </Avatar>
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
                                                <Avatar
                                                    alt={fullname[0]}
                                                    style={{ backgroundColor: avatarBackgroundColor,width:'80px',height:'80px',marginRight:'10px' }}                    
                                                >
                                                    {getInitials(fullname)}
                                                </Avatar>
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
                                        <Link component={NavLink} to="/freelancer" style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Dashboard</Link>
                                        <Link component={NavLink} to="/freelancer" style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Wallet</Link>
                                        <Link onClick={handlesettings} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Settings</Link>
                                        <Divider style={{ width: '100%',height:'2px',backgroundColor:'#0000004D' }} />
                                        <Link
                                            to='/'
                                            onClick={clickLogout}
                                            style={{ backgroundColor: '#fff', textDecoration: 'none', color: 'black', fontWeight: '500', padding: '4px 0', ':hover': { backgroundColor: 'transparent' }, minHeight: '0' }}
                                        >
                                            Logout
                                        </Link>
                                          </>) : 
                                          (<>
                                        <Link component={NavLink} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:{xs:'2px 0'},marginTop:'5px',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Find Work</Link>
                                        <Link component={NavLink} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Learn</Link>
                                        <Link component={NavLink} style={{backgroundColor:'#fff', textDecoration: 'none', color: 'black',fontWeight:'500',padding:'2px 0',':hover':{backgroundColor:'transparent'},minHeight:'0' }}>Collaborate</Link>
                                        <Link style={{padding:'0',marginTop:'5px',':hover':{backgroundColor:'transparent',minHeight:'0'},backgroundColor:'#fff',}}>
                                            <Button endIcon={<MdArrowOutward />} sx={{border: '1px solid #000000',fontWeight:'600',color:'#000000',borderRadius:'16px',padding:'7px 25px'}}>Post a project</Button>
                                        </Link>
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
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
      </Box>
      <Box
        component="main"
        sx={{ py:3, width: { sm: `calc(100% - ${getDrawerWidth()}px)` } }}
      >
        <Toolbar />
        <Freelancerwallet />
      </Box>
    </Box>
  );
}