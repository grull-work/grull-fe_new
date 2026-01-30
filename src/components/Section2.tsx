import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { shades } from "../helper/shades";
import { section2Arr } from "../helper/constant";
import section2SemiCircle from "../assets/section2SemiCircle.png";

function Section2() {
  const {  lavender, black, white} =
    shades;
  const mobileCheck = useMediaQuery("(min-width:500px)");
  console.log(mobileCheck);

  return (
    <Grid>
      <Grid
        sx={{
          background: black,
          minHeight: { xs: "", md: "580px" },
          width: "100vw",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 8fr" },
          padding: { xs: "24px 0", md: "0" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "60px", md: "300px" },
            order: { xs: 2, md: 1 },
          }}
        >
          <Box sx={{display:{xs:"none",md:"block"}}}>
          <img
            src={section2SemiCircle}
            alt="semicircle"
            style={{
              width: "100%",
              objectFit: "contain",
              position: "absolute",
              bottom: "-32%",
            }}
          />
          </Box>
          <Box sx={{display:{xs:"block",md:"none"}}}>
          <img
            src={section2SemiCircle}
            alt="semicircle"
            style={{
              width: "100%",
              objectFit: "contain",
              position: "absolute",
   
            }}
          />
          </Box>
        </Box>
        <Box sx={{ margin:{xs:"auto", md:"auto"}, order: { xs: 1, md: 2 } }}>
          <Typography
            sx={{
              color: lavender,
              width: "80%",
              display: "block",
              textAlign: "center",
              typography: { xs: "font_20_700", md: "font_48_800" },
               margin:'auto'
            }}
          >
            Trusted by millions worldwide for unmatched opportunities and
            success.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: { xs: "8px", md: "48px" },
            }}
          >
            {section2Arr.map((logoObj) => {
              return (
                <Box
                  sx={{
                    height: { xs: "46px", md: "100px" },
                    width: { xs: "96px",md:"fit-content" },
                  }}
                  key={logoObj.logo}
                >
                  <img
                    key={logoObj.logo}
                    src={logoObj.logo}
                    alt="Partner logo"
                    style={{ height: "100%", width: "100%" }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Grid>
      <Box
        sx={{
          background: white,
          height: "200px",
          display: { xs: "none", md: "block" },
        }}
      ></Box>
    </Grid>
  );
}

export default Section2;
