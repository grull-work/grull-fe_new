import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Signup.css';
import Button from '@mui/material/Button';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import grullLogo from "../assets/grullLogoPurple.svg"
import { useLocation } from 'react-router-dom';
import BAPI from '../helper/variable';

import { jwtDecode } from "jwt-decode";
import { signInWithGooglePopup, getGoogleRedirectResult } from '../utils/firebase.utils';
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

  useEffect(() => {
    // Check for redirect result when component mounts
    const checkRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult();
        if (result) {
          console.log("Redirect result found:", result.user.email);
          await googleLogin(result);
        }
      } catch (error) {
        if (error.message !== 'Redirect initiated') {
          console.error("Error checking redirect result:", error);
        }
      }
    };

    checkRedirectResult();
  }, []);

  const googleLogin = async (credentialResponse) => {
    const data = credentialResponse.user;

    // 1. Try to Login
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.uid); // Using UID as password

    try {
      let response = await fetch(`${BAPI}/api/v0/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      // 2. If 'User not found' (typically 400 or 404 depending on your backend, but 404 was observed), Try Registering
      if (!response.ok) {
        // Check if it's an authentication failure that implies "User needs account"
        // Note: Backend might return 400 for 'Wrong credentials'. 
        // If we are sure it's Google Auth with UID, failure usually means user doesn't exist.

        console.log("Login failed, attempting to register new Google user...");

        const registrationData = {
          email: data.email,
          password: data.uid,
          first_name: data.displayName?.split(' ')[0] || 'User',
          last_name: data.displayName?.split(' ').slice(1).join(' ') || 'Account',
          list_as_freelancer: false // Default to client for Login page flux, or ask user? Defaulting to Client for safety.
        };

        if (registrationData.password.length < 3) registrationData.password += '123';

        const regResponse = await fetch(`${BAPI}/api/v0/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData),
        });

        if (regResponse.status === 201) {
          // Registration Successful, Retry Login
          response = await fetch(`${BAPI}/api/v0/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData,
          });
        } else {
          // Registration failed (maybe genuine error)
          const err = await regResponse.json().catch(() => ({}));
          if (regResponse.status !== 400 || err.detail !== 'REGISTER_USER_ALREADY_EXISTS') {
            toast.error("Could not create account with Google.");
            return;
          }
          // If it says already exists, we continue to process the original login error (which was weird)
        }
      }

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.access_token) {
          localStorage.setItem('accessToken', responseData.access_token);
          toast.success('Successfully signed in!');

          // Get user info
          try {
            const userResponse = await fetch(`${BAPI}/api/v0/users/me`, {
              headers: { 'Authorization': `Bearer ${responseData.access_token}` }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData.list_as_freelancer) {
                navigate('/freelancer');
              } else {
                navigate('/client');
              }
            } else {
              navigate('/loading');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('/loading');
          }
        } else {
          toast.error('Unexpected response from server');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login final failure:", errorData);
        toast.error(errorData.detail || 'Authentication failed.');
      }

    } catch (error) {
      console.error("Login process error:", error);
      toast.error("An error occurred during login.");
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

          // Show success message
          toast.success('Successfully signed in! Redirecting to dashboard...');

          // Get user info to determine dashboard type
          try {
            const userResponse = await fetch(`${BAPI}/api/v0/users/me`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              const userType = userData.list_as_freelancer ? 'freelancer' : 'client';

              // Redirect to appropriate dashboard
              if (userData.list_as_freelancer) {
                navigate('/freelancer');
              } else {
                navigate('/client');
              }
            } else {
              // Fallback to loading page
              navigate('/loading');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            navigate('/loading');
          }
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

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const logGoogleUser = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      const response = await signInWithGooglePopup();
      await googleLogin(response);
    } catch (error) {
      if (error.message === 'Redirect initiated') {
        // Redirect is happening, no need to show error
        console.log("Redirect initiated for Google sign-in");
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.warn("Google sign-in popup closed by user.");
        toast('Sign-in cancelled', { icon: 'ℹ️' });
      } else {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div>
      <div className='headerStyle'>
        <img src={grullLogo} alt="Grull" className='header-logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
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
              <Button className='google-button' disabled={isGoogleLoading} onClick={logGoogleUser} startIcon={<FcGoogle style={{ backgroundColor: '#fff', borderRadius: '50%', fontSize: '25px' }} />}>Continue with Google</Button>
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
            <form>

              <div className="mb-3 form-group" style={{ display: 'flex', marginTop: '50px' }}>
                <input className='form-vals-two form-control' type="email" name='email' placeholder="Email" />
              </div>

              <div className="mb-3 form-group" style={{ display: 'flex' }}>
                <input className='form-vals-two form-control' type="password" name='password' placeholder="Password (8 or more Characters)" />
              </div>

            </form>

            <button className='create-account-button' onClick={handleLoginClick}>Log In</button>
            <h5 style={{ fontWeight: 'normal', color: '#656565', fontSize: '16px' }}>
              New to Grull?{' '}
              <a style={{ color: '#b27ee3', textDecoration: 'none', fontWeight: '700', cursor: 'pointer' }} onClick={() => handleSignupClick()}>
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