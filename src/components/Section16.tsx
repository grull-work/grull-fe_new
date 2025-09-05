import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import section16BottomLines from "../assets/section16BottomLines.svg";
import section16CharacterSale from "../assets/section16CharacterSale.webp";
import { shades } from "../helper/shades";
import { section16BasicPlan, section16PremiumPlan } from "../helper/constant";
import crossIcon from "../assets/crossIcon.svg";
import section6GreenTicks from "../assets/section6GreenTicks.svg";
import useScrollToContactUsHook from "../customHooks/useScrollToContactUsHook";

export default function Section16() {
  const { dustyOrange, lavender, black, royalBlue } = shades;
  const scrollToSection = useScrollToContactUsHook();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: { xs: 2, sm: 4, lg: 0 }, position: "relative" }} margin={"15px"}>
      {/* For lg+, absolute character & bottom lines */}
      {isLgUp && (
        <>
          <Box sx={{ position: "absolute", top: 0, left: "-10%",mt: { lg: "-115px" },
          [theme.breakpoints.up(1280)]: {
      left: "-6%",
    }
         }} >
            <Box
              component="img"
              src={section16CharacterSale}
              alt="sale"
              sx={{
                width: { xs: 440}, [theme.breakpoints.up(1600)]: {width:600 },
                objectFit: "contain",
                display: "block",
              }}
              // style={{ width: 440, objectFit: "contain", display: "block" }}
            // />
                            >
                              </Box>
            {/* > */}
            
          </Box>
          <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
            <img
              src={section16BottomLines}
              alt="lines"
              style={{ width: 280, objectFit: "contain", display: "block" }}
            />
          </Box>
        </>
      )}

      {/* Heading for sm+; hidden under sm to avoid duplication */}
      <Box sx={{ textAlign: "center", mb: 4, display: { xs: "none", sm: "block" } }}>
        <Typography sx={{ typography: { xs: "font_12_700", md: "font_24_700" } }}>
          CHOOSE YOUR PLAN
        </Typography>
        <Typography sx={{ color: lavender, typography: { xs: "font_24_800", md: "font_48_800" } }}>
          Flexible Pricing for Every Freelancer
        </Typography>
      </Box>

      {/* Responsive layout */}
      <Box
        sx={{
          display: { xs: "grid", sm: "grid", lg: "flex" },
          gridTemplateColumns: { xs:"1fr", sm: "1fr 1fr", lg: "none" },
          gridTemplateRows: { sm: "auto auto", lg: "none" },
          gap: 4,
          justifyContent: "center",
          alignItems: "start",
          width: { xs: "100%", sm: "80%", lg: "80%" },
          mx: "auto",
          my:"auto"
        }}
      >
        {/* Character Image on xs+ */}
        {!isLgUp && (
          <Box sx={{ gridRow: 1, gridColumn: 1, gridColumnEnd: { xs: "span 2", sm: 1 } }}>
            <img
              src={section16CharacterSale}
              alt="sale"
              style={{ width: "100%", objectFit: "contain", display: "block" }}
            />
          </Box>
        )}

        {/* Basic Plan Box */}
        <Box
          sx={{
            gridRow: { xs: 2, sm: 1, lg: "auto" },
            gridColumn: { xs: 1, sm: 2, lg: "auto" },
            border: "2px solid #00000040",
            borderRadius: "24px",
            p: { xs: 2, md: 3 },
            textAlign: "center",
            width: { xs: "100%", sm: "100%", lg: "40%" },
            mx: { xs: 0, sm: 0, lg: 0 },
          }}
        >
          <Typography variant="font_28_700" sx={{ color: dustyOrange }}>
            {section16BasicPlan.title}
          </Typography>
          <Typography sx={{ my: { xs: 1.5, md: 3 }, typography: { xs: "font_24_800", md: "font_44_800" } }}>
            {section16BasicPlan.price}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 11fr", mb: 1 }}>
            <Box />
            <Typography sx={{ typography: { xs: "font_12_500", md: "font_18_500" } }}>
              {section16BasicPlan.for}
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "2fr 10fr", mb: 2 }}>
            <Box />
            <Typography sx={{ color: lavender, typography: { xs: "font_12_500", md: "font_18_500" } }}>
              {section16BasicPlan.commission}
            </Typography>
          </Box>

          {section16BasicPlan.feat.map((feature, index) => (
            <Box key={`basic-${index}-${feature.text}`} sx={{ display: "grid", gridTemplateColumns: "2fr 10fr", mb: { xs: 1, md: 1.5 } }}>
              <Box sx={{ display: "grid", placeContent: "center" }}>
                <img
                  src={feature.isAvailable ? section6GreenTicks : crossIcon}
                  alt="tick"
                  style={{ width: isLgUp ? 24 : 20, height: isLgUp ? 24 : 20, display: "block", margin: "auto" }}
                />
              </Box>
              <Typography sx={{ typography: { xs: "font_12_500", md: "font_18_500" } }}>
                {feature.text}
              </Typography>
            </Box>
          ))}

          <Box
            sx={{
              width: { xs: "100%", md: 300 },
              border: "1px solid black",
              borderRadius: "20px",
              py: { xs: 1.5, md: 2.5 },
              mx: "auto",
              typography: { xs: "font_12_600", md: "font_18_600" },
              cursor: "pointer",
            }}
            onClick={scrollToSection}
          >
            Choose Plan
          </Box>
        </Box>

        {/* Premium Plan Box */}
        <Box
          sx={{
            gridRow: { xs: 3, sm: 2, lg: "auto" },
            gridColumn: { xs: 1, sm: 1, lg: "auto" },
            border: `2px solid ${lavender}`,
            borderRadius: "24px",
            p: { xs: 2, md: 3 },
            textAlign: "center",
            width: { xs: "100%", sm: "100%", lg: "40%" },
            mx: { xs: 0, sm: 0, lg: 0 },
          }}
        >
          <Typography variant="font_16_600" sx={{ color: royalBlue, mb: 1 }}>
            (PAID YEARLY)
          </Typography>
          <Typography variant="font_28_700" sx={{ color: royalBlue, mb: 2 }}>
            {section16PremiumPlan.title}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}> 
            <Typography sx={{ textDecoration: "line-through", typography: { xs: "font_20_700", md: "font_28_700" } }}>
              {section16PremiumPlan.prevPrice}
            </Typography>
            <Typography sx={{ mx: { xs: 1, md: 3 }, typography: { xs: "font_24_800", md: "font_44_800" } }}>
              {section16PremiumPlan.price}
            </Typography>
            <Typography variant="font_24_600">/month</Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 11fr", mb: 1 }}>
            <Box />
            <Typography sx={{ typography: { xs: "font_12_500", md: "font_18_500" } }}>
              {section16PremiumPlan.for}
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "2fr 10fr", mb: 2 }}>  
            <Box />
            <Typography sx={{ color: lavender, typography: { xs: "font_12_500", md: "font_18_500" } }}>
              {section16PremiumPlan.commission}
            </Typography>
          </Box>

          {section16PremiumPlan.feat.map((feature, index) => (
            <Box key={`premium-${index}-${feature.text}`} sx={{ display: "grid", gridTemplateColumns: "2fr 10fr", mb: { xs: 1, md: 1.5 } }}>
              <Box sx={{ display: "grid", placeContent: "center" }}>
                <img
                  src={feature.isAvailable ? section6GreenTicks : crossIcon}
                  alt="tick"
                  style={{ width: isLgUp ? 24 : 20, height: isLgUp ? 24 : 20, display: "block", margin: "auto" }}
                />
              </Box>
              <Typography sx={{ typography: { xs: "font_12_500", md: "font_18_500" } }}>
                {feature.text}
              </Typography>
            </Box>
          ))}

          <Box
            sx={{
              width: { xs: "100%", md: 300 },
              background: lavender,
              border: "1px solid black",
              borderRadius: "20px",
              py: { xs: 1.5, md: 2.5 },
              mx: "auto",
              typography: { xs: "font_12_600", md: "font_18_600" },
              cursor: "pointer",
            }}
            onClick={scrollToSection}
          >
            Choose Plan
          </Box>
        </Box>

        {/* Bottom lines for sm/md */}
        <Box sx={{ display: { xs: "none", sm: "block", lg: "none" }, gridRow: 2, gridColumn: 2 }}>
          <img
            src={section16BottomLines}
            alt="lines"
            style={{ width: "100%", objectFit: "contain", display: "block" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
