import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import section13Bg from "../assets/section13Bg.png";
import section13Quote from "../assets/section13Quote.webp";
import section13QuoteText from "../assets/section13QuoteText.png";
import section13InnovationCircle from "../assets/section13InnovationCircle.svg";
import * as animationData from "../jsonAnimations/section13CircleAnimation.json";
import Lottie from "react-lottie";

function Section13() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  return (
    <Grid sx={{ minHeight: "40vh", width: "100vw" }}>
      <Box
        sx={{
          width: { xs: "100%", md: "90%" },
          margin: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "6fr 3fr" },
          padding: { xs: "24px", md: "60px 24px" },
          marginTop: "24px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            placeContent: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "70%" },
              marginLeft: { xs: "0", md: "24px" },
              zIndex: 4,
            }}
          >
            <img
              src={section13QuoteText}
              alt="section13QuoteText"
              style={{
                width: "100%",
                objectFit: "contain",
                display: "block",
                zIndex: "4",
              }}
            />
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 0,
              bottom: 0,
              height: "100px",
              width: "300px",
              margin: "auto",
              left: "10%",
              zIndex: 1,
              rotate: "-10%",
            }}
          >
            <Lottie options={defaultOptions} height={"100%"} width="100%" />
          </Box>
          <Typography
            sx={{
              margin: { xs: "12px 0", md: "24px 0 0 24px" },
              typography: { xs: "font_12_600", md: "font_24_600" },
            }}
          >
            Chanderkant Sharma, CEO of Grull
          </Typography>
        </Box>
        <Box>
          <img
            src={section13Quote}
            alt="section13Quote"
            style={{
              width: "100%",
              objectFit: "contain",
              margin: "auto",
              display: "block",
            }}
          />
        </Box>
      </Box>
      <img
        src={section13Bg}
        alt="section13Bg"
        style={{ width: "100%", objectFit: "contain" }}
      />
    </Grid>
  );
}

export default Section13;
