import React, { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Signup.css';
import Button from '@mui/material/Button';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import grullLogo from "../assets/grullLogoPurple.svg"
import { useLocation } from 'react-router-dom';
import BAPI from '../helper/variable';
// import { GoogleLogin } from 'react-google-login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { signInWithGooglePopup } from '../utils/firebase.utils';
import toast from 'react-hot-toast';

const Login = () => {
  const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOGGLE_REDIRECT_URL_ENDPOINT } = process.env
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
    const navigate = useNavigate();

    const handleSignupClick = () => {
        navigate('/home');
    };

    const googleLogin=async(credentialResponse)=>{
      const data =(credentialResponse.user)
      console.log(data.email);
      // return

      // const formData = new URLSearchParams();
      //   formData.append("email", data.email);
       
    
        const response = await fetch(`${BAPI}/api/v0/auth/google/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email:data.email
          }),
        });
    
        if (response.ok) {
          const responseData = await response.json();
          // console.log(responseData)
          if (responseData.access_token) {
            const accessToken = responseData.access_token;
            console.log(accessToken);
            localStorage.setItem('accessToken', accessToken);
            navigate('/loading');
          } else {
            toast.error('Unexpected response from the server');
          }
        } else if (response.status === 400) {
          toast.error('Wrong credentials or invalid user');
        } else if (response.status === 422) {
          const errorData = await response.json();
          console.error('Validation Error:', errorData);
        } else {
          toast.error('Unexpected response from the server');
        }
      

    }

    // const openGoogleLoginPage = useCallback(() => {
    //   const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      
    //   const scope = [
    //     "https://www.googleapis.com/auth/userinfo.email",
    //     "https://www.googleapis.com/auth/userinfo.profile",
    //   ].join(" ");
  
    //   const params = new URLSearchParams({
    //     response_type: "code",
    //     client_id: "REACT_APP_GOOGLE_CLIENT_ID",
    //     redirect_uri: `http://localhost:3000/google`,
    //     prompt: "select_account",
    //     access_type: "offline",
    //     scope,
    //   });
  
    //   const url = `${googleAuthUrl}?${params}`;
    //   console.log("googleauth url is : ", url);
    //   window.location.href = url;
    // }, []);

    const handleLoginClick = async () => {
      try {
        const email = document.querySelector('[name="email"]').value;
        const password = document.querySelector('[name="password"]').value;
    
        if (!email.trim() || !password.trim()) {
          toast.error('Email and password cannot be empty');
          return;
        }
    
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);
    
        const response = await fetch(`${BAPI}/api/v0/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });
    
        if (response.ok) {
          const responseData = await response.json();
    
          if (responseData.access_token) {
            const accessToken = responseData.access_token;
            console.log(accessToken);
            localStorage.setItem('accessToken', accessToken);
            navigate('/loading');
          } else {
            toast.error('Unexpected response from the server');
          }
        } else if (response.status === 400) {
          toast.error('Wrong credentials or invalid user');
        } else if (response.status === 422) {
          const errorData = await response.json();
          console.error('Validation Error:', errorData);
        } else {
          toast.error('Unexpected response from the server');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };

    const logGoogleUser = async () => {
      const response = await signInWithGooglePopup();
      // console.log(response);
      await googleLogin(response)
  }

    return (
      <div>
      <div className='headerStyle'>
          <img src={grullLogo} alt="Grull" className='header-logo' onClick={()=>navigate('/')} style={{cursor:'pointer'}} />
      </div>
      <div>
      <div className='res-content'>
          <h2>Complete Your Grull profile</h2>
      </div>
      <div className='outer-most'>
          <div className='content'>
          <h2>Login to your Grull profile</h2>
          {/* <button onClick={logGoogleUser}>Sign In With Google</button> */}
              {/* <div>
                  <Button className='apple-button' startIcon={<FaApple style={{fontSize:'23px',}}/>}>Continue with Apple</Button>
              </div> */}
              <div>
                  <Button className='google-button' onClick={logGoogleUser} startIcon={<FcGoogle style={{backgroundColor:'#fff',borderRadius:'50%',fontSize:'25px'}}/>}>Continue with Google</Button>
              </div>


              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                  <hr className='hr-line' />
                  <h3 style={{ color: '#a3a3a3', fontWeight: 'normal', margin: '0 10px' }}>OR</h3>
                  <hr className='hr-line' />
              </div>
              {/* <GoogleOAuthProvider clientId="493236703003-bigdauplfj2os7cahbp2903m7ug1inve.apps.googleusercontent.com">
              <GoogleLogin
              buttonText="Sign in with Google"
  onSuccess={credentialResponse => {
    googleLogin(credentialResponse)
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
                </GoogleOAuthProvider> */}
              <Form>
                  

                  <Form.Group className="mb-3 form-group" controlId="formBasicEmail" style={{display:'flex',marginTop:'50px'}}>
                      <Form.Control className='form-vals-two' type="email" name='email' placeholder="Email" />
                  </Form.Group>

                  <Form.Group className="mb-3 form-group" controlId="formBasicPassword" style={{display:'flex'}}>
                      <Form.Control className='form-vals-two' type="password" name='password' placeholder="Password (8 or more Characters)" />
                  </Form.Group>

              </Form>

              <button className='create-account-button' onClick={handleLoginClick}>Log In</button>
                    <h5 style={{fontWeight:'normal',color: '#656565',fontSize: '16px'}}>
                        New to Grull?{' '}
                        <a style={{ color: '#b27ee3', textDecoration: 'none',fontWeight:'700',cursor:'pointer' }} onClick={()=>handleSignupClick()}>
                            Sign Up
                        </a>
                    </h5>
          </div>
          <div className='content2'>
              <img className='image' src={require("../assets/signupImg.png")} alt="Signup" />
          </div>
      </div>
  </div>
</div>
    );
}

export default Login;