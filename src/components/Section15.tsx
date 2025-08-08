import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { section15ImgArr } from "../helper/constant";
import { useNavigate } from "react-router-dom";

function Section15() {

  const isDesktop = useMediaQuery("(min-width:600px)");

  const navigate=useNavigate()

  const referenceComponentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      const upperSlider = document.getElementById("upper-slider");
      const lowerSlider = document.getElementById("lower-slider");
      const scrollPosition = window.scrollY;
      let upperSliderPosition: number;
      let lowerSliderPosition: number;
      
      // Determine the reference component's position
      const referenceComponentPosition = referenceComponentRef.current?.getBoundingClientRect().top || 0;

      // Check if the reference component has been passed
      if (scrollPosition > referenceComponentPosition) {
        const isDesktop: boolean = true; // Provide the logic to determine desktop or not

        if (isDesktop) {
          upperSliderPosition = (scrollPosition - referenceComponentPosition) / 25; // Adjust this value as needed
          lowerSliderPosition = (scrollPosition - referenceComponentPosition) / 25; // Adjust this value as needed
        } else {
          upperSliderPosition = (scrollPosition - referenceComponentPosition) / 45; // Adjust this value as needed
          lowerSliderPosition = (scrollPosition - referenceComponentPosition) / 45; // Adjust this value as needed
        }
     
        if (upperSlider && lowerSlider) {
          upperSlider.style.transform = `translateX(-${upperSliderPosition}px)`;
          lowerSlider.style.transform = `translateX(${lowerSliderPosition}px)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Grid sx={{ minHeight:{xs:"fit-content", md:"100vh"}, width: "100vw", padding:{xs:"24px", md:"60px 0"} }}>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography sx={{ textAlign: "center",typography:{xs:"font_24_800",md:"font_64_800"} }}>
          Forge Connections, Build <br /> Your Network
        </Typography>
      </Box>
      <Box
        sx={{
          width: "240px",
          padding: "12px 0",
          border: "1px solid black",
          borderRadius: "16px",
          typography:{xs:"font_12_600",md:"font_20_600"},
          textAlign: "center",
          margin:{xs:"12px auto" ,md:"48px auto"},
          cursor:'pointer'
        }}

        onClick={()=>navigate("/coming-soon")}
      >
        Discover More
      </Box>
      <Grid sx={{margin:{xs:"24px 0",md:"0"}}}>
        <Box
          sx={{
            display: "flex",
            gap:{xs:"12px", md:"24px"},
            justifyContent: "left",
            alignItems: "center",
          }}
          id="upper-slider"
        >
          {section15ImgArr.map((obj) => {
            return (
              <>
              {console.log(obj.img)}
              <img
                key={obj.img}
                src={obj.img}
                alt={obj.img}
                
                style={{ height:isDesktop ? "300px" : "92px", objectFit: "contain" }}
              />
              </>
            );
          })}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap:{xs:"12px", md:"24px"},
            justifyContent: "right",
            alignItems: "center",
            margin: "24px 0",
          }}
          id="lower-slider"
        >
          {section15ImgArr.reverse().map((obj) => {
            return (
              <img
                key={obj.img}
                src={obj.img}
                alt={obj.img}
                style={{ height:isDesktop ? "300px" : "92px", objectFit: "contain" }}
              />
            );
          })}
        </Box>
      </Grid>
    </Grid>
  );
}

export default Section15;
