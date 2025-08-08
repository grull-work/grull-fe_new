import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Input,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { shades } from "../helper/shades";

function Section18() {
  const { lavender, black, white } = shades;
  const [submitBtnText, setSubmitBtnText] = useState("Submit");
  const [alertText, setAlertText] = useState("");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    helpOption: "",
  });

  const isDesktop = useMediaQuery("(min-width:600px)");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setData({ ...data, [e.target.name]: e.target.value });
  const updateMessage = (e: any) => {
    setData({ ...data, message: e.target.value });
  };
  const updateHandleOption = (e: any) => {
    setData({ ...data, helpOption: e.target.value });
  };

  const handleSubmit = async () => {
    if (data.firstName === "") {
      setAlertText("First Name");

      setTimeout(() => {
        setAlertText("");
      }, 3000);
      return;
    }
    if (data.lastName === "") {
      setAlertText("Last Name");

      setTimeout(() => {
        setAlertText("");
      }, 3000);
      return;
    }
    if (data.email === "") {
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
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        setSubmitBtnText("Request Sent");
        setData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          helpOption: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid
      id="contactus"
      sx={{
        minHeight: { xs: "fit-content", md: "70vh" },
        width: "100vw",
        padding: "24px",
        display: "grid",
        position: "relative",
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

      <Grid sx={{ width: { xs: "100%", md: "90%" }, margin: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Typography
            sx={{
              color: black,
              typography: { xs: "font_24_700", md: "font_48_800" },
            }}
          >
            Got Questions? Reach Out!
          </Typography>
        </Box>
        <Box
          sx={{
            border: "1px solid black",
            background: "#121717",
            padding: { xs: "24px", md: "56px 80px" },
            borderRadius: "24px",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" },
              gap: { xs: "12px 0", md: "24px" },
              margin: { xs: "12px 0", md: "24px 0" },
            }}
          >
            <Input
              type="text"
              placeholder="First Name*"
              name="firstName"
              sx={{
                background: "white",
                height: { xs: "24px", md: "64px" },
                borderRadius: "12px",
                padding: { xs: "16px 12px", md: "8px 40px" },
                typography: { xs: "font_12_500", md: "font_20_400" },
              }}
              value={data.firstName}
              onChange={handleChange}
            />
            <Input
              type="text"
              placeholder="Last Name*"
              name="lastName"
              sx={{
                background: "white",
                height: { xs: "24px", md: "64px" },
                borderRadius: "12px",
                padding: { xs: "16px 12px", md: "8px 40px" },
                typography: { xs: "font_12_500", md: "font_20_400" },
              }}
              value={data.lastName}
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" },
              gap: { xs: "12px ", md: "24px" },
              //   margin: "24px 0",
            }}
          >
            <Box>
              <Input
                type="text"
                placeholder="Email*"
                name="email"
                sx={{
                  background: "white",
                  height: { xs: "24px", md: "64px" },
                  borderRadius: "12px",
                  padding: { xs: "16px 12px", md: "8px 40px" },
                  typography: { xs: "font_12_500", md: "font_20_400" },
                  width: "100%",
                }}
                value={data.email}
                onChange={handleChange}
              />
              <Box sx={{ margin: { xs: "8px 0", md: "24px 0" } }}>
                <textarea
                  placeholder="I want help with..."
                  style={{
                    background: "white",
                    height: "180px",
                    borderRadius: "12px",
                    padding: isDesktop ? "24px 40px" : "8px 14px",
                    fontSize: isDesktop ? "20px" : "12px",
                    fontWeight: "400",
                    margin: "12px 0",
                    width: "100%",
                    display: isDesktop ? "none" : "block",
                  }}
                  name="message"
                  value={data.message}
                  onChange={updateMessage}
                />

                <Typography
                  sx={{
                    color: "white",
                    typography: { xs: "font_12_600", md: "font_20_600" },
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  I want more help with-
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: { xs: "12px", md: "24px" },
                    margin: { xs: "8px", md: "12px 0" },
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <input
                      type="radio"
                      style={{
                        background: "white",
                        height: isDesktop ? "20px" : "8px",
                        width: isDesktop ? "20px" : "8px",
                        borderRadius: "50%",
                      }}
                      checked={data.helpOption === "portfolio"}
                      value="portfolio"
                      onClick={updateHandleOption}
                    />
                    <Typography
                      sx={{
                        color: white,
                        typography: { xs: "font_12_600", md: "font_20_600" },
                      }}
                    >
                      My portfolio
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <input
                      type="radio"
                      style={{
                        background: "white",
                        height: isDesktop ? "20px" : "8px",
                        width: isDesktop ? "20px" : "8px",
                        borderRadius: "50%",
                      }}
                      checked={data.helpOption === "course"}
                      value="course"
                      onClick={updateHandleOption}
                    />
                    <Typography
                      sx={{
                        color: white,
                        typography: { xs: "font_12_600", md: "font_20_600" },
                      }}
                    >
                      Course enquiry
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <input
                      type="radio"
                      style={{
                        background: "white",
                        height: isDesktop ? "20px" : "8px",
                        width: isDesktop ? "20px" : "8px",
                        borderRadius: "50%",
                      }}
                      value="jobPosting"
                      checked={data.helpOption === "jobPosting"}
                      onClick={updateHandleOption}
                    />
                    <Typography
                      sx={{
                        color: white,
                        typography: { xs: "font_12_600", md: "font_20_600" },
                      }}
                    >
                      A new job posting
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <input
                      type="radio"
                      value="other"
                      checked={data.helpOption === "other"}
                      style={{
                        background: "white",
                        height: isDesktop ? "20px" : "8px",
                        width: isDesktop ? "20px" : "8px",
                        borderRadius: "50%",
                      }}
                      onClick={updateHandleOption}
                    />
                    <Typography
                      sx={{
                        color: white,
                        typography: { xs: "font_12_600", md: "font_20_600" },
                      }}
                    >
                      Others
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <textarea
              placeholder="I want help with..."
              style={{
                background: "white",
                height: "180px",
                borderRadius: "12px",
                padding: "24px 40px",
                fontSize: "20px",
                fontWeight: "400",
                display: isDesktop ? "block" : "none",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "right" },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                typography: { xs: "font_12_700", md: "font_20_600" },
                background: lavender,
                color: black,
                textAlign: "center",
                borderRadius: "16px",
                width: { xs: "120px", md: "200px" },
                margin: { xs: "12px 0", md: "" },
                padding: { xs: "12px 0", md: "16px 0" },
                cursor:'pointer'
              }}
              onClick={handleSubmit}
            >
              {submitBtnText}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Section18;
