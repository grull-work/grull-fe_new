

import { useNavigate} from 'react-router-dom';
import React,{ useState, useRef, useEffect } from 'react';
import '../styles/Browsejobs.css';
import { FaSearch } from "react-icons/fa";
import { jobService } from '../services/jobService';
import { Box, Button, Divider, Typography, TextField, MenuItem } from "@mui/material";
import Header3 from "./Header3";
import { LiaFilterSolid } from "react-icons/lia";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { VscChromeClose } from "react-icons/vsc";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import BAPI from '../helper/variable'

const BrowseJobs = () => {

  const accessToken = localStorage.getItem('accessToken');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchJobs,setSearchJobs]=useState('');
  const [category,setcategory]=useState('projects')
  const [state, setState] = useState(false);
  const sortByOptions = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Highest', label: 'Highest' },
  ]
  const [sort, setSort] = useState(sortByOptions[0]);
  const currencyConversionRates = {
    'INR': 1,
    'USD': 74,
    'CAD': 59,
    'GBP': 103,
    'CNY': 11,
    'RUB': 1,
};
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [currentpage, setCurrentpage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const scrollableJobs = useRef(null);
  const [jobs, setJobs] = useState([]);

  const [expandedJobs, setExpandedJobs] = useState({});
  const toggleJobDescription = (jobId) => {
      setExpandedJobs((prev) => ({
          ...prev,
          [jobId]: !prev[jobId]
      }));
  };
  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const navigate = useNavigate();

  const items1 = {
    "Graphic Designer": "GRAPHIC_DESIGNER",
    "Illustrator": "ILLUSTRATOR",
    "Programmer": "PROGRAMMER",
    "Video Editor": "VIDEO_EDITOR",
    "3D Artist": "THREE_D_ARTIST",
    "Product Designer": "PRODUCT_DESIGNER",
  };
  const items2 = {
    Beginner: "BEGINNER",
    Intermediate: "INTERMEDIATE",
    Advanced: "ADVANCED",
    Expert: "EXPERT",
  };

  const items3 = {
    India: "INDIA",
    USA: "USA",
    Canada: "CANADA",
    England: "ENGLAND",
    China: "CHINA",
    Russia: "RUSSIA",
  };


  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const toggleCategory = () => setCategoryExpanded(!categoryExpanded);

  const [experienceExpanded, setExperienceExpanded] = useState(true);
  const toggleExperience = () => setExperienceExpanded(!experienceExpanded);

  const [jobExpanded, setJobExpanded] = useState(true);
  const toggleJob = () => setJobExpanded(!jobExpanded);

  const [locationExpanded, setLocationExpanded] = useState(true);
  const toggleLocation = () => setLocationExpanded(!locationExpanded);
  
  const handleLocationChange = (location) => {
    setSelectedLocations((prevSelected) => {
      if (prevSelected.includes(location)) {
        return prevSelected.filter((loc) => loc !== location);
      } else {
        return [...prevSelected, location];
      }
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((cat) => cat !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const filteredCategories = Object.keys(items1).filter(category => category.toLowerCase().includes(categorySearchQuery.toLowerCase()));

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState(open);
  };

  const getJobs = async (type=1) => {
    try {
      const category = selectedCategories.map(item => item).join(",");
      const location = selectedLocations.map(item => item).join(",");
      const params = {
          page: type===1?currentpage:1,
          per_page: 8,
          category: category,
          location: location,
      };
      const response = await jobService.getJobs(params, accessToken);

      if (response.status === 200) {
        setCurrentpage(response.data.page+1);
        // console.log(response.data);
        if(type===2){
          setJobs([...response.data.results])
        }
        else{
          setJobs(prevJobs => {
            const newJobs = response.data.results.filter(newJob => !prevJobs.some(existingJob => existingJob.id === newJob.id));
            return [...prevJobs, ...newJobs];
          });
        }
        if (response.data.next) {
          if(type===1){
             setHasMore(true);
          }
          else{
             setHasMore(true);
          }
          // console.log(jobs);
        }
        else{
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  useEffect(() => {
    getJobs(2);
  }, [accessToken,selectedCategories,selectedLocations]);

  const loadMore=()=>{
     if(hasMore){
      // console.log("Loading page: ", currentpage)
      getJobs(1)
     }
  }
  useEffect(() => {
    const handleScroll = () => {
      const scrollableDiv = scrollableJobs.current;
      const scrollTop = scrollableDiv.scrollTop;
      const clientHeight = scrollableDiv.clientHeight;
      const scrollHeight = scrollableDiv.scrollHeight;
    
      const isAtPercent = scrollTop + clientHeight >= scrollHeight * 0.98;
    
      if (isAtPercent && hasMore) {
        loadMore();
      }
    };
    
    const scrollableDiv = scrollableJobs.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentpage]);

  const getTimeDifference = (modifiedAt) => {
    const now = new Date();
    const modifiedDate = new Date(modifiedAt);
    const differenceInMilliseconds = now - modifiedDate;

    const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else if (weeks > 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };
  
  const convertToBaseCurrency = (rate, currency) => {
    const conversionRate = currencyConversionRates[currency] || 1;
    return rate * conversionRate;
};

  const handleSearch=()=>{
    setSearchJobs(searchQuery)
  }  
  useEffect(() => {
  handleSearch();
}, [searchQuery]);

  const filteredJobs = jobs
  .filter((job) => {
      if (searchJobs && !(job.title.toLowerCase().includes(searchJobs.toLowerCase()) || job.description.toLowerCase().includes(searchJobs.toLowerCase()))) {
        return false;
      }
      return true;
  })
  .sort((a, b) => {
      if (sort.value === 'Newest') {
          return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sort.value === 'Highest') {
          const rateA = convertToBaseCurrency(a.rate_per_hour, a.currency_type);
          const rateB = convertToBaseCurrency(b.rate_per_hour, b.currency_type);
          return rateB - rateA;
      }
      return 0;
  });


  const handleApplynow=(job_id)=>{
       navigate(`/jobdetails/${job_id}`)
  }

  return (
    <div>
      {/* section 1  */}
      <Header3 />

     {/* section 2  */}
      {/* <div className='rectangle'></div> */}
      <div className='search-bar'>
        <h1 style={{ color: 'white'}}>Browse</h1>
        <div style={{display:'flex',flexDirection:'column'}}>
          <Box
  sx={{
    display: "flex",
    width: "100%",
    // maxWidth: 600,
    borderRadius: "15px",
    overflow: "hidden",
    bgcolor: "#fff",
    boxShadow: "0 0 0 1px #ccc",
  }}
>
  <div style={{ position: "relative", flex: 1 }}>
    <input
      value={searchQuery}
      onChange={(e) => {setSearchQuery(e.target.value)
        // handleSearch
      }}
      type="text"
      placeholder="What you are looking for?"
      style={{
        border: "none",
        outline: "none",
        width: "100%",
        padding: "12px 45px 12px 40px",
        fontSize: "16px",
        color: "#000",
        backgroundColor: "#fff",
      }}
    />
    <FaSearch
      style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#555",
      }}
    />
  </div>
  <Button
    onClick={handleSearch}
    sx={{
      borderRadius: 0,
      bgcolor: "rgb(178, 126, 227)",
      color: "#fff",
      px: 3,
      fontSize: "16px",
      textTransform: "none",
      "&:hover": {
        bgcolor: "rgb(178, 126, 227)",
      },
    }}
  >
    Search
  </Button>
</Box>


        </div>
        
        <div >
            <Button sx={{color:category==='projects'?'#fff':'#FFFFFFB2',borderBottom:category==='projects'?'1px solid #fff':'1px solid transparent',outline:'none',background:'transparent',borderRadius:'0',fontSize:'16px'}} onClick={()=>setcategory('projects')}>Projects</Button >
        </div>
      </div>
      
      {/* section 3  */}
      <div className="sortingjobs" style={{marginBottom:'30px'}}>
        {/* responsive button filters  */}
        <Button endIcon={<LiaFilterSolid />} onClick={toggleDrawer(true)} sx={{boxShadow: '0px 0px 4px 0px #00000040',color:'#000',padding:'7px 20px',borderRadius:'16px'}}>Filters</Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px' }}>Sort by:</span>
            <TextField
                select
                value={sort.value}
                onChange={(e) => {
                    const selected = sortByOptions.find(opt => opt.value === e.target.value);
                    setSort(selected);
                }}
                variant="standard"
                InputProps={{
                    disableUnderline: true,
                    style: { fontSize: '16px', borderRadius: '16px' }
                }}
                SelectProps={{
                  displayEmpty: true,
                    MenuProps: {
                        PaperProps: {
                            style: {
                                borderRadius: '16px',
                            }
                        }
                    }
                }}
                sx={{ width: '150px', '.MuiSelect-select': { paddingBottom: '2px', paddingTop: '2px', paddingLeft: '10px' } }}
            >
                {sortByOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
          </Box>
      </div>
       
      {/* section 4 - responsive drawer for filters  */}
      <SwipeableDrawer
            anchor='top'
            open={state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box sx={{minHeight:'100vh',display:'flex',flexDirection:'column',gap:'20px',padding:'20px 30px'}}>
               <Box sx={{textAlign:'end'}}>
               <VscChromeClose style={{fontSize:'35px',cursor:'pointer'}} onClick={toggleDrawer(false)}/>
               </Box>
               <Box >
               <div className='browseJobs-left-box blb'>
          <div className='category' style={{ marginBottom: '40px' }}>
           <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between'}} onClick={toggleCategory} >
              Category
              <div>{
              categoryExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>
            

            {categoryExpanded && (
              <div style={{ marginLeft: '10px',marginRight:'10px' }}>
                <div style={{ position: 'relative',marginBottom:'15px',marginTop:'10px'}}>
                  <input
                    type="text"
                    placeholder=" Search categories"
                    style={{
                     borderRadius: '16px', boxShadow: '0px 0px 4px 0px #00000040',
                      width:'100%',
                      padding:'10px 0px 10px 35px',
                      border:'none',outline:'none'
                    }}
                  />
                  <FaSearch style={{
                    position: 'absolute', left: '10px', top: '10px',
                    color: '#00000080',
                  }} />
                </div>

                {
                    Object.keys(items1).map((item,index)=>(
                      <div key={index} style={{ marginBottom: '10px' }}>
                      <label style={{color:'#000'}}>
                          <input type="checkbox" onChange={() => handleCategoryChange(items1[item])} style={{marginRight:'7px',cursor:'pointer'}}/>
                          {item}
                      </label>
                    </div>
                    ))
                  }
              </div>
            )}
          </div>

          <div className='experience-level' style={{ marginBottom: '40px' }}>
          <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:'10px'}} onClick={toggleExperience} >
          Experience Level
              <div>{
              experienceExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>

            {experienceExpanded && (
              <div style={{ marginLeft: '10px' }}>
                 {
                    Object.keys(items2).map((item,index)=>(
                      <div key={index} style={{ marginBottom: '10px' }}>
                      <label style={{color:'#000'}}>
                          <input type="checkbox"  style={{marginRight:'7px',cursor:'pointer'}}/>
                          {item}
                      </label>
                    </div>
                    ))
                  }
              </div>
            )}
          </div>

          <div className='job-type' style={{ marginBottom: '40px' }}>
              <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:'10px'}} onClick={toggleJob} >
              Job Type
              <div>{
              jobExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>
            {jobExpanded && (
              <div>
                <div style={{ marginLeft: '10px', marginBottom: '20px' }}>
                  <label>
                    <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}} />
                    Hourly
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '10px',marginTop:'10px' }}>
                    <label style={{ marginRight: '10px' }}>
                      <input type="checkbox" />
                    </label>
                    <label style={{ marginRight: '10px' }}>
                      <input type="text" placeholder="$ min" style={{ width: '45px',padding:'0 4px' }} />
                      <span style={{ color: '#808080' }}>/hr</span>
                    </label>
                    <label style={{ marginRight: '10px' }}>
                      <input type="text" placeholder="$ max" style={{ width: '45px',padding:'0 2px' }} />
                      <span style={{ color: '#808080' }}>/hr</span>
                    </label>
                  </div>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  <label>
                    <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}} />
                    Fixed-Price
                  </label>
                  <div style={{ marginLeft: '30px', marginTop: '10px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        Less than $100
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $100 to $500
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $500 to $1k
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $1k to $5k
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $5k +
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='location' style={{ marginBottom: '40px' }}>
              <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:'10px'}} onClick={toggleLocation} >
              Location
              <div>{
              locationExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>
            {locationExpanded && (
              <div style={{ marginLeft: '10px' }}>
                {
                    Object.keys(items3).map((item,index)=>(
                      <div key={index} style={{ marginBottom: '10px' }}>
                      <label style={{color:'#000'}}>
                          <input type="checkbox" onChange={() => handleLocationChange(items3[item])} style={{marginRight:'7px',cursor:'pointer'}}/>
                          {item}
                      </label>
                    </div>
                    ))
                  }
              </div>
            )}
          </div>
        </div>
               </Box>
            </Box>
     </SwipeableDrawer>

      {/* section 5 - desktop containng left and right boxes  */}
      <div style={{ marginBottom: '50px', display: 'flex',marginTop:'30px' }} className='browseJobs'>

        {/* left box  - filters */}
        <div className='browseJobs-left-box'>

          <div className='category' style={{ marginBottom: '40px' }}>
            <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between'}} onClick={toggleCategory} >
              Category
              <div>{
              categoryExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>
            {categoryExpanded && (
              <div style={{ marginLeft: '10px',marginRight:'10px' }}>
                <div style={{ position: 'relative',marginBottom:'15px',marginTop:'10px'}}>
                  <input
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                    type="text"
                    placeholder=" Search categories"
                    style={{
                     borderRadius: '16px', boxShadow: '0px 0px 4px 0px #00000040',
                      width:'100%',
                      padding:'10px 0px 10px 35px',
                      border:'none',outline:'none'
                    }}
                  />
                  <FaSearch style={{
                    position: 'absolute', left: '10px', top: '10px',
                    color: '#00000080',
                  }} />
                </div>
                {
                   filteredCategories.map((item,index)=>(
                      <div key={index} style={{ marginBottom: '10px' }}>
                      <label style={{color:'#000'}}>
                          <input type="checkbox" onChange={() => handleCategoryChange(items1[item])} style={{marginRight:'7px',cursor:'pointer'}}/>
                          {item}
                      </label>
                    </div>
                    ))
                  }
              </div>
            )}
          </div>

          <div className='experience-level' style={{ marginBottom: '40px' }}>
            <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:'10px'}} onClick={toggleExperience} >
              Experience Level
              <div>{
              experienceExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>
            {experienceExpanded && (
              <div style={{ marginLeft: '10px' }}>
                 {
                    Object.keys(items2).map((item,index)=>(
                      <div key={index} style={{ marginBottom: '10px' }}>
                      <label style={{color:'#000'}}>
                          <input type="checkbox"  style={{marginRight:'7px',cursor:'pointer'}}/>
                          {item}
                      </label>
                    </div>
                    ))
                  }
              </div>
            )}
          </div>

          <div className='job-type' style={{ marginBottom: '40px' }}>
              <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:'10px'}} onClick={toggleJob} >
              Job Type
              <div>{
              jobExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>
            {jobExpanded && (
              <div>
                <div style={{ marginLeft: '10px', marginBottom: '20px' }}>
                  <label>
                    <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}} />
                    Hourly
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginBottom: '10px',marginTop:'10px' }}>
                    <label style={{ marginRight: '10px' }}>
                      <input type="checkbox" />
                    </label>
                    <label style={{ marginRight: '10px' }}>
                      <input type="text" placeholder="$ min" style={{ width: '45px',padding:'0 4px' }} />
                      <span style={{ color: '#808080' }}>/hr</span>
                    </label>
                    <label style={{ marginRight: '10px' }}>
                      <input type="text" placeholder="$ max" style={{ width: '45px',padding:'0 2px' }} />
                      <span style={{ color: '#808080' }}>/hr</span>
                    </label>
                  </div>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  <label>
                    <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}} />
                    Fixed-Price
                  </label>
                  <div style={{ marginLeft: '30px', marginTop: '10px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        Less than $100
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $100 to $500
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $500 to $1k
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $1k to $5k
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}/>
                        $5k +
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='location' style={{ marginBottom: '40px' }}>
              <Box style={{ cursor: 'pointer',fontSize:'24px',fontWeight:'700',color:'#000',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',marginBottom:'10px'}} onClick={toggleLocation} >
              Location
              <div>{
              locationExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />
              }</div>
            </Box>
            {locationExpanded && (
              <div style={{ marginLeft: '10px' }}>
                 {
                    Object.keys(items3).map((item,index)=>(
                      <div key={index} style={{ marginBottom: '10px' }}>
                      <label style={{color:'#000'}}>
                          <input type="checkbox" onChange={() => handleLocationChange(items3[item])} style={{marginRight:'7px',cursor:'pointer'}}/>
                          {item}
                      </label>
                    </div>
                    ))
                  }
              </div>
            )}
          </div>
        </div>
         
         {/* right box  */}
        <div className='browseJobs-right-box' ref={scrollableJobs}>
        {filteredJobs.filter(job => job.status === 'PENDING').length === 0 ? (
                <p style={{ fontSize: '18px', padding: '20px', textAlign: 'center' }}>No jobs found.</p>
            ) : (
                filteredJobs.filter(job => job.status === 'PENDING').map((job, index) => (
                    <React.Fragment key={job.id}>
                        <Box sx={{ padding: { sm: '30px', xs: '18px 16px' } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { sm: '10px', xs: '8px' } }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { sm: '10px', xs: '7px' } }}>
                                    <Typography sx={{ fontSize: { sm: '28px', xs: '23px' }, fontWeight: '700', letterSpacing: '-1px' }}>{job.title}</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: { sm: '15px', xs: '10px' }, alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: { sm: '20px', xs: '17px' }, fontWeight: '500', letterSpacing: '-1px' }}>Budget {job.rate_per_hour} {job.currency_type}</Typography>
                                        <Typography sx={{ fontSize: { sm: '15px', xs: '13px' }, fontWeight: '500', letterSpacing: '-1px', color: '#00000080' }}>Posted {getTimeDifference(job.modified_at)}</Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ color: '#454545', fontSize: { sm: '18px', xs: '16px' } }}>
                                    {expandedJobs[job.id] ? job.description : truncateText(job.description, 70)}
                                    {!expandedJobs[job.id] && job.description.split(' ').length > 70 && (
                                        <Button onClick={() => toggleJobDescription(job.id)} sx={{ padding: 0, textTransform: 'none', color: '#B27EE3', fontSize: '14px' }}>Read More</Button>
                                    )}
                                    {expandedJobs[job.id] && (
                                        <Button onClick={() => toggleJobDescription(job.id)} sx={{ padding: 0, textTransform: 'none', color: '#B27EE3', fontSize: '14px' }}>Read Less</Button>
                                    )}
                                </Typography>
                                <Box sx={{ margin: { sm: '15px 0 5px 0', xs: '10px 0 3px 0' } }}>
                                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                        {job.required_skills.map((skill, indx) => (
                                            <li key={indx} style={{ fontSize: '16px', padding: "8px 18px", backgroundColor: '#E9E9E9', color: '#000', borderRadius: '10px', width: 'fit-content' }}>{skill}</li>
                                        ))}
                                    </ul>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ color: '#B27EE3', fontSize: { sm: '15px', xs: '14px' }, fontWeight: '500' }}>Non Negotiable</Typography>
                                    <Button onClick={() => handleApplynow(job.id)} sx={{ padding: '5px 25px', backgroundColor: '#B27EE3', color: '#fff', textTransform: 'none', fontSize: { sm: '18px', xs: '16px' }, borderRadius: '16px', width: 'fit-content', ':hover': { backgroundColor: '#B27EE3', color: '#fff' } }}>
                                        Apply Now
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        {<Divider />}
                    </React.Fragment>
                ))
            )}
        </div>
      </div>

    </div>
  )
}
export default BrowseJobs;