import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Typography,
  Button,
  Avatar,
  CssBaseline,
  Grid,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { CiShare2 } from 'react-icons/ci';
import { FiMessageSquare, FiHome, FiShoppingBag } from 'react-icons/fi';
import { IoNotificationsOutline, IoWalletOutline } from 'react-icons/io5';
import Logo from "../assets/grullLogoPurple.svg";
import { useNavigate, NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import BAPI from '../helper/variable';
import { IoIosClose } from "react-icons/io";

export default function DashboardLayout({ children, section }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const accessToken = localStorage.getItem('accessToken');
  const [fullname, setFullname] = useState('');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [userId, setUserId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [changeopts, setChangeopts] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsSeen, setNotificationsSeen] = useState(true);
  const category = role;
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const resp = await fetch(`${BAPI}/api/v0/users/me`, {
          headers: { 'Content-Type':'application/json', Authorization:`Bearer ${accessToken}` }
        });
        const data = await resp.json();
        setFullname(data.full_name||'');
        setRole(data.role||'');
        setUserId(data.id);
        if (data.photo_url) setProfileImage(data.photo_url);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const resp = await fetch(`${BAPI}/api/v0/notifications/get-notification`, {
          headers: { 'Content-Type':'application/json', Authorization:`Bearer ${accessToken}` }
        });
        const data = await resp.json();
        const sorted = Array.isArray(data)
          ? data.slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
          : [];
        setNotifications(sorted);
        setNotificationsSeen(!sorted.some(n=>!n.isSeen));
      } catch(e){ console.error(e); }
    })();
  }, []);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return ()=>window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setChangeopts(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return ()=>document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clickProfileImage = ()=> setShowDropdown(p=>!p);
  const clickLogout = ()=>{ localStorage.removeItem('accessToken');localStorage.removeItem('user');navigate('/'); };
  const handleShareProfile = ()=>{
    if (!userId) return toast.error('User ID not available');
    const url=`https://grull.work/freelancer/profile/${userId}`;
    navigator.clipboard.writeText(url)
      .then(()=>toast.success('URL copied')).catch(()=>toast.error('Could not copy URL'));
  };
  const UpdateNotificationStatus = async()=>{
    if (!accessToken) return;
    const unseen = notifications.filter(n=>!n.isSeen);
    for(const notif of unseen){
      await axios.post(
        `${BAPI}/api/v0/notifications/update-notification-status?notification_id=${notif.id}`,
        {}, { headers: { Authorization:`Bearer ${accessToken}` } }
      );
    }
    setNotificationsSeen(true);
  };
  const handleNotificationIconClick = ()=>{
    setNotificationModalOpen(p=>!p);
    setMobileOpen(false);
    if (!notificationsSeen) UpdateNotificationStatus();
  };
  const handleButtonClick = btn=>{
    const map={home:'/freelancer',wallet:'/freelancer/wallet',manageJobs:'/managejobs/applied'};
    navigate(map[btn]);
    setMobileOpen(false);
  };
  const stringToColor = str=>{
    let hash=0; for(let i=0;i<str.length;i++) hash=str.charCodeAt(i)+((hash<<5)-hash);
    let color='#'; for(let i=0;i<3;i++){ const val=(hash>>(i*8))&0xff; color+=(`00${val.toString(16)}`).slice(-2);}
    return color;
  };
  const avatarBackgroundColor = fullname?stringToColor(fullname):'grey';
  const savedName = fullname||'User';
  const isDesktop = windowWidth>1075;
  const getDrawerWidth=()=>{
    if(windowWidth<1075)return 0;
    if(windowWidth<1150)return 260;
    if(windowWidth<1350)return 300;
    return 340;
  };

const drawer = (
  <div
    style={{
      backgroundColor: '#000',
      paddingLeft: '40px',
      paddingRight: '40px',
      height: '100vh',
      width: '100%',
      maxWidth: '339px'
    }}
    className="dashboard-drawer"
  >
    <Box sx={{ display: 'flex', padding: '22px 0' }}>
      <img
        src={Logo}
        alt="GRULL"
        style={{ width: '100px', height: '38px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      />
    </Box>

    <Box sx={{ marginTop: '100px' }}>
      <Box
        sx={{
          padding: '10px 0px 25px',
          display: 'flex',
          flexDirection: 'row',
          gap: '18px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {profileImage ? (
          <img
            alt={fullname}
            src={profileImage}
            style={{
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              objectFit: 'cover'
            }}
          />
        ) : (
          <Avatar
            alt={fullname}
            style={{ backgroundColor: avatarBackgroundColor }}
          >
            {fullname?.split(' ').slice(0, 2).map(part => part[0]).join('')}
          </Avatar>
        )}
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: '500', color: '#fff' }}>{fullname}</Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: '500', color: '#fff', opacity: '0.8' }}>{role}</Typography>
        </Grid>
      </Box>

      <Box
        sx={{
          backgroundImage: 'linear-gradient(90deg, #ED8335 0%, #B27EE3 100%)',
          height: '1px',
          width: '100%',
        }}
      />

      <Box sx={{ padding: {xs:'15px 4px 0' ,md:'30px 7px 0'}, display: 'flex', flexDirection: 'column', gap: {sm:"4px",md:'14px' }}}>
        <Button
          sx={{
            color: '#fff',
            textTransform: 'none',
            fontSize: '17px',
            fontWeight: '500',
            borderRadius: '16px',
            justifyContent: 'left',
            paddingLeft: '16px',
            backgroundColor: section === 'home' ? '#7C7C7C' : 'transparent',
            '&:hover': {
              backgroundColor: section === 'home' ? '#7C7C7C' : 'transparent',
            },
          }}
          startIcon={<FiHome />}
          onClick={() => handleButtonClick('home')}
        >
          Home
        </Button>

        <Button
          sx={{
            color: '#fff',
            textTransform: 'none',
            fontSize: '17px',
            fontWeight: '500',
            borderRadius: '16px',
            justifyContent: 'left',
            paddingLeft: '16px',
            backgroundColor: section === 'wallet' ? '#7C7C7C' : 'transparent',
            '&:hover': {
              backgroundColor: section === 'wallet' ? '#7C7C7C' : 'transparent',
            },
          }}
          startIcon={<IoWalletOutline />}
          onClick={() => handleButtonClick('wallet')}
        >
          Wallet
        </Button>

        <Button
          sx={{
            color: '#fff',
            textTransform: 'none',
            fontSize: '17px',
            fontWeight: {xs:"300",sm:'500'},
            borderRadius: '16px',
            justifyContent: 'left',
            paddingLeft: '16px',
            backgroundColor: section === 'manageJobs' ? '#7C7C7C' : 'transparent',
            '&:hover': {
              backgroundColor: section === 'manageJobs' ? '#7C7C7C' : 'transparent',
            },
          }}
          startIcon={<FiShoppingBag />}
          onClick={() => handleButtonClick('manageJobs')}
        >
          Manage Jobs
        </Button>
      <Button
        sx={{
            color: '#fff',
            textTransform: 'none',
            fontSize: '17px',
            fontWeight: '500',
            borderRadius: '16px',
            justifyContent: 'left',
            paddingLeft: '16px',
          }}
        startIcon={<CiShare2 color="#fff" />}
        onClick={handleShareProfile}
        // sx={{
        //   color: '#fff',
        //   textTransform: 'none',
        //   justifyContent: 'flex-start'
        // }}
      >
        Share
      </Button>
      <Button
        startIcon={<FiMessageSquare color="#fff" />}
        onClick={()=>navigate('/freelancerchat')}
        sx={{
          color: '#fff',
          textTransform: 'none',
          justifyContent: 'flex-start'
        }}
      >
         Messages
      </Button>

      <Button
        startIcon={<IoNotificationsOutline color="#fff" />}
        onClick={handleNotificationIconClick}
        sx={{
          color: '#fff',
          textTransform: 'none',
          justifyContent: 'flex-start'
        }}
      >
         Notifications
      </Button>
    {/* </Box> */}
      </Box>
    </Box>
  </div>
);



  return (
    <Box sx={{ display:'flex' }}>
      <CssBaseline/>
      <AppBar position="fixed"
        sx={{
          width:isDesktop?`calc(100% - ${getDrawerWidth()}px)`:'100%',
          ml:isDesktop?`${getDrawerWidth()}px`:0
        }}>
        <Toolbar sx={{ bgcolor:'#EDEDED', boxShadow:'0 0 4px rgba(0,0,0,0.25)' }}>
          {!isDesktop && (
            <IconButton edge="start" onClick={()=>setMobileOpen(p=>!p)} sx={{ mr:2 }}>
              <MenuIcon/>
            </IconButton>
          )}
          <Typography variant="h5" sx={{ flexGrow:1, color:'black'}}>Dashboard</Typography>
          <Button startIcon={<CiShare2/>} onClick={handleShareProfile} sx={{ textTransform:'none', mr:{xs:"0" ,sm:"2"}, color :'rgb(0, 0, 0)', display:{ xs:'none',sm:"flex"} }}>
            Share Profile
          </Button>
          <IconButton onClick={()=>navigate('/freelancerchat')} sx={{ color:'rgb(12,12,12)', mr:{xs:"2px", sm:2},
          padding:{ xs:"0px", sm:"8px" } }}>
            <FiMessageSquare size={24}/>
          </IconButton>
          <IconButton onClick={handleNotificationIconClick} sx={{ color:'rgb(65, 65, 65)', mr:{xs:"2px",sm:2},
            padding:{ xs:"0px", sm:"8px" } }}>
            <IoNotificationsOutline size={24}/>
          </IconButton>

          {/* {!isDesktop && ( */}
            <Box ref={containerRef} sx={{ position:'relative', ml:{xs:"2px",sm:2} }}>
              {profileImage
                ? <img alt={savedName} src={profileImage}
                    style={{ borderRadius:'50%', cursor:'pointer', width:45, height:45, objectFit:'cover' }}
                    onClick={clickProfileImage}/>
                : <Avatar alt={savedName} sx={{ bgcolor:avatarBackgroundColor, cursor:'pointer', width:45, height:45 }}
                    onClick={clickProfileImage}>
                    {savedName.split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase()}
                  </Avatar>
              }
              {showDropdown && (
                <Box
                  sx={{
                    padding:'15px 30px 20px 20px',
                    position:'absolute',
                    top:{ xs:'58px', sm:'65px' },
                    right:0,
                    width:{ xs:'250px', sm:'280px' },
                    bgcolor:'#fff',
                    boxShadow:'0px 0px 4px 1px #00000040',
                    borderRadius:{ xs:'10px', sm:'40px' },
                    display:'flex',
                    flexDirection:'column',
                    gap:'5px',
                    zIndex:1
                  }}
                >
                 <Box
                    sx={{
                      padding: "2px 0",
                      ":hover": { backgroundColor: "transparent" },
                      backgroundColor: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {profileImage && profileImage !== "" ? (
                        <img
                          alt={savedName}
                          src={profileImage}
                          style={{
                            borderRadius: "50%",
                            width: "80px",
                            height: "80px",
                            marginRight: "10px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Avatar
                          alt={savedName}
                          style={{
                            backgroundColor: avatarBackgroundColor,
                            width: "80px",
                            height: "80px",
                            marginRight: "10px",
                          }}
                        >
                          {typeof savedName === "string" &&
                            savedName
                              .split(" ")
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                        </Avatar>
                      )}
                      <div
                        style={{
                          marginRight: "30px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          style={{
                            margin: "0",
                            fontWeight: "700",
                            fontSize: "20px",
                            color: "#454545"
                          }}
                        > 
                        {/* {console.log(savedName)} */}
                          {savedName}
                        </Typography>
                        <Typography
                          style={{
                            margin: "0",
                            color: "#454545",
                            fontWeight: "500",
                            fontSize: "16px",
                          }}
                        >
                          {category}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                  <Link
                    to="/freelancerprofile"
                    style={{
                      padding: "0",
                      marginTop: "5px",
                      ":hover": {
                        backgroundColor: "transparent",
                        minHeight: "0",
                      },
                      backgroundColor: "#fff",
                    }}
                  >
                    <Button
                      sx={{
                        border: "1px solid #B27EE3",
                        fontWeight: "600",
                        color: "#B27EE3",
                        width: "100%",
                        borderRadius: "16px",
                      }}
                    >
                      View Profile
                    </Button>
                  </Link>
                  {!changeopts ? (
                    <>
                      <Link
                        component={NavLink}
                        to="/freelancer"
                        style={{
                          backgroundColor: "#fff",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "500",
                          padding: { xs: "2px 0" },
                          marginTop: "5px",
                          ":hover": { backgroundColor: "transparent" },
                          minHeight: "0",
                        }}
                      >
                        Dashboard
                      </Link>
                      <Link
                        component={NavLink}
                        to="/freelancer/wallet"
                        style={{
                          backgroundColor: "#fff",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "500",
                          padding: "2px 0",
                          ":hover": { backgroundColor: "transparent" },
                          minHeight: "0",
                        }}
                      >
                        Wallet
                      </Link>
                      <Link
                        onClick={() => setChangeopts(!changeopts)}
                        style={{
                          backgroundColor: "#fff",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "500",
                          padding: "2px 0",
                          ":hover": { backgroundColor: "transparent" },
                          minHeight: "0",
                        }}
                      >
                        Settings
                      </Link>
                      <Divider
                        style={{
                          width: "100%",
                          height: "2px",
                          backgroundColor: "#0000004D",
                        }}
                      />
                      <Link
                        to="/"
                        onClick={clickLogout}
                        style={{
                          backgroundColor: "#fff",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "500",
                          padding: "4px 0",
                          ":hover": { backgroundColor: "transparent" },
                          minHeight: "0",
                        }}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/browsejobs"
                        style={{
                          backgroundColor: "#fff",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "500",
                          padding: { xs: "2px 0" },
                          marginTop: "5px",
                          ":hover": { backgroundColor: "transparent" },
                          minHeight: "0",
                        }}
                      >
                        Browse Jobs
                      </Link>
                      <Link
                        to="/coming-soon"
                        style={{
                          backgroundColor: "#fff",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "500",
                          padding: "2px 0",
                          ":hover": { backgroundColor: "transparent" },
                          minHeight: "0",
                        }}
                      >
                        Learn
                      </Link>
                      <Link
                        to="/coming-soon"
                        style={{
                          backgroundColor: "#fff",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "500",
                          padding: "2px 0",
                          ":hover": { backgroundColor: "transparent" },
                          minHeight: "0",
                        }}
                      >
                        Collaborate
                      </Link>
                    </>
                  )}
                </Box>
              )}
            </Box>
          {/* )} */}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width:{ sm:getDrawerWidth() }, flexShrink:{ sm:0 } }}>
        <Drawer
          variant={isDesktop?'permanent':'temporary'}
          open={isDesktop?true:mobileOpen}
          onClose={()=>setMobileOpen(false)}
          PaperProps={{
    style: {
      width: isDesktop ? getDrawerWidth() : 200
    }
  }}
          ModalProps={{
            keepMounted:true,
            BackdropProps:{ style:{ backgroundColor:'rgba(237, 232, 232, 0.1)' } }
          }}
          sx={{
            '& .MuiDrawer-paper':{ width:getDrawerWidth(), boxSizing:'border-box' },
            display:{ xs:isDesktop?'none':'block', sm:'block' }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow:1, p:3, mt:'80px' }}>
        {children}
      </Box>

      {notificationModalOpen && (
        <Box sx={{
          position:'fixed', top:'60px', right:'20px', width:300,
          maxHeight:'400px', overflowY:'auto', bgcolor:'#fff',
          boxShadow:3, borderRadius:2, zIndex:1400
        }}>
          <Box sx={{ p:1, borderBottom:'1px solid #ddd' }}>
            <Typography variant="subtitle1">Notifications</Typography>
          </Box>
          {notifications.length===0
            ? <Box sx={{ p:2 }}><Typography>No notifications</Typography></Box>
            : notifications.map(n=>(
                <Box key={n.id} sx={{
                  p:1, borderBottom:'1px solid #eee',
                  backgroundColor:n.isSeen?'inherit':'rgba(0,0,255,0.05)'
                }}>
                  <Typography variant="body2">{n.message||n.title}</Typography>
                  <Typography variant="caption">{new Date(n.created_at).toLocaleString()}</Typography>
                </Box>
              ))
          }
        </Box>
      )}
    </Box>
  );
}
