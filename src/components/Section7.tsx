import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { shades } from "../helper/shades";
import section7WhiteStrike from "../assets/section7WhiteStrike.svg";
import section7HeroImage from "../assets/section7HeroImage.webp";


function Section7() {
  const { dustyOrange, black } =
    shades;

  return (
    <Grid
      sx={{
        padding: { xs: "24px", md: "100px 24px" },
        background: dustyOrange,
      }}
    >
      <Box
        sx={{
          display: "block",
          width: { xs: "100%", md: "60%" },
          margin: "auto",
        }}
      >
        <Typography
          variant="font_64_800"
          sx={{
            color: black,
            position: "relative",
            display: "block",
            textAlign: "center",
            typography: { xs: "font_24_800", md: "font_64_800" },
          }}
        >
          The next step in the <br />freelance revolution
          <Box
            sx={{
              width: { xs: "180px", md: "400px" },
              padding: { xs: "12px 0 0 0", md: "0" },
            }}
          >
            <img
              src={section7WhiteStrike}
              alt="WhiteStrike"
              style={{
                width: "100%",
                height: "22px",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                margin: "auto",
              }}
            />
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "black",
            textAlign: "center",
            display: "block",
            typography: { xs: "font_12_500", md: "font_20_500" },
          }}
        >
          Discover a dynamic freelancers' marketplace where clients effortlessly
          post design projects and connect with skilled designers. Seamlessly
          hire freelancers, foster collaboration, and bring your creative
          visions to life. Join our platform and experience the future of design
          freelancing.
        </Typography>
      </Box>
      <Box
        sx={{
          width: { xs: "90%", md: "80%" },
          margin: { xs: "24px 0px", md: "auto 10px auto 50px" },
        }}
      >
        {/* <Lottie options={defaultOptions} height={"100%"} width={"110%"} /> */}
        <img src={section7HeroImage} alt="section7HeroImage" style={{width:"100%",display:'block',objectFit:'contain',margin:'24px 0 24px 0px '}} />
      </Box>
    </Grid>
  );
}

export default Section7;
