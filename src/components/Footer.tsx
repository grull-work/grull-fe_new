import { Box, Grid, Typography } from "@mui/material";
import { shades } from "../helper/shades";
import grullLogoBlack from "../assets/grullLogoBlack.png";
import twitterIcon from "../assets/twitter.svg";
import linkedInIcon from "../assets/linkedIn.svg";
import instaIcon from "../assets/instaIcon.svg";
import { footerLinks } from "../helper/constant";
import useScrollToContactUsHook from "../customHooks/useScrollToContactUsHook";
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";

function Footer() {
  const { dustyOrange } = shades;
  const scrollToSection = useScrollToContactUsHook()
  const navigate=useNavigate()

  return (
    <Grid
      sx={{
        minHeight: { xs: "fit-content", md: "50vh" },
        width: "100%",
        background: dustyOrange,
        padding: { xs: "36px 24px", md: "100px 32px 32px 32px" },
      }}
    >
      <Grid
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 5fr" },
          width: "90%",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            order: { xs: 2, md: 1 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <img
            src={grullLogoBlack}
            alt="grullLogoBlack"
            style={{ height: "40px", objectFit: "contain" }}
          />
          <Box sx={{ width: { xs: "100%", md: "60%" }, margin: "24px 0" }}>
            <Typography variant="font_16_600">
            #423 A 9th main 1st cross - 
            Iti layout main road
            </Typography>
            <Typography variant="font_16_600" sx={{ margin: "12px 0" }}>
            BENGALURU, KARNATAKA 560068 
            India
            </Typography>
            <Typography variant="font_16_600" sx={{ margin: "12px 0" }}>
              contact@grull.work
            </Typography>
            <Typography variant="font_16_600" sx={{ margin: "12px 0" }}>
              Grull Technologies Pvt. Ltd.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent:{xs:"center", md:"left"},
                alignItems: "center",
                margin: "24px 0 0 0",
              }}
            >
              <img
                src={twitterIcon}
                alt="twitterIcon"
                style={{ height: "32px", width: "32px", margin: "0 8px",cursor:"pointer" }}
                onClick={() => window.open(` https://twitter.com/Grull_work`)}
              />
              <img
                src={linkedInIcon}
                alt="linkedInIcon"
                style={{ height: "32px", width: "32px", margin: "0 8px",cursor:"pointer" }}
                onClick={() => window.open('https://www.linkedin.com/company/grull-work/')}
              />
              <img
                src={instaIcon}
                alt="linkedInIcon"
                style={{ height: "32px", width: "32px", margin: "0 8px",cursor:"pointer" }}
                onClick={() => window.open(` https://www.instagram.com/grull.work?igsh=MmVlMjlkMTBhMg==`)}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ order: { xs: 1, md: 2 },              placeContent:{xs:'center',md:'left'},textAlign:{xs:"center",md:"left"} }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" },
              gap: { xs: "24px", md: "0" },

            }}
          >
            {Object.keys(footerLinks).map((keyName) => {
              return (
                <Box
                  key={keyName}
                  sx={{ paddingLeft: { xs: "0", md: "12px" } }}
                >
                  <Typography
                    sx={{
                      marginBottom: "16px",
                      typography: { xs: "font_12_900", md: "font_16_900" },
                    }}
                  >
                    {keyName}
                  </Typography>
                  {footerLinks[keyName as keyof typeof footerLinks].map((obj) => {
  return (
    <Typography
      sx={{
        margin: "8px 0",
        typography: {
          xs: "font_12_600",
          md: "font_16_600",
        },
        color: "black !important", 
      }}
      key={obj.text}
    >
      <Link to={obj.link} sx={{ color: "black !important" }}>
        {obj.text}
      </Link>
    </Typography>
  );
})}

                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              width: "300px",
              background: "black",
              borderRadius: "16px",
              padding: "12px 0",
              typography: { xs: "font_16_600", md: "font_20_600" },
              color: "white",
              textAlign: "center",
              margin: { xs: "24px 0", md: "56px 0 0 0" },
              cursor:'pointer'
            }}
            onClick={()=>navigate('/home')}
          >
            Hire a Designer
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Footer;
