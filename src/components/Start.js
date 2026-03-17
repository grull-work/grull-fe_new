import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPageHeader.css';
import grullLogo from "../assets/grullLogoPurple.svg"
import { toast } from 'react-hot-toast'; 

const Start = () => {
  const [usertype,setUsertype]=useState('');
  const navigate = useNavigate();

  const handleLoginClick1 = () => {
    navigate('/login');
  };

  const handleLoginClick2 = () => {
    if (usertype === '') {
      toast.error('Select User Type!');
    } else {
      navigate(`/signup/${usertype}`);
    }
  };

  const handleBoxClick=(user)=>{
    setUsertype(user);
  }

  return (
    <div >
      <div className='headerStyle'>
        <img src={grullLogo} alt="Grull" className='header-logo' onClick={()=>navigate('/')} style={{cursor:'pointer'}} />
      </div>
      <div className='startpage'>
        <div className='one'>
          <h2 >Join Grull as a Freelancer or Client</h2>
        </div>

        <div className='jointype-container'>
            <div className='join-type' onClick={()=>{handleBoxClick('freelancer')}} style={{backgroundColor:usertype==='freelancer'?'#f0ddff':'white',borderColor:usertype==='freelancer'?'#ddbaf8':'lightgray'}}>
                  <img className='join-typeimg' src={require("../assets/Character_4_Studying.png")} alt="Freelancer" />
                  <p className='join-type1'>I'm an independent</p>
                  <p className='join-type2'>Find work and manage your freelance business</p>
            </div>
            <div className='join-type' onClick={()=>{handleBoxClick('client')}} style={{backgroundColor:usertype==='client'?'#f0ddff':'white',borderColor:usertype==='client'?'#ddbaf8':'lightgray'}}>
                  <img className='join-typeimg' src={require("../assets/Character_4_Social.png")} alt="Client" />
                  <p className='join-type1'>I'm hiring</p>
                  <p className='join-type2'>Post opportunities and hire for a project</p> 
            </div>
        </div>

        <div className='two'>
            <h5 style={{fontWeight:'normal'}}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#b27ee3', textDecoration: 'none',fontWeight:'700',cursor:'pointer' }} onClick={(e) => { e.preventDefault(); handleLoginClick1(); }}>
              Log In
            </a>
          </h5>
          <button onClick={handleLoginClick2}> Create Account</button>
        </div>
        
      </div>
      
    </div>
  );
};

export default Start;
