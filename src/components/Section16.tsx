import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import section16BottomLines from "../assets/section16BottomLines.svg";
import section16CharacterSale from "../assets/section16CharacterSale.webp";
import { shades } from "../helper/shades";
import { section16BasicPlan, section16PremiumPlan } from "../helper/constant";
import crossIcon from "../assets/crossIcon.svg";
import section6GreenTicks from "../assets/section6GreenTicks.svg";
import Lottie from "react-lottie";
import * as animationData from "../jsonAnimations/section16Animation.json";
import useScrollToContactUsHook from "../customHooks/useScrollToContactUsHook";
import { useNavigate } from "react-router-dom";

function Section16() {
  const {
    dustyOrange,
    lavender,
    black,
    royalBlue,
  } = shades;

  const isDesktop = useMediaQuery("(min-width:600px)");
  const scrollToSection = useScrollToContactUsHook();
  const navigate=useNavigate()

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };


  return (
    <Grid
      sx={{
        minHeight: "100vh",
        width: "100vw",
        padding: {xs:"24px 0",sm:"100px 24px 60px 24px"},
        position: "relative",
      }}
    >
      {/* <Box sx={{width:{xs:"256px",md:"440px"},objectFit:'contain',position:{xs:"static",md:"absolute"},top:0,left:'-4%',margin:{xs:"0 auto 24px auto",md:"0"}}}>
      <Lottie options={defaultOptions} height={"100%"} width={"100%"}  />
      </Box> */}
      <img
        src={section16CharacterSale}
        alt="section16CharacterSale"
        style={{
          width:isDesktop?  "440px" : "256px",
          objectFit: "contain",
          position:isDesktop? "absolute" : "static",
          top: "0",
          left: 0,
          margin:isDesktop ? "" : "0 auto 24px auto",
          display:"block"
        }}
      />
      <img
        src={section16BottomLines}
        alt="section16BottomLines"
        style={{
          width: "280px",
          objectFit: "contain",
          position:isDesktop ?  "absolute" : "static",
          bottom:isDesktop ?  "0" : "",
          right: isDesktop ? 0 : "",  
          display:isDesktop ? "block" : "none"
        }}
      />
      <Box sx={{ width:{xs:"100%", md:"80%"}, margin: "auto", textAlign: "center" }}>
        <Typography
          sx={{ textAlign: "center", display: "block",typography:{xs:"font_12_700",md:"font_24_700"} }}
        >
          CHOOSE YOUR PLAN
        </Typography>
        <Typography
          sx={{ textAlign: "center", color: lavender,typography:{xs:"font_24_800",md:"font_48_800"} }}
        >
          Flexible Pricing for Every Freelancer
        </Typography>
      </Box>
      <Box
        sx={{
          width:{xs:"100%", md:"80%"},
          margin: "36px auto",
          display:{xs:"block" ,md:"flex"},
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            border: "2px solid #00000040",
            borderRadius: "24px",
            padding:{xs:"20px", md:"24px 36px"},
            textAlign: "center",
            width:{xs:"80%", md:"40%"},
            margin:{xs:"24px auto",md:"0"}
          }}
        >
          <Typography
            variant="font_28_700"
            sx={{ color: dustyOrange, display: "block" }}
          >
            {section16BasicPlan.title}
          </Typography>
          <Typography
            sx={{ margin:{xs:"12px 0", md:"24px 0 12px 0"}, display: "block",typography:{xs:"font_24_800",md:"font_44_800"} }}
          >
            {section16BasicPlan.price}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 11fr",
            }}
          >
            <Box></Box>
            <Typography sx={{ display: "block",typography:{xs:"font_12_500",md:"font_18_500"} }}>
              {section16BasicPlan.for}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 10fr",
            }}
          >
            <Box></Box>
            <Typography
              sx={{
                display: "block",
                color: lavender,
                textAlign: "left",
                margin:{xs:"8px 0", md:"12px 0"},
                typography:{xs:"font_12_500",md:"font_18_500"}
              }}
            >
              {section16BasicPlan.commission}
            </Typography>
          </Box>
          {section16BasicPlan.feat.map((feature) => {
            return (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 10fr",

                }}
                key={feature.text}
              >
                <Box sx={{ display: "grid", placeContent: "center" }}>
                  <img
                    src={feature.isAvailable ? section6GreenTicks : crossIcon}
                    alt="section6GreenTicks"
                    style={{
                      height:isDesktop ? "24px" :"20px", 
                      width:isDesktop ? "24px" :"20px",
                      margin: "auto",
                      display: "block",
                    }}
                  />
                </Box>
                <Typography
                  variant="font_18_500"
                  sx={{
                    display: "block",
                    color: black,
                    textAlign: "left",
                    margin:{xs:"8px 0", md:"12px 0"},
                    typography:{xs:"font_12_500",md:"font_18_500"}
                  }}
                >
                  {feature.text}
                </Typography>
              </Box>
            );
          })}

          <Box
            sx={{
              width:{xs:"200px", md:"300px"},
              border: "1px solid black",
              borderRadius: "20px",
              padding:{xs:"12px 0", md:"20px 0"},
              margin: "24px auto",
              typography:{xs:"font_12_600", md:"font_18_600"},
              cursor:'pointer'
            }}
            onClick={scrollToSection}
          >
            Choose Plan
          </Box>
        </Box>
        <Box
          sx={{
            border: `2px solid ${lavender}`,
            borderRadius: "24px",
            padding: "12px 36px",
            textAlign: "center",
            width:{xs:"80%", md:"40%"},
            margin:{xs:"12px auto",md:"0"}
          }}
        >
          <Typography variant="font_16_600" sx={{ color: royalBlue }}>
            (PAID YEARLY)
          </Typography>
          <Typography
            variant="font_28_700"
            sx={{ color: royalBlue, display: "block", margin: "0 auto" }}
          >
            {section16PremiumPlan.title}
          </Typography>
          <Box sx={{ margin: "12px 0",display:{xs:"flex",md:""},alignItems:"center",justifyContent:"center"}}>
            <Typography
              sx={{ margin:{xs:"0 4px", md:"24px 12px"}, textDecoration: "line-through",typography:{xs:"font_20_700",md:"font_28_700"} }}
            >
              {section16PremiumPlan.prevPrice}
            </Typography>
            <Typography  sx={{ margin:{xs:"0 4px", md:"24px 12px"},typography:{xs:"font_24_800",md:"font_44_800"} }}>
              {section16PremiumPlan.price}
            </Typography>
            <Typography variant="font_24_600" sx={{ margin: {xs:"0 4px",md:"24px 8px"} }}>
              /month
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 11fr",
            }}
          >
            <Box></Box>

            <Typography
              sx={{ display: "block",typography:{xs:"font_12_500",md:"font_18_500"} }}
            >
              {section16PremiumPlan.for}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 10fr",
              margin: "12px 0",
            }}
          >
            <Box></Box>
            <Typography
              sx={{ display: "block", color: lavender, textAlign: "left",typography:{xs:"font_12_500",md:"font_18_500"} }}
            >
              {section16PremiumPlan.commission}
            </Typography>
          </Box>
          {section16PremiumPlan.feat.map((feature) => {
            return (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 10fr",
                }}
                key={feature.text}
              >
                <Box sx={{ display: "grid", placeContent: "center" }}>
                  <img
                    src={feature.isAvailable ? section6GreenTicks : crossIcon}
                    alt="section6GreenTicks"
                    style={{
                      height:isDesktop ? "24px" : "20px",
                      width: isDesktop ? "24px" : "20px",
                      margin: "auto",
                      display: "block",
                    }}
                  />
                </Box>
                <Typography
                  variant="font_18_500"
                  sx={{
                    display: "block",
                    color: black,
                    textAlign: "left",
                    margin:{xs:"8px 0" ,md:"12px 0"},
                    typography:{xs:"font_12_500",md:"font_18_500"}
                  }}
                >
                  {feature.text}
                </Typography>
              </Box>
            );
          })}
          <Box
            sx={{
              width:{xs:"200px", md:"300px"},
              background: lavender,
              border: "1px solid black",
              borderRadius: "20px",
              padding:{xs:"12px 0", md:"20px 0"},
              margin: "24px auto",
              typography:{xs:"font_12_600", md:"font_18_600"},
              cursor:'pointer'
            }}
            onClick={scrollToSection}
          >
            Choose Plan
          </Box>
        </Box>
      </Box>
      <Box sx={{display:{xs:"flex",md:"none"},justifyContent:"right"}}>
      <img
        src={section16BottomLines}
        alt="section16BottomLines"
        style={{
          width: "108px",
          objectFit: "contain",
        }}
      />
      </Box>
    </Grid>
  );
}

export default Section16;
