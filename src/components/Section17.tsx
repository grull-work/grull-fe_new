import { Box, Grid, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { shades } from "../helper/shades";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Section17() {
  interface BlogLink {
  id:number;
  link: string;
  title: string;
  imgsrc: string;
}

  const bloglinks : BlogLink[] = [
    {
      id: 0,
      link: 'https://blog.fiverr.com/post/getting-in-buyers-heads-as-told-by-top-buyers',
      title: "Getting in buyers’ heads, as told by top buyers",
      imgsrc: "https://assets-global.website-files.com/606a802fcaa89bc357508cad/64e62d602ee42d68c9b65e28_image2.jpg"
    }, {
      id: 1,
      link: 'https://blog.fiverr.com/post/the-psychology-behind-discounts-and-how-it-can-benefit-your-business',
      title: "The psychology behind discounts and how it can benefit your business",
      imgsrc: "https://assets-global.website-files.com/606a802fcaa89bc357508cad/64e62e20ee2ef482d3e618ce_image2%20(1).jpg"
    }, {
      id: 2,
      link: 'https://blog.fiverr.com/post/put-your-skills-to-the-test-in-fiverrs-new-ai-art-contest',
      title: "Put your skills to the test in Fiverr’s new AI Art Contest",
      imgsrc: "https://assets-global.website-files.com/606a802fcaa89bc357508cad/64d3d92681493e4875d6858e_header%20image-p-1080.png"
    }
  ];

  const navigate = useNavigate();
  const { black } = shades;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>(Array(bloglinks.length).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);

  

  const handleBoxClick = (link: string) => {
    window.open(link, "_blank");
  };

  // Update currentIndex based on scroll
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const idx = Math.round(scrollLeft / width);
      if (idx !== currentIndex) {
        setCurrentIndex(idx);
      }
    }
  };

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    const target = itemRefs.current[index];
    if (container && target) {
      const left = target.offsetLeft;
      container.scrollTo({ left, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  const scrollLeftFunc = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollRightFunc = () => {
    if (currentIndex < bloglinks.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentIndex]);

  return (
    <Grid
      sx={{
        minHeight: { xs: "fit-content", sm: "40vh", md:"40vh" },
        width: "100vw",
        padding: "32px",
        display: "grid",
      }}
    >
      <Grid sx={{ width: { xs: "100%", sm: "90%" }, margin: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: black,
              typography: { xs: "font_24_700", sm: "font_48_800" },
            }}
          >
            Get tips, ideas and insights
          </Typography>
        </Box>

        {/* Carousel or Grid */}
        {isMobile ? (
          <Box sx={{ position: 'relative', margin: '24px 0' }}>
            <IconButton
              onClick={scrollLeftFunc}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: currentIndex > 0 ? 'rgba(255,255,255,0.7)' : 'transparent',
                visibility: currentIndex > 0 ? 'visible' : 'hidden',
                pointerEvents: currentIndex > 0 ? 'auto' : 'none',
              }}
            >
              <FiChevronLeft size={24} />
            </IconButton>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '& > div': {
                  scrollSnapAlign: 'start',
                  flex: '0 0 100%',
                }
              }}
            >
              {bloglinks.map((blog, i) => (
                <Box
                  key={blog.id}
                  ref={el => { itemRefs.current[i] = el as HTMLDivElement | null; }}
                  onClick={() => handleBoxClick(blog.link)}
                  sx={{
                    border: `1px solid ${black}`,
                    borderRadius: "24px",
                    boxShadow: `0px 0px 4px 0px rgba(0, 0, 0, 0.25)`,
                    overflow: "hidden",
                    margin: '0 8px',
                    cursor: "pointer",
                    boxSizing: 'border-box',
                  }}
                >
                  <img
                    src={blog.imgsrc}
                    alt="logo"
                    style={{ width: "100%", objectFit: "contain" }}
                  />
                  <Box sx={{ display: "grid", placeContent: "center", padding: "0 8px" }}>
                    <Typography
                      sx={{ color: black, margin: "0", typography: { xs: "font_12_500" } }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography variant="font_12_400" sx={{ paddingBottom: "8px" }}>5 min Read</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <IconButton
              onClick={scrollRightFunc}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: currentIndex < bloglinks.length - 1 ? 'rgba(255,255,255,0.7)' : 'transparent',
                visibility: currentIndex < bloglinks.length - 1 ? 'visible' : 'hidden',
                pointerEvents: currentIndex < bloglinks.length - 1 ? 'auto' : 'none',
              }}
            >
              <FiChevronRight size={24} />
            </IconButton>
          </Box>
        ) : (
          <Box
            id="section17Scroll"
            sx={{
              display: { xs: "flex", sm: "grid" },
              gridTemplateColumns: "repeat(3,1fr)",
              margin: { xs: "24px 0", sm: "60px 0" },
              gap: { xs: "12px", sm: "24px" },
              overflow: { xs: "scroll", sm: "none" },
              maxWidth: { xs: "350px", sm: "fit-content" },
              paddingRight: { xs: "24px", sm: "0" }
            }}
          >
            {bloglinks.map((blog) => (
              <Box
                key={blog.id}
                onClick={() => handleBoxClick(blog.link)}
                sx={{
                  border: `1px solid ${black}`,
                  borderRadius: "24px",
                  boxShadow: `0px 0px 4px 0px rgba(0, 0, 0, 0.25)`,
                  overflow: "hidden",
                  margin: "auto",
                  width: { xs: "", sm: "fit-content" },
                  minWidth: { xs: "192px", sm: "fit-content" },
                  cursor: "pointer"
                }}
              >
                <img
                  src={blog.imgsrc}
                  alt="logo"
                  style={{ width: "100%", objectFit: "contain" }}
                />
                <Box sx={{ display: "grid", placeContent: "center", padding: "0 8px" }}>
                  <Typography
                    sx={{ color: black, margin: "0", typography: { xs: "font_12_500", sm: "font_20_600" } }}
                  >
                    {blog.title}
                  </Typography>
                  <Typography variant="font_12_400" sx={{ paddingBottom: "8px" }}>5 min Read</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box
          sx={{
            width: { xs: "100px", sm: "200px" },
            border: "1px solid black",
            borderRadius: "16px",
            textAlign: "center",
            padding: { xs: "8px 0", sm: "16px 0" },
            margin: "auto",
            typography: { xs: "font_12_500", sm: "font_20_600" },
            display: "block",
            cursor: 'pointer'
          }}
          onClick={() => handleBoxClick('https://blog.fiverr.com/category/freelancers')}
        >
          Read More
        </Box>
      </Grid>
    </Grid>
  );
}

export default Section17;
