import React, { FC, useState } from "react";
import { Box, Grid, Typography, useMediaQuery, styled, keyframes } from "@mui/material";
import { shades } from "../helper/shades";
import { section9Arr } from "../helper/constant";
import { useNavigate } from "react-router-dom";

// Keyframes for infinite horizontal scroll
const scrollText = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Styled containers
const ScrollContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  overflow: 'hidden',
  marginTop: theme.spacing(3),
}));

const Marquee = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  whiteSpace: 'nowrap',
  animation: `${scrollText} 20s linear infinite`,
}));

const ScrollItem = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  verticalAlign: 'top',
  minWidth: '300px',
  margin: theme.spacing(0, 3),
  padding: theme.spacing(2),
  borderTop: '1px solid black',
  // backgroundColor: shades.lavender,
}));

const Section9: FC = () => {
  const { lavender } = shades;
  const isDesktop = useMediaQuery('(min-width:900px)');
  const navigate = useNavigate();
  const [type, setType] = useState(0);
  const cards = section9Arr[type];
  // Duplicate for seamless loop
  const loopItems = [...cards, ...cards];

  return (
    <Grid container sx={{ p: { xs: 0, md: 3 } }}>
      {/* Toggle Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          gap: { xs: "12px", md: "48px" },
          padding:{xs:"24px",md:"0"}
        }}
      >
        {[
          {
            text: "Freelancer",
            link: "/freelancer"
          },
          {
            text: "Client",
            link: "/client"
          },
        ].map((obj,index) => {
          return (
            <Box
              key={obj.text}
              sx={{
                width: "200px",
                padding: "16px",
                border: "1px solid black",
                borderRadius: "16px",
                textAlign: "center",
                cursor:'pointer',
                typography: { xs: "font_12_600", md: "font_20_600" },
                "&:hover": {
                  background: lavender,
                },
                background : type===index? lavender :'null'
              }}
              onClick={() => {
                setType(index)
              }}
            >
              {obj.text}
            </Box>
          );
        })}
      </Box>

      {/* Infinite Scroll Section */}
      <ScrollContainer>
        <Marquee>
          {loopItems.map((card, i) => (
            <ScrollItem key={i}>
              <Typography variant={isDesktop ? 'h5' : 'subtitle1'}>
                {card.title}
              </Typography>
              <Typography variant={isDesktop ? 'body1' : 'body2'}>
                {card.text}
              </Typography>
            </ScrollItem>
          ))}
        </Marquee>
      </ScrollContainer>
    </Grid>
  );
};

export default Section9;
