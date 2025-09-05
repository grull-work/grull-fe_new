import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Signup.css';
import Button from '@mui/material/Button';
import BAPI from '../helper/variable';
import grullLogo from "../assets/grullLogoPurple.svg";
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef([]);

    // Get user data from location state
    const userData = location.state?.userData;
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/signup');
            return;
        }
        startCountdown();
    }, [email, navigate]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const startCountdown = () => {
        setCountdown(60); // 60 seconds countdown
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BAPI}/api/v0/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp_code: otpString
                }),
            });

            if (response.ok) {
                toast.success('Email verified successfully!');
                
                // Now proceed with user registration
                if (userData) {
                    await registerUser(userData);
                } else {
                    navigate('/login');
                }
            } else {
                const errorData = await response.json();
                toast.error(errorData.detail || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (userData) => {
        try {
            // Use the new signup-with-otp endpoint that handles both OTP verification and user creation
            const response = await fetch(`${BAPI}/api/v0/auth/signup-with-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    otp_code: otp.join('') // Include the OTP code
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                toast.success('User registered successfully!');
                
                // Show success message and redirect to login
                toast.success('User registered successfully! Please login to continue.');
                
                // Redirect to login page
                navigate('/login');
            } else if (response.status === 400) {
                const errorData = await response.json();
                toast.error(errorData.detail || 'User already exists');
            } else {
                console.error('Unexpected response:', response);
                toast.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('Registration failed');
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        try {
            const response = await fetch(`${BAPI}/api/v0/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                }),
            });

            if (response.ok) {
                toast.success('OTP resent successfully!');
                startCountdown();
            } else {
                const errorData = await response.json();
                toast.error(errorData.detail || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error('Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    const handleBackToSignup = () => {
        navigate('/signup');
    };

    return (
        <div>
            <div className='headerStyle'>
                <img 
                    src={grullLogo} 
                    alt="Grull" 
                    className='header-logo' 
                    onClick={() => navigate('/')} 
                    style={{cursor: 'pointer'}} 
                />
            </div>
            <div>
                <div className='res-content'>
                    <h2>Verify your email</h2>
                </div>
                <div className='outer-most'>
                    <div className='content'>
                        <h2>Verify your email</h2>
                        <p style={{ color: '#656565', marginBottom: '30px' }}>
                            We've sent a verification code to <strong>{email}</strong>
                        </p>

                        {loading && (
                            <Box sx={{ width: '100%', marginBottom: '20px' }}>
                                <LinearProgress />
                            </Box>
                        )}

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                justifyContent: 'center',
                                marginBottom: '20px'
                            }}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '10px',
                                            textAlign: 'center',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            outline: 'none',
                                            transition: 'border-color 0.3s'
                                        }}
                                        maxLength={1}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#b27ee3';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e0e0e0';
                                        }}
                                    />
                                ))}
                            </div>
                            <p style={{ 
                                fontSize: '14px', 
                                color: '#656565', 
                                textAlign: 'center',
                                margin: '0'
                            }}>
                                Enter the 6-digit code sent to your email
                            </p>
                        </div>

                        <Button 
                            className='create-account-button' 
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.join('').length !== 6}
                            style={{ marginBottom: '20px' }}
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </Button>

                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <p style={{ 
                                fontSize: '14px', 
                                color: '#656565', 
                                margin: '0 0 10px 0'
                            }}>
                                Didn't receive the code?
                            </p>
                            <Button
                                onClick={handleResendOTP}
                                disabled={resendLoading || countdown > 0}
                                style={{
                                    color: countdown > 0 ? '#a3a3a3' : '#b27ee3',
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                {countdown > 0 
                                    ? `Resend in ${countdown}s` 
                                    : resendLoading 
                                        ? 'Sending...' 
                                        : 'Resend Code'
                                }
                            </Button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Button
                                onClick={handleBackToSignup}
                                style={{
                                    color: '#656565',
                                    textTransform: 'none',
                                    fontSize: '14px'
                                }}
                            >
                                ← Back to Sign Up
                            </Button>
                        </div>
                    </div>
                    <div className='content2'>
                        <img 
                            className='image' 
                            src={require("../assets/signupImg.png")} 
                            alt="OTP Verification" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
