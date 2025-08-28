import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Signup.css';
import Select from 'react-select';
import Button from '@mui/material/Button';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import BAPI from '../helper/variable';
import grullLogo from "../assets/grullLogoPurple.svg"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { signInWithGooglePopup } from '../utils/firebase.utils';
import { toast } from 'react-hot-toast'; 


const SignUp = () => {
    
    const navigate = useNavigate();
    const [isReceiveEmailsChecked, setReceiveEmailsChecked] = useState(false);
    const [isAgreeToTermsChecked, setAgreeToTermsChecked] = useState(false);
    const [loading,setLoading]=useState("")
    const handleLoginClick = () => {
        navigate('/login');
    };
    const { userType } = useParams();

    const googleSignup = async (credentialResponse) => {
        const data = credentialResponse._tokenResponse;
        console.log('credentialResponse:', credentialResponse);
        
        if (!data || typeof data.idToken !== 'string') {
            console.error('Invalid token specified: must be a string');
            return;
        }
        // return
        try {
    
            const registrationData = {
                email: data.email || '',
                password: data.localId || '',
                first_name: data.firstName || '',
                last_name: data.lastName || '',
                list_as_freelancer: userType === 'freelancer' ? true : false
            };
            
             console.log(registrationData);
            const response = await fetch(`${BAPI}/api/v0/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });
    
            console.log('Registration Response:', response);
    
            if (response.status === 201) {
                toast.success('User registered Successfully!');
                // navigate('/login');
    
                const formData = new URLSearchParams();
                formData.append("username", data.email);
                formData.append("password", data.localId);
    
                const loginResponse = await fetch(`${BAPI}/api/v0/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData,
                });
    
                if (loginResponse.ok) {
                    const responseData = await loginResponse.json();
    
                    if (responseData.access_token) {
                        const accessToken = responseData.access_token;
                        console.log('Access Token:', accessToken);
                        localStorage.setItem('accessToken', accessToken);
                        navigate('/loading');
                    } else {
                        setLoading("");
                        toast.error('Unexpected response from the server');
                    }
                } else if (loginResponse.status === 400) {
                    setLoading("");
                    toast.error('Wrong credentials or invalid user');
                } else if (loginResponse.status === 422) {
                    setLoading("");
                    const errorData = await loginResponse.json();
                    console.error('Validation Error:', errorData);
                } else {
                    setLoading("");
                    toast.error('Unexpected response from the server');
                }
            } else if (response.status === 400) {
                setLoading("");
                toast.error('User Already Exists');
            } else {
                setLoading("");
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            setLoading("");
            console.error('Error during registration:', error);
        }
    };
    
    const handleCreateAccountClick = async () => {
        if (isAgreeToTermsChecked) {
        const firstName = document.querySelector('[name="First_name"]').value;
        const lastName = document.querySelector('[name="Last_name"]').value;
        const email = document.querySelector('[name="email"]').value;
        const mobileNumber = document.querySelector('[name="MobileNumber"]').value;
        const password = document.querySelector('[name="password"]').value;

        // Check if email and password are not empty
        if (email.trim() === '') {
            toast.error('Email field cannot be empty');
            return;
        }

        if (password.trim() === '') {
            toast.error('Password field cannot be empty');
            return;
        }
        
        const registrationData = {
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
            list_as_freelancer:userType==='freelancer'
          };

        setLoading("Sending OTP...");
        try {
            // First, send OTP for email verification
            const otpResponse = await fetch(`${BAPI}/api/v0/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                }),
            });

            if (otpResponse.ok) {
                toast.success('OTP sent to your email!');
                setLoading("");
                // Navigate to OTP verification page with user data
                navigate('/otp-verification', {
                    state: {
                        userData: registrationData,
                        email: email
                    }
                });
            } else if (otpResponse.status === 400) {
                const errorData = await otpResponse.json();
                toast.error(errorData.detail || 'Failed to send OTP');
                setLoading("");
            } else {
                toast.error('Failed to send OTP');
                setLoading("");
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP');
            setLoading("");
        }
    } else {
        toast.error('Please agree to the terms to proceed.')    
    }
    };

    const countryOptions = [
        { value: 'India', label: 'India' },
        { value: 'USA', label: 'USA' },
        { value: 'Canada', label: 'Canada' },
    ];

    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        // console.log(response);
        await googleSignup(response)
    }
    return (
        <div>
            <div className='headerStyle'>
        <img src={grullLogo} alt="Grull" className='header-logo' onClick={()=>navigate('/')} style={{cursor:'pointer'}} />
            </div>
            <div>
            <div className='res-content'>
                <h2>Complete your Grull profile</h2>
              
            </div>
            <div className='outer-most'>
                <div className='content'>
                <h2>Complete Your Grull profile</h2>

               {loading && <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>}
                    {/* <div>
                        <Button className='apple-button' startIcon={<FaApple style={{fontSize:'23px',}}/>}>Continue with Apple</Button>
                    </div> */}
            <div>
                <Button className='google-button' onClick={logGoogleUser} startIcon={<FcGoogle style={{backgroundColor:'#fff',borderRadius:'50%',fontSize:'25px'}}/>}>Continue with Google</Button>
            </div>

{/* <GoogleOAuthProvider clientId="493236703003-bigdauplfj2os7cahbp2903m7ug1inve.apps.googleusercontent.com">
              <GoogleLogin
              buttonText="Sign up with Google"
  onSuccess={credentialResponse => {
    googleSignup(credentialResponse)
  }}
  onError={() => {
    toast.error("Signup Failed")
  }}
/>
                </GoogleOAuthProvider> */}


            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                <hr className='hr-line' />
                <h3 style={{ color: '#a3a3a3', fontWeight: 'normal', margin: '0 10px' }}>OR</h3>
                <hr className='hr-line' />
            </div> 

                    <Form>
                        <div style={{ display: 'flex', gap: '15px',justifyContent:'space-between',marginTop:'30px' }} >
                            <Form.Group className='form-group' controlId="formBasicFirstName" style={{display:'flex',flex:1}}>
                                <Form.Control className='form-vals' type="text" name='First_name' placeholder="First Name" />
                            </Form.Group>
                            <Form.Group className='form-group' controlId="formBasicLastName" style={{display:'flex',flex:1}}>
                                <Form.Control className='form-vals' type="text" name='Last_name' placeholder="Last Name" />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3 form-group" controlId="formBasicEmail" style={{display:'flex'}}>
                            <Form.Control className='form-vals-two' type="email" name='email' placeholder="Email" />
                        </Form.Group>

                        <Form.Group className="mb-3 form-group" controlId="formBasicMobile" style={{display:'flex'}}>
                            <Form.Control className='form-vals-two' type="text" name="MobileNumber" placeholder="Mobile Number"
                                pattern="[0-9]{10}" // Specify the pattern for a 10-digit number
                                title="Please enter a 10-digit mobile number" required />
                        </Form.Group>

                        <Form.Group className="mb-3 form-group" controlId="formBasicPassword" style={{display:'flex'}}>
                            <Form.Control className='form-vals-two' type="password" name='password' placeholder="Password (8 or more Characters)" />
                        </Form.Group>

                        <Form.Group className="mb-3 form-group" controlId="formBasicCountry">
                            <Select 
                                options={countryOptions} placeholder="Select Country"
                                styles={{ control: (provided) => ({ ...provided, borderRadius: '10px', height: '2px',width:'100%',textAlign:'left',padding:'0 10px ' }) }}
                            />
                        </Form.Group>
                    </Form>

                    <div style={{marginBottom:'15px'}}>
                        <div style={{ display: 'flex', marginTop: '12px', marginBottom: '10px' }}>
                            <input type="checkbox" style={{ marginRight: '10px' }} checked={isReceiveEmailsChecked} onChange={() => setReceiveEmailsChecked(!isReceiveEmailsChecked)} />
                            <span style={{ fontSize: '14px',color:'#656565' }}>Send me helpful emails to find regarding work and job leads.</span>
                        </div>

                        <div style={{ display: 'flex', marginTop: '5px' }}>
                            <input type="checkbox" style={{ marginRight: '10px' }} checked={isAgreeToTermsChecked} onChange={() => setAgreeToTermsChecked(!isAgreeToTermsChecked)} />
                            <p style={{ fontSize: '14px', margin: '0',color:'#656565' }}>Yes, I understand and agree to the Grull Terms of Service, including the User Agreement and Privacy Policy.</p>
                        </div>
                    </div>

                    <Button className='create-account-button' onClick={handleCreateAccountClick} >Create my account</Button>
                    <h5 style={{fontWeight:'normal',color: '#656565',fontSize: '16px'}}>
                            Already have an account?{' '}
                            <a style={{ color: '#b27ee3', textDecoration: 'none',fontWeight:'700',cursor:'pointer' }} onClick={handleLoginClick}>
                            Log In
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

export default SignUp;