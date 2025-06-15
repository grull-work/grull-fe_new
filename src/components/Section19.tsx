import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Input,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import section19Character from "../assets/section19Character.webp";
import { shades } from "../helper/shades";

function Section19() {
  const { silverTree } = shades;
  const isDesktop = useMediaQuery("(min-width:600px)");
  const [email, setEmail] = useState<string>("");
  const [alertText, setAlertText] = useState("");

  const handleSubmit = async () => {
    if (email === "") {
      setAlertText("Email Address");
      setTimeout(() => {
        setAlertText("");
      }, 3000);
      return;
    }
    try {
      const res = await fetch(
        "https://sheet.best/api/sheets/e47f0ab0-f6c0-430d-b794-7fa11e96e654",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            countMeInEmail:email
          }),
        }
      );
      if (res.ok) {
        setEmail("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid
      sx={{
        minHeight: { xs: "fit-content", sm: "70vh" },
        width: "100vw",
        display: "grid",
        placeContent: "center",
        position:'relative'
      }}
    >
      {alertText ? (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            borderRadius: "12px",
          }}
        >
          <AlertTitle>Please enter {alertText}</AlertTitle>
        </Alert>
      ) : null}
      <Grid
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "3fr 7fr" },
          width: { xs: "100%", sm: "90%" },
          margin: "auto",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Typography
            sx={{
              color: silverTree,
              display: { xs: "block", sm: "none" },
              typography: { xs: "font_20_700", sm: "font_48_900" },
              textAlign: { xs: "center", sm: "0" },
            }}
          >
            Stay Up-to Date
          </Typography>
          <img
            src={section19Character}
            alt="section19Character"
            style={{
              width: isDesktop ? "90%" : "60%",
              objectFit: "contain",
              margin: isDesktop ? "auto" : "24px auto",
              display: "block",
              position: isDesktop ? "absolute" : "static",
              bottom: "-50px",
              left: 0,
              right: 0,
              top: 0,
            }}
          />
        </Box>
        <Box sx={{ display: "grid", placeContent: "center" }}>
          <Typography
            variant="font_48_900"
            sx={{ color: silverTree, display: { xs: "none", sm: "block" } }}
          >
            Stay Up-to Date
          </Typography>
          <Typography
            sx={{
              color: "black",
              typography: { xs: "font_12_600", sm: "font_32_600" },
              textAlign: { xs: "center", sm: "left" },
              margin: { xs: "0 24px", sm: "0" },
            }}
          >
            Subscribe to Our Newsletter for the Latest Updates and Exclusive
            Content
          </Typography>

          <Box
            sx={{
              height: "80px",
              width: "90%",
              typography: { xs: "font_12_500", sm: "font_20_400" },
              position: "relative",
              margin: { xs: "16px auto", sm: "48px 0 0 0" },
            }}
          >
            <Input
              type="text"
              placeholder="Enter Your Email*"
              style={{
                height: "100%",
                width: "100%",
                border: "1px solid black",
                padding: "12px 36px",
                borderRadius: "16px",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box
              sx={{
                width: { xs: "100px", sm: "200px" },
                padding: "16px 0",
                height: "min-content",
                borderRadius: "16px",
                background: "black",
                color: "white",
                textAlign: "center",
                position: "absolute",
                top: 0,
                bottom: 0,
                right: "20px",
                margin: "auto",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
            >
              Count Me In!
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Section19;
