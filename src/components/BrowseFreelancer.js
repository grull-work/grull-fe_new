import React, { useLayoutEffect } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import '../styles/Browsefreelancer.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios, { all } from 'axios';
import Header3 from "./Header3";
import { Box, Button, Divider, Typography } from "@mui/material";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { VscChromeClose } from "react-icons/vsc";
import { LiaFilterSolid } from "react-icons/lia";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import BAPI from '../helper/variable'

import Avatar from '@mui/material/Avatar';
import Header4 from "./Header4";

const BrowseFreelancer = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFreelancers,setSearchFreelancers]=useState('');
  const [allFreelancers, setAllFreelancers] = useState([]);
  const [postedJobs,setPostedJobs]=useState({});
  const [selectedJobs, setSelectedJobs] = useState({});
  const sortByOptions = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Cheapest', label: 'Cheapest' },
  ]
  const [sort, setSort] = useState(sortByOptions[0]);
  const [category,setcategory]=useState('freelancers');
  const [state, setState] = useState(false);
  const currencyConversionRates = {
    'INR': 1,
    'USD': 74,
    'CAD': 59,
    'GBP': 103,
    'CNY': 11,
    'RUB': 1,
};

  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const toggleCategory = () => setCategoryExpanded(!categoryExpanded);

  const [experienceExpanded, setExperienceExpanded] = useState(true);
  const toggleExperience = () => setExperienceExpanded(!experienceExpanded);

  const [jobExpanded, setJobExpanded] = useState(true);
  const toggleJob = () => setJobExpanded(!jobExpanded);

  const [locationExpanded, setLocationExpanded] = useState(true);
  const toggleLocation = () => setLocationExpanded(!locationExpanded);

  const [expandedDesc, setExpandedDesc] = useState({});
  const toggleFreeDescription = (freeId) => {
    setExpandedDesc((prev) => ({
          ...prev,
          [freeId]: !prev[freeId]
      }));
  };
  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

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
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [currentpage, setCurrentpage] = useState(1);
  
  const [hasMore, setHasMore] = useState(false);
  const scrollableFreelancers = useRef(null);
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
  
  const filteredCategories = Object.keys(items1).filter(category => category.toLowerCase().includes(categorySearchQuery.toLowerCase()));

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
  //fetch all freelancers
  useEffect(() => {
    const fetchPostedJobs = async () => {
        try {
            const response = await axios.get(`${BAPI}/api/v0/users/me/jobs`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                  status:"PENDING"
                },
            });

            if (response.status === 200) {
                // console.log(response.data)
                const transformedJobs = response.data.results.map(job => ({
                  value: job.id,
                  label: job.title
              }));
                const postjobs={
                  postedJobsOpts:transformedJobs,
                  postedJobsVal:response.data.results
                }
                setPostedJobs(postjobs); 
            } else {
                console.error('Error fetching posted jobs:', response.data.error);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    fetchPostedJobs();
}, [accessToken]);


const getFreelancers = async(type) => {
  try {
    const param={
      page: type === 1 ? currentpage : 1,
      per_page: 8
    }
    // console.log(currentpage,param)
    const response = await axios.get(`${BAPI}/api/v0/freelancers`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      params: param,
    });
    // console.log(response);

    if (response.status === 200) {
      setCurrentpage(response.data.page+1);
      const client_id = JSON.parse(localStorage.getItem('user'))?.id;
      const freelancers_data = response.data.results.filter(free => free.id !== client_id);
      // console.log(freelancers_data)
      if (type === 2) {
        setAllFreelancers([...freelancers_data]);
      } else {
        setAllFreelancers(prevFree => {
          const newFree = freelancers_data.filter(newFree => !prevFree.some(existingFree => existingFree.id === newFree.id));
          return [...prevFree, ...newFree];
        });
      }

      if (response.data.next) {
        setHasMore(true);
        
      } else {
        setHasMore(false);
      }
    } else {
      console.error('Error fetching freelancers:', response.data.error);
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

  useEffect(() => {    
   getFreelancers(2);
  }, [accessToken]);

  const loadMore=()=>{
    if(hasMore){
    // console.log("Current page is:", currentpage);
     getFreelancers(1)
    }
 }
 useEffect(() => {
   const handleScroll = () => {
     const scrollableDiv = scrollableFreelancers.current;
     const scrollTop = scrollableDiv.scrollTop;
     const clientHeight = scrollableDiv.clientHeight;
     const scrollHeight = scrollableDiv.scrollHeight;
   
     const isAtPercent = scrollTop + clientHeight >= scrollHeight * 0.98;
     if (isAtPercent && hasMore) {
       loadMore();
      //  console.log("loading")
     }
   };
   
   const scrollableDiv = scrollableFreelancers.current;
   if (scrollableDiv) {
     scrollableDiv.addEventListener("scroll", handleScroll);
   }
   return () => {
     if (scrollableDiv) {
       scrollableDiv.removeEventListener("scroll", handleScroll);
     }
   };
 }, [currentpage]);

  const handleJobSelection = (freelancerId, selectedJob) => {
    setSelectedJobs(prevState => ({
      ...prevState,
      [freelancerId]: selectedJob
    }));
  };

  const handleHire = async(freelancerId) => {
    try {
      // Get the selected job for the freelancer
      const selectedJob = selectedJobs[freelancerId];
      if (!selectedJob) {
        alert('No job selected for the freelancer');
        return;
      }
      const correspondingJob = postedJobs.postedJobsVal.find(job => job.id === selectedJob.value);
      if (!correspondingJob) {
        console.error('Corresponding job data not found');
        return;
      }
      const hireData = {
        freelancer_id: freelancerId,
        job_id: selectedJob.value, 
        title: selectedJob.label, 
        location: correspondingJob.location, 
        company_name: correspondingJob.company_name
      };
  
      const response = await axios.post(`${BAPI}/api/v0/jobs/hire-freelancer`, hireData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      if (response.status === 200) {
        // console.log(response.data)
        alert('Sent Job request to Freelancer successfully');
        setSelectedJobs(prevState => ({
          ...prevState,
          [freelancerId]: null
        }));
      } else {
        console.error('Error hiring freelancer:', response.data.error);
      }
    } catch (error) {
      console.error('Error occurred while hiring freelancer:', error);
    }
  };

  // const handleSearch=()=>{
  //   setSearchFreelancers(searchQuery)
  // }

  const filteredFreelancers = allFreelancers
  .filter((freelancer) => {
    if (searchFreelancers && !(freelancer.full_name.toLowerCase().includes(searchFreelancers.toLowerCase()) || freelancer.description.toLowerCase().includes(searchFreelancers.toLowerCase()))) {
      return false;
    }
    if (selectedLocations.length > 0 && (!freelancer.location || !freelancer.location.country || !selectedLocations.includes(freelancer.location.country))) {
      return false;
    }

    // Filter by selected categories
    if (selectedCategories.length > 0 && (!freelancer.role || !selectedCategories.includes(freelancer.role))) {
      return false;
    }
    return true;
  })
  .sort((a, b) => {
    if (sort.value === 'Newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sort.value === 'Cheapest') {
      const rateA = a.rate_per_hour;
      const rateB = b.rate_per_hour;
      return rateA - rateB; 
    }
    return 0;
  });

    const handleSearch=()=>{
    setSearchFreelancers(searchQuery)
  }  
  useEffect(() => {
  handleSearch();
}, [searchQuery]);

  return (
    <div>
      {/* section 1 for header */}
      <Header4 />

      {/* section 2 for box and browse, search bar */}
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
      placeholder="Search for freelancers?"
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
    <FontAwesomeIcon
      icon={faSearch}
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
      bgcolor: "#ff5e3a",
      color: "#fff",
      px: 3,
      fontSize: "16px",
      textTransform: "none",
      "&:hover": {
        bgcolor: "#e44e2e",
      },
    }}
  >
    Search
  </Button>
</Box>
              <Box sx={{display:{md:'block',xs:'none'}}}>
            {/* <Button style={{
              border: 'none', backgroundColor: 'transparent', color: 'white',
              cursor: 'pointer', fontSize: '16px',outline:'none',float:'right'
            }}>   Show Advanced Options</Button> */}
          </Box>
        </div>

        <div >
            <Button sx={{color:category==='freelancers'?'#fff':'#FFFFFFB2',borderBottom:category==='freelancers'?'1px solid #fff':'1px solid transparent',outline:'none',background:'transparent',borderRadius:'0',fontSize:'16px'}} onClick={()=>setcategory('freelancers')}>Freelancers</Button >
          {/* .  <Button sx={{color:category==='projects'?'#fff':'#FFFFFFB2',borderBottom:category==='projects'?'1px solid #fff':'1px solid transparent',outline:'none',background:'transparent',borderRadius:'0',marginLeft:'20px',fontSize:'16px'}} onClick={()=>setcategory('projects')}>Projects</Button > */}
        </div>
      </div>

      <div className="sortingjobs" style={{marginBottom:'30px',cursor:'pointer'}}>
        <Button endIcon={<LiaFilterSolid />} onClick={toggleDrawer(true)} sx={{boxShadow: '0px 0px 4px 0px #00000040',color:'#000',padding:'7px 20px',borderRadius:'16px'}}>Filters</Button>
        <Form>
          <Form.Group className="form-group" controlId="formSortByOptions">
            <span style={{ marginRight: '5px' }}>Sort by:</span>
            <Select
              placeholder=""
              options={sortByOptions}
              value={sort}
              onChange={(selectedOption) => {
                  setSort(selectedOption); 
                  
              }}
              styles={{
                  control: (provided) => ({
                      ...provided,
                      border: 'none',
                      outline: 'none',
                      borderRadius: '16px',
                  }),
              }}
          />
          </Form.Group>
        </Form>
      </div>

      {/* section 3 - responsive drawer for filters  */}
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
                  <FontAwesomeIcon icon={faSearch} style={{
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


      {/* div 4  */}
      <div style={{ marginBottom: '50px', display: 'flex',marginTop:'30px'}} className='browseFreelancers'>
        {/* left box  */}
        <div className='browseFreelancers-left-box'>
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
                  placeholder="Search categories"
                  style={{
                   borderRadius: '16px', boxShadow: '0px 0px 4px 0px #00000040',
                    width:'100%',
                    padding:'10px 0px 10px 35px',
                    border:'none',outline:'none'
                  }}
                />
                <FontAwesomeIcon icon={faSearch} style={{
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
                      <input type="text" placeholder="$ max" style={{ width: '45px',padding:'0 4px' }} />
                      <span style={{ color: '#808080' }}>/hr</span>
                    </label>
                  </div>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  <label>
                    <input type="checkbox"  style={{marginRight:'7px',cursor:'pointer'}} />
                    Fixed-Price
                  </label>
                  <div style={{ marginLeft: '30px', marginTop: '15px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox"  style={{marginRight:'7px',cursor:'pointer'}} />
                        Less than $100
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}  />
                        $100 to $500
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox"  style={{marginRight:'7px',cursor:'pointer'}} />
                        $500 to $1k
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}  />
                        $1k to $5k
                      </label>
                    </div>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <label>
                        <input type="checkbox" style={{marginRight:'7px',cursor:'pointer'}}  />
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
        <div className='browseFreelancers-right-box'  ref={scrollableFreelancers}>
          {filteredFreelancers?.map((freelancer,indx) => (
            <Box key={indx} >
                <Box sx={{padding:{sm:'30px',xs:'18px 16px'}}}>
                  <Box style={{ display: 'flex',flexDirection:'column'}}>
                    <Box style={{ display: 'flex',flexDirection:'row',gap:'20px'}}>
                    {(freelancer.photo_url && freelancer.photo_url!=='') ? (
                                        <img
                                            className='user-picture-img'
                                            alt={freelancer.first_name}
                                            src={freelancer.photo_url}
                                            style={{ borderRadius:'16px',border:'none'}}
                                        />
                                    ) : (
                                      <Avatar variant="square" sx={{textTransform:'uppercase',width:{sm:'200px',xs:'120px'},height:{sm:'200px',xs:'120px'},borderRadius:'16px'}}>

                                        {(freelancer.first_name + " " + freelancer.last_name)?.split(' ').slice(0, 2).map(part => part[0]).join('')}
                                      </Avatar>
                                      
                                    )}
                      <Box style={{ display: 'flex',flexDirection:'column',gap:'5px',width:'100%',height:'auto'}} key={indx*indx} >
                          <Box style={{ display: 'flex',flexDirection:'row',justifyContent:'space-between'}}>
                               <Box style={{ display: 'flex',flexDirection:'column'}}>
                                   <Typography sx={{fontWeight:'700',fontSize:{sm:'28px',xs:'22px'}}}>{freelancer.full_name}</Typography>
                                   <Typography sx={{fontWeight:'500',fontSize:{sm:'17px',xs:'15px'}}}>{freelancer.role}</Typography>
                                   <Typography sx={{fontWeight:'500',fontSize:{sm:'17px',xs:'15px'}}}>${freelancer.rate_per_hour}/hr</Typography>
                               </Box>
                               <Box style={{ display: 'flex',flexDirection:'row',gap:'10px'}}>
                               {/* <img
                                  src={require('../assets/dislikeIcon.png')} 
                                  alt="Dislike"
                                  style={{ cursor: 'pointer', height:'50px', width:'50px', borderRadius:'50%' }}
                                  onClick={() => handleDislikeClick(freelancer.freelancer_id)}  
                                />
                                <img
                                  src={require('../assets/likeIcon.png')}  
                                  alt="Like"
                                  style={{ cursor: 'pointer',height:'50px', width:'50px', borderRadius:'50%' }}
                                  onClick={() => handleLikeClick(freelancer.freelancer_id)}  
                                /> */}
                               </Box>
                          </Box>
                          <Box>
                          <Typography sx={{ fontWeight: '500', fontSize: { sm: '17px', xs: '15px' }, color: '#454545' }}>
                                   {expandedDesc[freelancer.id] ? freelancer.description : truncateText(freelancer.description, 40)}
                                    {!expandedDesc[freelancer.id] && freelancer.description.split(' ').length > 40 && (
                                        <Button onClick={() => toggleFreeDescription(freelancer.id)} sx={{ padding: 0, textTransform: 'none', color: '#B27EE3', fontSize: '14px' }}>Read More</Button>
                                    )}
                                    {expandedDesc[freelancer.id] && (
                                        <Button onClick={() => toggleFreeDescription(freelancer.id)} sx={{ padding: 0, textTransform: 'none', color: '#B27EE3', fontSize: '14px' }}>Read Less</Button>
                                    )}
                            </Typography>
                          </Box>
                      </Box>
                    </Box>
                    <Box sx={{margin:{sm:'15px 0 5px 0',xs:'10px 0 3px 0'}}}>
                      <ul style={{display:'flex',flexWrap:'wrap',gap:'15px'}}>
                        {
                          freelancer.skills.map((skill, index)=><li key={index} style={{fontSize:'16px',padding:"10px 25px",backgroundColor:'#E9E9E9',color:'#000000',borderRadius:'16px',width:'fit-content',fontWeight:'500'}}>{skill}</li>)
                        }
                        
                      </ul>
                    </Box>
                    <Box sx={{marginTop:'15px',display:'flex',flexDirection:'row',gap:'20px',flexWrap:'wrap'}}>
                    <Select
                        options={postedJobs.postedJobsOpts}
                        placeholder="Select"
                        name="Job_Category"
                        value={setSelectedJobs[freelancer.id]}
                        onChange={(selectedOption) => handleJobSelection(freelancer.id, selectedOption)}
                        className='form-val-two_brfre'
                        styles={{ control: (provided) => ({ ...provided, border:'none', cursor:'pointer' }) }}
                      />
                      <Button onClick={()=>{handleHire(freelancer.id)}} sx={{color: 'white',backgroundColor: '#B27EE3',borderRadius: '16px',padding:'6px 40px',fontSize:'16px',':hover':{color: 'white',backgroundColor: '#B27EE3'}}}>Hire</Button>
                    </Box>
                  </Box>
              </Box>
              {
              // (indx !== allFreelancers.length - 1 || allFreelancers.length===1) && 
              <Divider />}
            </Box>
          ))}
        </div>
      </div>

     </div>
  )
}
export default BrowseFreelancer;