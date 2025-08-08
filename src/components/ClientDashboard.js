import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import Toolbar from "@mui/material/Toolbar";
import BAPI from "../helper/variable";
import Freelancerwallet from "./Freelancerwallet";
import "../styles/freelancerdashboard.css";
import ClientHome from "./ClientHome";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import NavDash from "./NavDashClient";

export default function ClientDashboard(props) {
  let { "*": section } = useParams();
  if (!section) {
    section = "";
  }

  const container1 = useRef();
  const accessToken = localStorage.getItem("accessToken");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { pathname } = useLocation();
  const container2 = useRef();



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
