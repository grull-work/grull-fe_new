import React from 'react';
import { Grid } from '@mui/material';

import { shades } from '../helper/shades';
import Navbar from './Navbar';
import Footer from './Footer';

function AboutUs() {
    const { dustyOrange } = shades;
  
    return (
      <div>
        <Navbar/>
      <Grid
      sx={{
        minHeight: { xs: "fit-content", md: "50vh" },
        height:"100vh",
        width: "100%",
        background: dustyOrange,
        padding: { xs: "36px 24px", md: "50px 32px 32px 32px" },
      }}
    >
  
   
     <header>
        <h1>About Us</h1>
        <br />
        <hr />
      </header>
      <main>
        <section>
          <br />
          <br />
          <h3>Grull is a design-centric freelancing platform with a deep commitment to quality.
             Unlike generic competitors, we foster a community where designers thrive, continuously upskill through Grull Academy, and build long-lasting client relationships. Our AI-driven matchmaking ensures the right fit for projects and cultures. With a zero-commission model, we prioritize designers’ earnings.
             Robust conflict resolution mechanisms and a localized-global approach provide support and accessibility.
             We prioritize sustainable growth, offering a seamless user experience. Grull addresses the holistic needs of the freelance design industry, making it stand out in a competitive landscape.
             Grull is registered at PROP- SANJAY GUPTA 22-A ASAF ALI ROAD DELHI 110002.</h3>
        </section>
      </main>
 
    </Grid>
    <Footer/>
    </div>
  );
}

export default AboutUs;
