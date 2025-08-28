
import { Grid } from "@mui/material";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section5 from "./components/Section5";
import Section6 from "./components/Section6";
import Section7 from "./components/Section7";
import Section8 from "./components/Section8";
import Section9 from "./components/Section9";
import Section10 from "./components/Section10";
import Section11 from "./components/Section11";
import Section13 from "./components/Section13";
import Section14 from "./components/Section14";
import Section16 from "./components/Section16";
import Section17 from "./components/Section17";
import Section18 from "./components/Section18";
import Section19 from "./components/Section19";
import Footer from "./components/Footer";
import Section4 from "./components/Section4";
import Section15 from "./components/Section15";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function App() {
  const { hash, pathname } = useLocation();

  function scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  useEffect(() => {
    if (hash) {
      scrollToSection(hash.replace("#", ""));
    }
  }, [hash]);

  return (
      <Grid sx={{ overflow: "hidden" }}>
        <Navbar />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
        <Section7 />
        <Section8 />
        <Section9 />
        <Section10 />
        <Section11 />
        <Section13 />
        <Section14 />
        <Section15 />
        <Section16 />
        <Section17 />
        <Section18 />
        <Section19 />
        <Footer />
      </Grid>
  );
}

export default App;
