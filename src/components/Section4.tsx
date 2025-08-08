import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import section4Character1 from "../assets/section4Character1.webp";
import section4Character1Mobile from "../assets/section4Character1Mobile.png";
import section4Character2 from "../assets/section4Character2.webp";
import checkIconWhite from "../assets/checkIconWhite.svg";
import { shades } from "../helper/shades";
import { section4Cards } from "../helper/constant";
import section4ArrowMobile1 from "../assets/section4ArrowMobile1.png";
import section4ArrowMobile2 from "../assets/section4ArrowMobile2.svg";
import * as animationData from "../jsonAnimations/section4Animation.json";
import * as animationData2 from "../jsonAnimations/section4Animation2.json";
import section4LeftArrow  from "../assets/section4LeftArrow.png"
import useScrollToContactUsHook from "../customHooks/useScrollToContactUsHook";
import { useNavigate } from "react-router-dom";

function Section4() {
  const { lavender, royalBlue } = shades;
  const scrollToSection = useScrollToContactUsHook();
  const isDesktop = useMediaQuery("(min-width:600px)");

  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationData2,
  };
  const navigate=useNavigate();

  return (
    <Grid sx={{ minHeight: "100vh", width: "100vw" }}>
      <Grid
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 5fr" },
          position: "relative",
          marginLeft:'24px'
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
              margin: "auto",
              width: "90%",
              padding: { xs: "36px 0 0 0", md: "0" },
            }}
          >
            <Typography
              sx={{
                display: "block",
                typography: { xs: "font_24_700", md: "font_48_800" },
              }}
            >
              Your Freelancing Compass
            </Typography>
            <Typography
              sx={{
                display: "block",
                margin: "12px 0",
                typography: { xs: "font_12_500", md: "font_20_500" },
              }}
            >
              Grull is crafting a unified platform, meticulously designed to
              seamlessly connect businesses with adept freelance designers, all
              while being supercharged by Artificial Intelligence (AI).
            </Typography>
            {[
              "Connect Businesses and Freelancers",
              "Secure Project Management",
              "AI-Enhanced Matching",
            ].map((text) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "12px 0",
                  }}
                  key={text}
                >
                  <Box
                    sx={{
                      height: { xs: "18px", md: "28px" },
                      width: { xs: "18px", md: "28px" },
                      marginRight: "12px",
                    }}
                  >
                    <img
                      src={checkIconWhite}
                      alt="checkIconWhite"
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      typography: { xs: "font_12_500", md: "font_20_500" },
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              margin: "auto",
              width: "90%",
              position: "relative",
              display: { xs: "none", md: "flex" },
              height: "140px",
              justifyContent: "space-between",
              alignItems: "flex-end",
              
            }}
          >
            <Typography
              sx={{
                typography: "font_20_600",
                borderRadius: "12px",
                padding: "8px 0",
                width: "250px",
                background: lavender,
                textAlign: "center",
                cursor:'pointer',
                position:'absolute',
                bottom:'-20px',
                left:0,

              }}
              onClick={()=>navigate("/home")}
            >
              Explore Now
            </Typography>
            <Box style={{borderBottom:'1px solid black',flex:1,marginLeft:'270px'}}></Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: { xs: "80%", md: "100%" },
            margin: { xs: "auto", md: "24px 0" },
          }}
        >
          <img
            src={isDesktop ? section4Character1 : section4Character1Mobile}
            alt="section4Character1"
            style={{
              width: "100%",
              objectFit: "contain",
              zIndex: 4,
              position: "relative",
              display: "block",
            }}
          />
          {/* <Lottie options={defaultOptions1} height={"100%"} width={"100%"} /> */}

          <Box
            sx={{
              display: { xs: "grid", md: "none" },
              placeContent: "center",
            }}
          >
            <img
              src={section4ArrowMobile1}
              alt="section4ArrowMobile1"
              style={{
                height: "100px",
                objectFit: "contain",
                margin: "12px 0 0 -20px",
              }}
            />
            <Box
              sx={{
                background: lavender,
                border: "1px solid black",
                width: "124px",
                padding: "8px 0",
                borderRadius: "12px",
                typography: { xs: "font_12_600", md: "font_20_600" },
                textAlign: "center",
                margin: "12px 0 !important",
                display: "block",
                cursor:'pointer'
              }}
              onClick={()=>navigate("/home")}
            >
              Explore Now
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        <Box
          sx={{
            display: "grid",
            placeContent: "center",
            order: { xs: 2, md: 1 },
          }}
        >
          <Box sx={{ width: "80%", margin: "auto" }}>
            <img
              src={section4Character2}
              alt="section4Character2"
              style={{
                width: "80%",
                objectFit: "contain",
                margin: "auto",
                display: "block",
              }}
            />
            {/* <Lottie options={defaultOptions2} height={"100%"} width={"100%"} /> */}
            <Box
              sx={{
                display: { xs: "grid", md: "none" },

                placeContent: "end",
              }}
            >
              <img
                src={section4ArrowMobile2}
                alt="section4ArrowMobile2"
                style={{
                  height: "120px",
                  objectFit: "contain",
                  margin: "24px 24px 12px 0px",
                }}
              />
            </Box>
            <Box
              sx={{
                border: "1px solid black",
                typography: { xs: "font_12_600", md: "font_20_600" },
                background: lavender,
                width: "150px",
                borderRadius: "16px",
                textAlign: "center",
                padding: "12px 0",
                margin: "auto !important",
                display: { xs: "block", md: "none" },
                cursor:'pointer'
              }}
              onClick={()=>navigate("/home")} >
              Start Your Journey
            </Box>
          </Box>
        </Box>
        <Box sx={{ position: "relative", order: { xs: 1, md: 2 } }}>
          <Box
            sx={{
              height: "200px",
              width: "400px",
              display: { xs: "none", md: "block" },
              borderRight: "1px solid black",
              borderBottom: "1px solid black",
              position: "absolute",
              top: "-30px",
              left: 0,
            }}
          ></Box>
          <Box
            sx={{
              height: "62px",
              width: "400px",
              borderLeft: "1px solid black",
              marginTop: "170px",
              display: { xs: "none", md: "block" },
            }}
          ></Box>
          <Box
            sx={{
              width: "90%",
              padding: { xs: "24px", md: 0 },
              margin: { xs: "auto", md: "0" },
            }}
          >
            <Typography
              sx={{
                color: "black",
                display: "block",
                marginBottom: "24px",
                typography: { xs: "font_24_800", md: "font_48_800" },
              }}
            >
              Navigating the Freelance World with Ease
            </Typography>
            <Typography
              variant="font_20_500"
              sx={{
                color: "black",
                display: "block",
                typography: { xs: "font_12_500", md: "font_20_500" },
              }}
            >
              In the vast ocean of freelancing, Grull stands out as a steadfast
              lighthouse, guiding freelancers and businesses alike towards
              fruitful collaborations and success. We understand the intricacies
              of freelancing and have sculpted Grull to be the compass that
              navigates you through every challenge, ensuring your journey is
              smooth and rewarding.
            </Typography>
            <Box
              sx={{
                border: "1px solid black",
                typography: "font_20_600",
                background: lavender,
                width: "240px",
                borderRadius: "16px",
                textAlign: "center",
                padding: "12px 0",
                marginTop: "48px",
                display: { xs: "none", md: "block" },
                cursor:'pointer'
              }}
              onClick={()=>navigate("/home")} 
            >
              Start Your Journey
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid sx={{ padding: { xs: "0", md: "24px 0" } }}>
        <Grid
          sx={{
            display: { xs: "grid", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            padding: "48px 0",
            gap: { xs: "24px", md: "48px" },
          }}
        >
          {section4Cards.map((card) => {
            return (
              <Box
                sx={{
                  height: "180px",
                  width: { xs: "80%", md: "40%" },
                  border: "1px solid black",
                  borderRight: "8px solid black",
                  borderBottom: "8px solid black",
                  borderRadius: "16px",
                  padding: { xs: "16px", md: "32px" },
                  background: royalBlue,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "2fr 8fr" },
                  margin: { xs: "auto", md: "0" },
                }}
                key={card.title}
              >
                <Box
                  sx={{
                    height: { xs: "28px", md: "64px" },
                    width: { xs: "28px", md: "46px" },
                    alignItems: { xs: "center", md: "" },
                  }}
                >
                  <img
                    src={card.icon}
                    alt={card.text}
                    style={{ height: "100%", width: "100%" }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "white",
                      display: "block",
                      typography: { xs: "font_12_700", md: "font_24_700" },
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "white",
                      display: "block",
                      typography: { xs: "font_12_500", md: "font_20_500" },
                    }}
                  >
                    {card.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Section4;
