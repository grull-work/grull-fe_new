import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BAPI from '../helper/variable';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Checking authentication...');
      
              if (!accessToken) {
          console.log('ProtectedRoute: No access token found, redirecting to home');
          toast.error('Please login to access this page');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

      try {
        console.log('ProtectedRoute: Validating token with backend...');
        const response = await fetch(`${BAPI}/api/v0/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          console.log('ProtectedRoute: Authentication successful');
          setIsAuthenticated(true);
        } else {
          console.log('ProtectedRoute: Token validation failed, redirecting to home');
          // Token is invalid or expired
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          toast.error('Session expired. Please login again');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('ProtectedRoute: Authentication check failed:', error);
        // Network error or other issues - treat as unauthorized
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        toast.error('Network error. Please check your connection and try again');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [accessToken]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
