import React, { useEffect } from 'react'
import BAPI from '../helper/variable';
import { useNavigate } from 'react-router-dom';

export default function Loading() {
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate()
    
    useEffect(()=>{
        const infofetch=async()=>{
         try {
           if (!accessToken) {
             // No token found, redirect to home
             navigate('/');
             return;
           }
           
           const response = await fetch(
             `${BAPI}/api/v0/users/me`,
             {
               method: 'GET',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${accessToken}`,
               },
             }
           );
           
           if (response.ok) {
             const responseData = await response.json();
             if(responseData.list_as_freelancer===true){
               navigate('/freelancer')
             } else {
               navigate('/client')
             }
           } else {
             // Token is invalid or expired
             localStorage.removeItem('accessToken');
             localStorage.removeItem('user');
             navigate('/');
           }
          
         } catch (error) {
           console.error('Error during fetching data:', error);
           // Network error or other issues - redirect to home
           localStorage.removeItem('accessToken');
           localStorage.removeItem('user');
           navigate('/');
         }
        }
        infofetch();
   },[accessToken, navigate]);
 
  return (
    <div>
      
    </div>
  )
}
