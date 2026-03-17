import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Signup.css';
import { Button, TextField, MenuItem, Box } from '@mui/material';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import BAPI from '../helper/variable';
import grullLogo from "../assets/grullLogoPurple.svg"
import { jwtDecode } from "jwt-decode";
import LinearProgress from '@mui/material/LinearProgress';
import { signInWithGooglePopup } from '../utils/firebase.utils';
import { toast } from 'react-hot-toast';


const SignUp = () => {

    const navigate = useNavigate();
    const [isReceiveEmailsChecked, setReceiveEmailsChecked] = useState(false);
    const [isAgreeToTermsChecked, setAgreeToTermsChecked] = useState(false);
    const [loading, setLoading] = useState("")
    const handleLoginClick = () => {
        navigate('/login');
    };
    const { userType } = useParams();

    const googleSignup = async (credentialResponse) => {
        const data = credentialResponse.user;
        console.log('Processing Google Sign-In for:', data.email);

        if (!data || !data.email) {
            console.error('Invalid user data: email is required');
            toast.error("Could not retrieve email from Google.");
            setLoading("");
            return;
        }

        try {
            const registrationData = {
                email: data.email,
                password: data.uid, // Using Firebase UID as password
                first_name: data.displayName?.split(' ')[0] || 'User',
                last_name: data.displayName?.split(' ').slice(1).join(' ') || '',
                list_as_freelancer: userType === 'freelancer' ? true : false
            };

            // Password length validation fix for backend requirement
            if (registrationData.password.length < 3) {
                registrationData.password += '123';
            }

            // Attempt Registration
            const response = await fetch(`${BAPI}/api/v0/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            // If User Already Exists (400) OR Registration Success (201), proceed to Login
            if (response.status === 201 || (response.status === 400)) {

                if (response.status === 201) {
                    toast.success('User registered Successfully!');
                } else {
                    // Check if the 400 was actually because user exists
                    const errorData = await response.clone().json().catch(() => ({}));
                    if (errorData.detail === 'REGISTER_USER_ALREADY_EXISTS') {
                        console.log("User already exists, logging in...");
                        // Proceed to login silently
                    } else {
                        // It was a different 400 error (e.g. invalid password)
                        toast.error(errorData.detail || 'Registration failed.');
                        setLoading("");
                        return;
                    }
                }

                // Perform Login
                const formData = new URLSearchParams();
                formData.append("username", data.email);
                formData.append("password", data.uid);

                const loginResponse = await fetch(`${BAPI}/api/v0/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData,
                });

                if (loginResponse.ok) {
                    const responseData = await loginResponse.json();
                    if (responseData.access_token) {
                        localStorage.setItem('accessToken', responseData.access_token);
                        toast.success('Successfully signed in with Google!');

                        // Fetch user profile to redirect correctly
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
                        setLoading("");
                        toast.error('Login succeeded but no token received.');
                    }
                } else {
                    setLoading("");
                    const errorData = await loginResponse.json();
                    toast.error(errorData.detail || 'Login failed after Google auth.');
                }

            } else {
                setLoading("");
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.detail || 'Registration failed.');
            }
        } catch (error) {
            setLoading("");
            console.error('Error during Google Auth process:', error);
            toast.error("An error occurred during authentication.");
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
                list_as_freelancer: userType === 'freelancer'
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
        try {
            const response = await signInWithGooglePopup();
            if (response && response.user) {
                await googleSignup(response);
            }
        } catch (error) {
            if (error.message === 'Redirect initiated') {
                return; // Redirect is handling it
            }
            if (error.code === 'auth/popup-closed-by-user') {
                toast('Sign-in cancelled', { icon: 'ℹ️' });
            } else {
                console.error("Google Log In Error:", error);
                toast.error("Google Sign-In failed.");
            }
        }
    };
    return (
        <div>
            <div className='headerStyle'>
                <img src={grullLogo} alt="Grull" className='header-logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
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
                            <Button className='google-button' onClick={logGoogleUser} startIcon={<FcGoogle style={{ backgroundColor: '#fff', borderRadius: '50%', fontSize: '25px' }} />}>Continue with Google</Button>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }} >
                                <div className='form-group' style={{ display: 'flex', flex: 1 }}>
                                    <TextField fullWidth className='form-vals' name='First_name' placeholder="First Name" />
                                </div>
                                <div className='form-group' style={{ display: 'flex', flex: 1 }}>
                                    <TextField fullWidth className='form-vals' name='Last_name' placeholder="Last Name" />
                                </div>
                            </div>

                            <div className="mb-3 form-group" style={{ display: 'flex' }}>
                                <TextField fullWidth className='form-vals-two' type="email" name='email' placeholder="Email" />
                            </div>

                            <div className="mb-3 form-group" style={{ display: 'flex' }}>
                                <TextField fullWidth className='form-vals-two' type="text" name="MobileNumber" placeholder="Mobile Number"
                                    inputProps={{
                                        pattern: "[0-9]{10}",
                                        title: "Please enter a 10-digit mobile number"
                                    }} required />
                            </div>

                            <div className="mb-3 form-group" style={{ display: 'flex' }}>
                                <TextField fullWidth className='form-vals-two' type="password" name='password' placeholder="Password (8 or more Characters)" />
                            </div>

                            <div className="mb-3 form-group">
                                <TextField
                                    select
                                    defaultValue=""
                                    fullWidth
                                    placeholder="Select Country"
                                    InputProps={{
                                        style: { borderRadius: '10px', textAlign: 'left' }
                                    }}
                                >
                                    {countryOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', marginTop: '12px', marginBottom: '10px' }}>
                                <input type="checkbox" style={{ marginRight: '10px' }} checked={isReceiveEmailsChecked} onChange={() => setReceiveEmailsChecked(!isReceiveEmailsChecked)} />
                                <span style={{ fontSize: '14px', color: '#656565' }}>Send me helpful emails to find regarding work and job leads.</span>
                            </div>

                            <div style={{ display: 'flex', marginTop: '5px' }}>
                                <input type="checkbox" style={{ marginRight: '10px' }} checked={isAgreeToTermsChecked} onChange={() => setAgreeToTermsChecked(!isAgreeToTermsChecked)} />
                                <p style={{ fontSize: '14px', margin: '0', color: '#656565' }}>Yes, I understand and agree to the Grull Terms of Service, including the User Agreement and Privacy Policy.</p>
                            </div>
                        </div>

                        <Button className='create-account-button' onClick={handleCreateAccountClick} >Create my account</Button>
                        <h5 style={{ fontWeight: 'normal', color: '#656565', fontSize: '16px' }}>
                            Already have an account?{' '}
                            <a style={{ color: '#b27ee3', textDecoration: 'none', fontWeight: '700', cursor: 'pointer' }} onClick={handleLoginClick}>
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