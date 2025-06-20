import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@emotion/react";
import { grullCustomTheme } from "./helper/theme";
import PageRoute from "./route/route";
import { Toaster } from "react-hot-toast";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={grullCustomTheme}>
      <PageRoute />
      <Toaster />
    </ThemeProvider>    
  </React.StrictMode>
);
