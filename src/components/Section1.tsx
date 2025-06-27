import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { shades } from "../helper/shades";
import section1Text from "../assets/section1Text.svg";
import section1TextCircle from "../assets/section1TextCircle.svg";
import section1Landing from "../assets/section1Landing.webp";
import Lottie from "react-lottie";
import * as animationData from "../jsonAnimations/section1CircleAnimation.json";
import "animate.css";
import useScrollToContactUsHook from "../customHooks/useScrollToContactUsHook";
import { useNavigate } from "react-router-dom";

function Section1() {
  const accessToken = localStorage.getItem('accessToken');
  const { dustyOrange, lavender, black, white, silverTree, racingGreen } =
    shades;
  const scrollToSection = useScrollToContactUsHook();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const navigate=useNavigate();

  return (
    <Grid
      sx={{
        minHeight: { xs: "90vh" },
        maxHeight: { md: "90vh" },
        width: "100vw",
        background: dustyOrange,
        padding: { xs: "36px 24px", md: "56px 48px" },
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "6fr 4fr" },
      }}
    >
      <Box className="animate__animated animate__fadeInLeft">
        <Box
          sx={{
            padding: { xs: "0", md: "auto" },
            width: "90%",
            margin: { md: "auto",xl:"auto" },
          }}
        >
          <Box sx={{  margin: "auto" }}>
          
            <Typography
              sx={{
                typography: {xs:"font_24_800", md: "font_64_800" },
                lineHeight: { xs: "", md: "82px" },
                margin: "auto",
                zIndex: 4,
                position:'relative',
                
              }}
            >
              Be the <span style={{position:"relative"}}><Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
          
                height: "120px",
                width: "220px",
                left: {xs:"-20%",xl:'0px'},
                top: "-40%",
                right: "0",
                margin: "auto",
                rotate: "-10deg",
                zIndex: -1,
              }}
            >
            <Lottie options={defaultOptions} height={"100%"} width="100%" />
          </Box>pioneer</span>
              <br /> in navigating your <br /> <span style={{color:white}}>freelance</span>  journey
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: "90%",
            margin: { xs: "12px 0", md: "24px auto" },
          }}
        >
          <Typography
            sx={{ typography: { xs: "font_12_500", md: "font_20_500" } }}
          >
            Unlock a world where opportunities, learning and community converge
            to evaluate your freelancing career.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "90%",
            margin: "auto",
            padding: { xs: "0", md: "24px 0" },
            display: "flex",
            gap: "24px",
          }}
        >
          <Button
            sx={{
              border: `1px solid ${black}`,
              background: white,
              borderRadius: "16px",
              padding: { xs: "8px 0", md: "12px 24px" },
              typography: { xs: "font_12_700", md: "font_20_700" },
              color: black,
              width: { xs: "120px", md: "200px" },
              cursor: "pointer",
              //   "&:hover": {
              //     background: dustyOrange,
              //     color: white,
              //     border: `1px solid ${white}`,
              //   },
            }}
            onClick={()=>{accessToken!==null? navigate('/postjob') : navigate('/home')}}
          >
            Post a Job
          </Button>

          <Button
            sx={{
              background: dustyOrange,
              color: white,
              border: `1px solid ${white}`,
              padding: { xs: "8px 0", md: "12px 24px" },
              typography: { xs: "font_12_700", md: "font_20_700" },
              borderRadius: "16px",
              width: { xs: "120px", md: "200px" },
              cursor: "pointer",
              //   "&:hover": {
              //     border: `1px solid ${black}`,
              //     background: white,
              //     color:black
              //   },
            }}
            onClick={()=>{accessToken!==null?navigate('/browsejobs'): navigate('/home')}}
          >
            Find Work
          </Button>
        </Box>
      </Box>
      <Box
        sx={{ position: "relative" }}
        className="animate__animated animate__fadeInRight"
      >
        <Box
          sx={{
            width: { xs: "90%", md: "102%" },
            margin: { xs: "24px 0 0 0",md:'0' },
            position: { md: "absolute" },
            left: "-40px",
            right: "200px",
            top: 0,
            bottom: "-0px",
          }}
        >
          <img
            src={section1Landing}
            alt="hero image"
            style={{
              width: "90%",
              objectFit: "contain",
              margin: "auto",
              display: "blohttps://github.com/grull-work/grull-fe_new.gitck",
            }}
          />
          {/* <Lottie options={defaultOptions} height={"100%"} width={"110%"} /> */}
        </Box>
      </Box>
    </Grid>
  );
}

export default Section1;
