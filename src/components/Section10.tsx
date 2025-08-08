import { Box, Grid, Typography } from "@mui/material";
import section10Bg from "../assets/section10Bg.png";
import section10Sparkle from "../assets/section10Sparkle.svg";
import section7WhiteStrike from "../assets/section7WhiteStrike.svg";
import section10Text from "../assets/section10Text.png";
import { shades } from "../helper/shades";
import section10Character from "../assets/section10Character.webp";


function Section10() {
  const { black } = shades;

  return (
    <Grid
      sx={{
        backgroundImage: `url(${section10Bg})`,
        backgroundSize:{xs:"cover", md:"cover"},
        backgroundRepeat: "no-repeat",
        minHeight:{xs:"fit-content", md:"75vh"},
        width: "100vw",
        marginTop: { xs: "0", md: "48px" },
        paddingBottom:{xs:"0", md:"48px"},
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            display: "block",
            // width: "50%",
          }}
        >
          <Box
            sx={{
              color: black,
              display: "grid",
              // gridTemplateColumns: "7fr 3fr",
              position:'relative'
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  height: { xs: "58px", md: "154px" },
                  marginTop: { xs: "50px", md: "120px" },
                }}
              >
                <img
                  src={section10Text}
                  alt="section10Sparkle"
                  style={{
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: { xs: "100px", md: "300px" },
                  height: { xs: "12px", md: "24px" },
                  position: "absolute",
                  bottom: 0,
                  left:'50%'
                }}
              >
                <img
                  src={section7WhiteStrike}
                  alt="WhiteStrike"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ height: { xs: "108px", md: "264px" },position:'absolute',right:{xs:"2%",sm:'10%'} }}>
              <img
                src={section10Sparkle}
                alt="section10Sparkle"
                style={{
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
          <Typography
            sx={{
              color: "black",
              textAlign: "center",
              display: "block",
              width: "80%",
              margin: "24px auto",
              typography:{xs:"font_12_500",md:"font_20_500"}
            }}
          >
            Discover a dynamic freelancers' marketplace where clients
            effortlessly post design projects and connect with skilled
            designers. Seamlessly hire freelancers, foster collaboration, and
            bring your creative visions to life. Join our platform and
            experience the future of design freelancing.
          </Typography>
        </Box>
      </Box>
      <Box sx={{background:{xs:"#47D487",md:""},paddingBottom:{xs:"12px",md:"0"}}}>
      {/* <Lottie options={defaultOptions} height={"100%"} width={"80%"} /> */}
    
      <img
        src={section10Character}
        alt="section10Character"
        style={{ width: "72%", margin: "0 auto 0px auto", display: "block" }}
      />
      </Box>
    </Grid>
  );
}

export default Section10;
