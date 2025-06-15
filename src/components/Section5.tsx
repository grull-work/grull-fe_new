import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { shades } from "../helper/shades";
import section5Freelancer from "../assets/section5Freelancer.png";
import section5DoubleQuotes from "../assets/section5DoubleQuotes.png";

function Section5() {
  const isDesktop = useMediaQuery("(min-width:900px)");

  return (
    <Grid
      sx={{ background: "#111717", padding:{xs:"24px" ,md:"48px 32px"}, position: "relative",margin:{xs:"0 24px",md:"0"},borderRadius:{xs:"16px",md:"0"} }}
    >
      <Box
        sx={{
          width: "90%",
          padding:{xs:"0px", md:"48px 12px"},
          display: "block",
          margin: "auto",
          position: "relative",
        }}
      >
        <img
          src={section5Freelancer}
          alt="section5Freelance"
          style={{
            width:isDesktop? "200px" : "60px",
            objectFit: "contain",
            position:isDesktop?  "absolute" : "inherit",
            left: isDesktop ? 0 : "",
            top: isDesktop ?  -8 : 0,
            zIndex: 2,
            margin: isDesktop ? "" : '12px auto',
            display:'block'
          }}
        />
        <img
          src={section5DoubleQuotes}
          alt="section5DoubleQuotes"
          style={{
            width: isDesktop ? "100px" : "36px",
            objectFit: "contain",
            position:"absolute",
            left: isDesktop ? "240px" : "0",
            top: isDesktop ? "0" : "60px",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            border:{xs:"none", md:"1px solid white"},
            borderRadius: "16px",
            display: "grid",
            placeContent: "center",
            width:{xs:"100%", md:"72%"},
            margin: "auto",
            padding:{xs:"0", md:"72px"},
            position: "relative",
          }}
        >
          <Typography sx={{ color: "white",typography:{xs:"font_12_600",md:"font_20_600"},textAlign:{xs:"left",md:""},padding:{xs:'8px 0',md:'0'} }}>
            Was super skeptical about another freelancing platform, but Grull
            was a game-changer for me. Got matched with gigs that actually fit
            my skill set and the project management bit is smooth. Also, didn’t
            expect to learn new stuff from their Academy, but here we are . It's
            not just work, it's a bit of everything for freelancers like me.
            Cheers to more gigs & learning!"
          </Typography>
          <Box
            sx={{
              position: {xs:"",md:"absolute"},
              bottom:{ md:"20px"},
              right: {md:"-20%"},
              border: "1px solid white",
              borderRadius: "36px",
              padding:{xs:"8px 0", md:"12px 36px"},
              zIndex: 2,
              background: "#111717",color: "white",typography:{xs:"font_12_500", md:"font_20_500"},
              textAlign:{xs:"center",md:""},
              margin:{xs:"12px 0",md:0}
            }}
          >

              Akshita Agarwal, Freelancer
 
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
export default Section5;
