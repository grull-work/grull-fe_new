import { Box, Grid, Typography } from "@mui/material";
import { shades } from "../helper/shades";
import section6Sticks from "../assets/section6Sticks.png";
import { section6Counts } from "../helper/constant";
import section6SocialMedia from "../assets/section6SocialMedia.webp";
import section6GreenTicks from "../assets/section6GreenTicks.svg";

function Section6() {
  const { silverTree, lavender, black, dustyOrange } = shades;

  return (
    <Grid sx={{ padding: { xs: "24px", md: "100px 24px" } }}>
      <Box
        sx={{
          display: { xs: "block", md: "grid" },
          gridTemplateColumns: "7fr 3fr",
          width: { xs: "100%", md: "90%" },
          margin: "auto",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: silverTree,
            typography: { xs: "font_24_700", md: "font_48_800" },
          }}
        >
          Grull is the only design freelancing platform you need . Here’s why:
        </Typography>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <img
            src={section6Sticks}
            alt="stick"
            style={{ height: "200px", objectFit: "contain" }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: "block", md: "grid" },
          width: { xs: "100%", md: "90%" },
          margin: "auto",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Box sx={{ margin: { xs: "24px 0", md: "0" } }}>
          <Typography
            sx={{
              color: lavender,
              display: "block",
              typography: { xs: "font_12_800", md: "font_28_800" },
            }}
          >
            For Freelancers
          </Typography>
          <Typography
            sx={{
              color: black,
              display: "block",
              typography: { xs: "font_16_700", md: "font_32_700" },
              margin: { xs: "8px 0", md: "20px 0" },
            }}
          >
            A Platform for Your Creativity
          </Typography>
          <Typography
            sx={{
              color: black,
              display: "block",
              typography: { xs: "font_12_500", md: "font_20_500" },
            }}
          >
            Grull transforms your creativity into rewarding freelancing
            opportunities, celebrating innovative ideas and bringing them to
            life
          </Typography>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "right",
              alignItems: "center",
              margin: "12px 0",
            }}
          >
            <img
              src={section6Sticks}
              alt="stick"
              style={{ height: "80px", objectFit: "contain" }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "space-between", md: "space-around" },
            alignItems: "center",
            marginTop: "24px",
          }}
        >
          {section6Counts.map((card) => {
            return (
              <Box
                sx={{
                  width: { xs: "148px", md: "300px" },
                  padding: { xs: "12px", md: "32px" },
                  textAlign: "center",
                  border: "1px solid black",
                  borderRadius: "20px",
                  "&:hover": {
                    borderRight: "8px solid black",
                    borderBottom: "8px solid black",
                    transition: "all 0.5s ease",
                  },
                }}
                key={card.text}
              >
                <Typography
                  sx={{
                    color: dustyOrange,
                    display: "block",
                    typography: { xs: "font_24_800", md: "font_64_800" },
                    margin: { xs: "0", md: "" },
                  }}
                >
                  {card.count}
                </Typography>
                <Typography
                  sx={{
                    typography: { xs: "font_10_500", md: "font_24_500" },
                    margin: { xs: "0", md: "" },
                  }}
                >
                  {" "}
                  {card.text}{" "}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          width: { xs: "100%", md: "90%" },
          margin:{xs:"24px 0 12px 0", md:"48px auto"},
        }}
      >
        <Box sx={{ order: { xs: "2", md: "1" } }}>
          <Box
            sx={{
              width: { xs: "252px", md: "440px" },
              margin:{xs:"20px auto",md:"0 auto"},
            }}
          >
            <img
              src={section6SocialMedia}
              alt="social media character"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </Box>
          <Box
            sx={{
              marginTop: "24px",
              display: { xs: "grid", md: "none" },
              gridTemplateColumns:"1fr 1fr",
              gap:"16px"
            }}
          >
            {[
              "Harmonious Collaboration",
              "Quality Assurance",
              "End-to-End Support",
            ].map((text) => {
              return (
                <Box
                  key={text}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:{xs:"1fr 9fr", md:"2fr 8fr"},
                    alignItems: "center",
                    
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: "14px", md: "28px" },
                      width: { xs: "14px", md: "28px" },
                      display:{xs:'grid',md:""},
                      placeContent:{xs:"center",md:""}
                    }}
                  >
                    <img
                      src={section6GreenTicks}
                      alt="tick"
                      style={{ height: "100%", width: "100%" }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      typography: { xs: "font_12_500", md: "font_20_500" },
                    }}
                  >
                    {" "}
                    {text}{" "}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ order: { xs: "1", md: "2" } }}>
          <Typography
            sx={{
              color: lavender,
              display: "block",
              typography: { xs: "font_12_800", md: "font_28_800" },
            }}
          >
            For Clients
          </Typography>
          <Typography
            sx={{
              color: black,
              display: "block",
              typography: { xs: "font_16_700", md: "font_32_700" },
              margin: { xs: "8px 0", md: "20px 0" },
            }}
          >
            Work with creative experts you can trust
          </Typography>
          <Typography
            sx={{
              color: black,
              display: "block",
              typography: { xs: "font_12_500", md: "font_20_500" },
            }}
          >
            Feel confident working with our designer community. All our
            designers are vetted creative experts who've worked with hundreds of
            businesses to bring their designs to life.
          </Typography>
          <Box
            sx={{
              marginTop: "24px",
              display: { xs: "none", md: "flex" },
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {[
              "Harmonious Collaboration",
              "Quality Assurance",
              "End-to-End Support",
            ].map((text) => {
              return (
                <Box
                  key={text}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 8fr",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={section6GreenTicks}
                    alt="tick"
                    style={{ height: "28px", width: "28px" }}
                  />
                  <Typography variant="font_20_500"> {text} </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}

export default Section6;
