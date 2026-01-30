import React from "react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const PaymentByClient=()=>{
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
  
    const ClickBrowseFreelancer = () => {
      navigate('/browsefreelancer');
    }
  
    const ClickPostJobs=()=>{
      navigate('/postjob');
    }
  
    const handleImage2Click = () => {
  
    }
    const handleImage3Click = () => {
  
    }

   return (
     <div>

      
      {/* div 2 for left and right box */}
      <div className="left-and-right-box" style={{marginTop:'30px'}}>
        

      </div>

     </div>
   )
}

export default PaymentByClient;