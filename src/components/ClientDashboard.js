import React, { useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Logo from "../assets/grullLogoPurple.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Divider, Grid } from "@mui/material";
import { FiHome } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import BAPI from "../helper/variable";
import { FiShoppingBag } from "react-icons/fi";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import Freelancerwallet from "./Freelancerwallet";
import "../styles/freelancerdashboard.css";
import ClientHome from "./ClientHome";
import { CiShare2 } from "react-icons/ci";
import { FiMessageSquare } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Header1 from "./Header1";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavDash from "./NavDashClient";

export default function ClientDashboard(props) {
  let { "*": section } = useParams();
  if (!section) {
    section = "";
  }
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const avatarBackgroundColor = "Grey";
  const [profileImage, setProfileImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const container1 = useRef();
  const [changeopts, setChangeopts] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [prof, setProf] = useState();
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [notificationmodel, setNotificationmodel] = useState(false);
  const container2 = useRef();
  const [notificationsSeen, setNotificationsSeen] = useState(true);

  const UpdateNotificationStatus = async () => {
    try {
      for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        if (!notification.isSeen) {
          await axios.post(
            `${BAPI}/api/v0/notifications/update-notification-status?notification_id=${notification.id}`,
            {}, // empty data object
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }
      }
      setNotificationsSeen(true);
    } catch (error) {
      console.error("Error during updating notifications:", error);
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetch(
          `${BAPI}/api/v0/notifications/get-notification`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const responseData = await response.json();
        const sortedData = responseData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNotifications(sortedData);
        for (let i = 0; i < responseData.length; i++) {
          if (responseData[i].isSeen === false) {
            setNotificationsSeen(false);
            break;
          }
        }
      } catch (error) {
        console.error("Error during fetching notifications:", error);
      }
    };
    getNotifications();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clickLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleClickOutside = (e) => {
    if (container1.current && !container1.current.contains(e.target)) {
      setShowDropdown(false);
    }
    if (container2.current && !container2.current.contains(e.target)) {
      setNotificationmodel(false);
    }
  };

  const handlesettings = () => {
    setChangeopts((prev) => !prev);
  };

  const handleButtonClick = (button) => {
    // setActiveButton(button);
    if (button === "home") {
      navigate("/client");
    }
    if (button === "wallet") {
      navigate("/client/wallet");
    }
    if (button === "manageJobs") {
      navigate("/clientmanagejobs/posted");
    }
  };

  useEffect(() => {
    const infofetch = async () => {
      try {
        const response = await fetch(`${BAPI}/api/v0/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const responseData = await response.json();
        setFullname(responseData.full_name);
        setRole(responseData.role);
        setProf(responseData.id);
        if (responseData.photo_url && responseData.photo_url !== "") {
          setProfileImage(responseData.photo_url);
        }
        localStorage.setItem("user", JSON.stringify(responseData));
        console.log(localStorage.getItem("user"));
      } catch (error) {
        console.error("Error during fetching data:", error);
      }
    };
    infofetch();
  }, []);

  const handleShareProfile = () => {
    const url = `${process.env.REACT_APP_BACKEND}/client/profile/${prof}`;
    // const url = `http://localhost:3000/client/${prof}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("URL copied to clipboard");
        toast.success("URL copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy URL: ", err);
        toast.error("Could not copy URL");
      });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { windows } = props;
  const container =
    windows !== undefined ? () => windows().document.body : undefined;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const getDrawerWidth = () => {
    if (windowWidth < 1075) {
      return 0;
    }
    if (windowWidth < 1150) {
      return 260;
    }
    if (windowWidth < 1350) {
      return 300;
    } else {
      return 340;
    }
  };

  const drawer = (
    <div
      style={{
        backgroundColor: "#000",
        paddingLeft: "80px",
        paddingRight: "40px",
        height: "100vh",
      }}
      className="dashboard-drawer"
    >
      <Box sx={{ display: "flex", padding: "22px 0" }}>
        <img
          src={Logo}
          alt="GRULL"
          style={{ width: "100px", height: "38px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </Box>
      <Box sx={{ marginTop: "100px" }}>
        <Box
          sx={{
            padding: "10px 0px 25px",
            display: "flex",
            flexDirection: "row",
            gap: "18px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {profileImage && profileImage !== "" ? (
            <img
              // className='user-picture-img'
              alt={fullname[0]}
              src={profileImage}
              style={{
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Avatar
              // className='user-picture-img'
              alt={fullname}
              style={{ backgroundColor: avatarBackgroundColor }}
            >
              {fullname
                ?.split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </Avatar>
          )}
          <Grid sx={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "500", color: "#fff" }}
            >
              {fullname}
            </Typography>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: "500",
                color: "#fff",
                opacity: "0.8",
              }}
            >
              {role}
            </Typography>
          </Grid>
        </Box>
        <Box
          sx={{
            backgroundImage: "linear-gradient(90deg, #ED8335 0%, #B27EE3 100%)",
            height: "1px",
            width: "100%",
          }}
        />
        <Box
          sx={{
            padding: "30px 7px 0",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Button
            sx={{
              color: "#fff",
              textTransform: "none",
              fontSize: "17px",
              fontWeight: "500",
              borderRadius: "16px",
              justifyContent: "left",
              paddingLeft: "16px",
              backgroundColor: section === "" ? "#7C7C7C" : "transparent",
              "&:hover": {
                backgroundColor: section === "" ? "#7C7C7C" : "transparent",
              },
            }}
            startIcon={<FiHome />}
            onClick={() => handleButtonClick("home")}
          >
            Home
          </Button>
          <Button
            sx={{
              color: "#fff",
              textTransform: "none",
              fontSize: "17px",
              fontWeight: "500",
              borderRadius: "16px",
              justifyContent: "left",
              paddingLeft: "16px",
              backgroundColor: section === "wallet" ? "#7C7C7C" : "transparent",
              "&:hover": {
                backgroundColor:
                  section === "wallet" ? "#7C7C7C" : "transparent",
              },
            }}
            startIcon={<IoWalletOutline />}
            onClick={() => handleButtonClick("wallet")}
          >
            Wallet
          </Button>
          <Button
            sx={{
              color: "#fff",
              textTransform: "none",
              fontSize: "17px",
              fontWeight: "500",
              borderRadius: "16px",
              justifyContent: "left",
              paddingLeft: "16px",
              backgroundColor:
                section === "manageJobs" ? "#7C7C7C" : "transparent",
              "&:hover": {
                backgroundColor:
                  section === "manageJobs" ? "#7C7C7C" : "transparent",
              },
            }}
            startIcon={<FiShoppingBag />}
            onClick={() => handleButtonClick("manageJobs")}
          >
            Manage Jobs
          </Button>
        </Box>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
        <NavDash section = "Home"/>
      <Box
        component="main"
        sx={{ py: 3, width: { sm: `calc(100% - ${getDrawerWidth()}px)` } }}
      >
        <Toolbar />
        {section === "" && <ClientHome />}
        {section === "wallet" && <Freelancerwallet />}
      </Box>
    </Box>
  );
}
