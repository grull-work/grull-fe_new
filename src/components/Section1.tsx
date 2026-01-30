
import { Box, Button, Grid, Typography, Fade } from "@mui/material";
import React, { useState, useEffect } from "react";
import { shades } from "../helper/shades";
import section1Landing from "../assets/section1Landing.webp";
import useScrollToContactUsHook from "../customHooks/useScrollToContactUsHook";
import { useNavigate } from "react-router-dom";

function Section1() {
  const accessToken = localStorage.getItem('accessToken');
  const { dustyOrange, black, white } = shades;
  const scrollToSection = useScrollToContactUsHook();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <Fade in={mounted} timeout={1000}>
        <Box>
          <Box
            sx={{
              padding: { xs: "0", md: "auto" },
              width: "90%",
              margin: { md: "auto", xl: "auto" },
            }}
          >
            <Box sx={{ margin: "auto" }}>
              <Typography
                sx={{
                  typography: { xs: "font_24_800", md: "font_64_800" },
                  lineHeight: { xs: "", md: "82px" },
                  margin: "auto",
                  zIndex: 4,
                  position: 'relative',

                }}
              >
                Be the <span style={{ position: "relative" }}>pioneer</span>
                <br /> in navigating your <br /> <span style={{ color: white }}>freelance</span> journey
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
              }}
              onClick={() => { accessToken !== null ? navigate('/postjob') : navigate('/home') }}
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
              }}
              onClick={() => { accessToken !== null ? navigate('/browsejobs') : navigate('/home') }}
            >
              Find Work
            </Button>
          </Box>
        </Box>
      </Fade>
      <Box
        sx={{ position: "relative" }}
      >
        <Fade in={mounted} timeout={1500}>
          <Box
            sx={{
              width: { xs: "90%", md: "102%" },
              margin: { xs: "24px 0 0 0", md: '0' },
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
                display: "block",
              }}
            />
          </Box>
        </Fade>
      </Box>
    </Grid>
  );
}

export default Section1;

