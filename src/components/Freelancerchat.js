import { Avatar, Box, Button, Divider, IconButton, InputBase, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { RxDotsHorizontal } from "react-icons/rx";
import { RiEdit2Line } from "react-icons/ri";
import Header3 from './Header3'
import { CiSearch } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { CiFilter } from "react-icons/ci";
import Form from 'react-bootstrap/Form';
import '../styles/Chat.css'
import { MdAddPhotoAlternate } from "react-icons/md";
import Modal from '@mui/material/Modal';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { Grid} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { IoSend } from "react-icons/io5";
import { BsCurrencyDollar } from "react-icons/bs";
import BAPI, { getSocketIOUrl } from '../helper/variable'
// import {Cloudinary} from "@cloudinary/url-gen";
import axios from 'axios';
import io from 'socket.io-client';

export default function Freelancerchat() {
  const accessToken=localStorage.getItem("accessToken");
  const [clients,setClients] =useState([]);
  const [search,setSearch]=useState('');
  const [userMessage, setuserMessage] = useState('');
  const [freeLancerOnline, setFreeLancerOnline] = useState(true);
  const [clientOnline, setClientOnline] = useState(true);
  const [messages, setMessages] = useState([
    // { type: 'text', content: 'Hello Akarsh', username: 'other' },
  ]);
  const chatContainerRef = useRef(null);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  let countDeliverable = 0;
  let submittedacceptDeliverables=0;
  const [priceInputOpen, setPriceInputOpen] = useState(false);
  const [priceValue, setPriceValue] = useState('');
  const [deliverableInputOpen, setDeliverableInputOpen] = useState(false);
  const [deliverableValue, setDeliverableValue] = useState('');
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [freelancerphotoUrl,setFreelancerPhotoUrl] =useState(null);
  const [clientphotoUrl, setClientPhotoUrl]=useState(null)
  const [image,setImage]=useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatInfo,setSelectedChatInfo]=useState(null);
  const [editMode,setEditMode]=useState(false);
  const [editmessageId,setEditmessageId]=useState('');
  const [receivedMessage, setReceivedMessage] = useState(0);
  const [connected, setConnected] = useState(false);
  const [clientname,setClientname]=useState('');
  const [clientlocation,setClientLocation]=useState('')
  const [freelancername,setfreelancername]=useState('');
  const [profileImage,setProfileImage]=useState(null);
  const [openm, setOpenm] = useState(false);
  const [reviewfeedback,setReviewfeedback]=useState({
    feedback:'',
    stars:'0'
  })
  const [chatCompleted,setChatCompleted]=useState(false);
  const [job_title,setSelectedjobtitle]=useState('');
  const container1 = useRef();
  const container2 = useRef();
  const container3 = useRef();
  const [filteredClients, setFilteredClients] = useState(null);

  // New state for deliverable payment system
  const [deliverablePayments, setDeliverablePayments] = useState([]);
  
  // State to track if welcome message has been shown
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);

  const handleClickOutside = (e) => {
    if (container1.current && !container1.current.contains(e.target)) {
        setOpen(false);
    }
    if (container2.current && !container2.current.contains(e.target)) {
        setDeliverableInputOpen(false);
    }
    if (container3.current && !container3.current.contains(e.target)) {
        setPriceInputOpen(false);
    }
};
// attaches an eventListener to listen when componentDidMount
useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    // optionally returning a func in useEffect runs like componentWillUnmount to cleanup
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  const handleOpen = () => setOpenm(true);
  const handleClose = () => setOpenm(false);

  useEffect(()=>{
      const user=localStorage.getItem('user');
      setfreelancername(JSON.parse(user).full_name);
      setFreelancerPhotoUrl(JSON.parse(user).photo_url);
  },[])

  const [clientId, setClientId] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
 
  const [websckt, setWebsckt] = useState(null);
  
  useEffect(() => {
    // Generate a unique client ID
    const newClientId = Date.now().toString();
    setClientId(newClientId);

    // Use environment-based Socket.IO URL
    const url = getSocketIOUrl();
    // Socket.IO Connection Setup
    
    // Create Socket.IO connection
    const socket = io(url, {
        transports: ['websocket', 'polling'],
        autoConnect: true
    });

    // Socket.IO event handlers
    socket.on('connect', () => {
        // Socket.IO connected successfully
        
        // If we already have a selected chat, join it now that Socket.IO is ready
        if (selectedChat) {
            // Socket.IO ready, joining existing chat
            setTimeout(() => {
                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    socket.emit('join_chat', {
                        chat_id: selectedChat,
                        user_id: user.id
                    });
                    // console.log("✅ Joined chat room after Socket.IO ready:", selectedChat);
                } catch (error) {
                    console.error("❌ Error joining chat room after Socket.IO ready:", error);
                }
            }, 100); // Small delay to ensure connection is stable
        }
    });

    socket.on('disconnect', () => {
        // console.log("Socket.IO disconnected (Freelancer)");
    });

    socket.on('connected', (data) => {
        // console.log("Server confirmed connection (Freelancer):", data);
    });

    socket.on('joined_chat', (data) => {
        // console.log("Successfully joined chat (Freelancer):", data);
    });

    socket.on('left_chat', (data) => {
        // console.log("Left chat (Freelancer):", data);
    });

    socket.on('new_message', (data) => {
        // console.log("=== Socket.IO Message Received (Freelancer) ===");
        // console.log("Message data:", data);
        // console.log("Current selectedChat:", selectedChat);
        // console.log("Current messages count:", messages.length);
        
        // Handle new message for current chat
        if (data.chat_id === selectedChat) {
            // console.log("✅ New message received for current chat (Freelancer):", data.data);
            
            // Add new message directly to messages array
            if (data.data && data.data.message) {
                // console.log("Adding new message to state (Freelancer):", data.data.message.substring(0, 50) + "...");
                setMessages(prevMessages => {
                    // console.log("Previous messages count (Freelancer):", prevMessages.length);
                    // Check if message already exists to avoid duplicates (by ID, content, and timestamp)
                    const messageExists = prevMessages.some(msg => 
                        msg.id === data.data.id || 
                        (msg.message === data.data.message && 
                         msg.sent_by === data.data.sent_by && 
                         Math.abs(new Date(msg.created_at) - new Date(data.data.created_at)) < 1000) // Within 1 second
                    );
                    if (messageExists) {
                        // console.log("⚠️ Duplicate message detected, skipping (Freelancer)");
                        return prevMessages;
                    }
                    // Limit message history to prevent memory issues (keep last 100 messages)
                    const limitedMessages = prevMessages.slice(-99);
                    const newMessages = [...limitedMessages, data.data];
                    // console.log("✅ Updated messages count (Freelancer):", newMessages.length);
                    return newMessages;
                });
            } else {
                // Fallback: trigger message refresh
                // console.log("⚠️ Fallback: triggering message refresh - no message content (Freelancer)");
                setReceivedMessage(prev => prev + 1);
            }
        } else {
            // New message received but for different chat - still log it
            // console.log("📨 New message received for different chat (Freelancer):", data.chat_id, "Current chat:", selectedChat);
        }
    });

    socket.on('message_update', (data) => {
        // console.log("=== Socket.IO Message Update Received (Freelancer) ===");
        // console.log("Update data:", data);
        
        if (data.chat_id === selectedChat) {
            // console.log("✅ Message update received for current chat (Freelancer):", data.data);
            
            // Update the specific message in the messages array
            setMessages(prevMessages => {
                return prevMessages.map(msg => {
                    if (msg.id === data.data.id) {
                        // console.log("Updating message (Freelancer):", msg.id);
                        return { ...msg, ...data.data };
                    }
                    return msg;
                });
            });
        }
    });

    // Store socket instance
    setWebsckt(socket);

    // Cleanup function
    return () => {
        // console.log("Cleaning up Socket.IO connection (Freelancer)");
        if (socket) {
            socket.disconnect();
        }
    };
}, []);

  // Join chat room when selectedChat changes
  useEffect(() => {
     // console.log("=== Attempting to Join Chat Room (Freelancer) ===");
     // console.log("Socket.IO connected:", websckt?.connected);
     // console.log("Selected chat:", selectedChat);
     // console.log("Socket.IO object exists:", !!websckt);
     
     if (websckt && websckt.connected && selectedChat) {
         try {
             const user = JSON.parse(localStorage.getItem('user'));
             websckt.emit('join_chat', {
                 chat_id: selectedChat,
                 user_id: user.id
             });
             // console.log("✅ Successfully joined chat room (Freelancer):", selectedChat);
         } catch (error) {
             console.error("❌ Error joining chat room (Freelancer):", error);
         }
     } else {
         // console.log("⚠️ Cannot join chat room - Socket.IO not ready or no chat selected");
         // console.log("Socket.IO connected:", websckt?.connected);
         // console.log("Selected chat:", selectedChat);
         // console.log("Socket.IO exists:", !!websckt);
     }
     // console.log("=== End Join Chat Room Attempt (Freelancer) ===");
  }, [selectedChat, websckt]);
  
  const sendMessageSocket = () => {
     if (websckt && websckt.connected) {
         try {
             const messageToSend = {
                 type: "message_sent",
                 chat_id: selectedChat
             };
             websckt.emit('message_sent', messageToSend);
         } catch (error) {
             console.error("Error sending Socket.IO message (Freelancer):", error);
         }
     }
  };

  useEffect(()=>{
    const getChats=async()=>{
        try{
           const response=await axios.get(`${BAPI}/api/v0/chats/get-freelancer-chats`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
           });
        //    // console.log(response.data)
        const sortedClients = response.data.sort((a, b) => {
            const dateA = new Date(JSON.parse(a).created_at);
            const dateB = new Date(JSON.parse(b).created_at);
            return dateB - dateA; 
        });

        setClients(sortedClients);
        }
        catch(err){
            // console.log("Error while fetching chat : ", err)
        }
    }
         getChats();
  },[])

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleOpenPrice = () => {
    setPriceValue('')
    setPriceInputOpen((prev)=>(!prev));
  };

  const handleClosePriceInput = () => {
    setPriceInputOpen(false);
    setEditMode(false);
    setPriceValue('');
  };

  const handleEditedSendPrice = async() => {
    if (priceValue.trim() !== '') {
    const newPriceMessage =  {message: priceValue, message_id:editmessageId ,status:'NEGOTIATION_PENDING',deadline:''};
    //   setMessages((prevMessages) => [...prevMessages, newPriceMessage]);
    const priceburl = `${BAPI}/api/v0/chats/update-deliverable`;
    
    setEditMode(false);
    setEditmessageId(null);
    try{
        const response=await axios.post(priceburl,newPriceMessage,{
        headers:{
            Authorization:`Bearer ${accessToken}`,
        }
        })
        // // console.log(response);
    }
    catch(err){
        // console.log("Error in updating price chat : ",err)
    }
      handleClosePriceInput();
    } else {
      toast.error('Please enter a valid price');
    }
    
    // Send WebSocket message (don't let WebSocket failure affect the main flow)
    try {
        sendMessageSocket();
    } catch (websocketError) {
        // console.log("WebSocket failed but price update succeeded:", websocketError)
    }
  };
  
  const createnotification=async(title, content)=>{
    const notification={
        "title": title,
        "content": content,
        "notification_for": selectedChatInfo.manager_id
      }
    try{
        const response=await axios.post(`${BAPI}/api/v0/notifications/create-notification`,notification,{
         headers:{
             Authorization:`Bearer ${accessToken}`
         }
        });
        // console.log(response.data);
        return response.data;
     }
     catch(err){
         // console.log("Error while creating notification : ", err)
         // Don't throw error for notification failures - they shouldn't break the main flow
         return null;
     }
  }

  // Enhanced deliverable rejection with reason
  const showRejectionReasonDialog = async () => {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; width: 90%;">
            <h3>Reject Deliverable</h3>
            <p>Please provide a reason for rejecting this deliverable:</p>
            <textarea id="rejectionReason" placeholder="Enter rejection reason..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; margin: 10px 0;"></textarea>
            <div style="margin-top: 20px; text-align: center;">
              <button onclick="submitRejection()" style="margin-right: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Reject</button>
              <button onclick="cancelRejection()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">Cancel</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(dialog);
      
      window.submitRejection = () => {
        const reason = document.getElementById('rejectionReason').value.trim();
        if (!reason) {
          alert('Please provide a rejection reason.');
          return;
        }
        document.body.removeChild(dialog);
        resolve(reason);
      };
      
      window.cancelRejection = () => {
        document.body.removeChild(dialog);
        resolve(null);
      };
    });
  };

  // Payment functionality removed - not needed for deliverable management


  const handleSendPrice = async() => {
    if (priceValue.trim() !== '') {
    const newPriceMessage =  {message: priceValue, sent_by: selectedChatInfo.freelancer_id, chat_id:selectedChatInfo.id ,status:'NEGOTIATION_PENDING',deadline:''};
    const priceburl =`${BAPI}/api/v0/chats/send-message`;
    try{
        const response=await axios.post(priceburl,newPriceMessage,{
        headers:{
            Authorization:`Bearer ${accessToken}`,
        }
        })
        await createnotification("Price Negotiation", `${freelancername} has raised price of ${job_title} job.`)
        
        // Hide welcome message after sending price proposal
        setWelcomeMessageShown(true);
    }
    catch(err){
        // console.log("Error in sending chat : ",err)
    }
      handleClosePriceInput();
    } else {
      toast.error('Please enter a valid price');
    }
    
    // Send WebSocket message (don't let WebSocket failure affect the main flow)
    try {
        sendMessageSocket();
    } catch (websocketError) {
        // console.log("WebSocket failed but price sending succeeded:", websocketError)
    }
  };

  const handleEditPrice=async(message)=>{
    setEditMode(true);
    setPriceValue(message.message);
    setPriceInputOpen(true);
    setEditmessageId(message.id);
  }

  const handleEditDeliverable=async(message)=>{
    setEditMode(true);
    setDeliverableValue(message.message);
    setDeliverableInputOpen(true);
    setEditmessageId(message.id);
  }


  const handleOpenDeliverable = () => {
    setDeliverableValue('');
    setDeliverableInputOpen((prev)=>(!prev));
  };

  const handleCloseDeliverableInput = () => {
    setDeliverableInputOpen(false);
    setDeliverableValue('');
  };

  const handleSendEditedDeliverable = async() => {
    if (deliverableValue.trim() !== '') {
        const newMessage = {
            message: deliverableValue,
            message_id:editmessageId ,
            status: 'DELIVERABLE_IMAGE',
            deadline: ''
          };
        //   // console.log(newMessage)
    setEditMode(false);
    setEditmessageId(null);
      try{
        const response=await axios.post(`${BAPI}/api/v0/chats/update-deliverable`,newMessage,{
           headers:{
               Authorization:`Bearer ${accessToken}`,
           }
        })
        // // console.log(response)
        }
        catch(err){
            // console.log("Error in updating Milestone : ",err)
        }
      handleCloseDeliverableInput();
    } else {
      toast.error('Please enter a valid link');
    }
    
    // Send WebSocket message (don't let WebSocket failure affect the main flow)
    try {
        sendMessageSocket();
    } catch (websocketError) {
        // console.log("WebSocket failed but deliverable update succeeded:", websocketError)
    }
  };
  const handleSendDeliverable = async() => {
    if(countDeliverable-submittedacceptDeliverables<=0){
        toast.error("There are no Imcomplete Deliverables")
        return;
    }
    if (deliverableValue.trim() !== '') {
        const newMessage = {
            message: deliverableValue,
            sent_by: selectedChatInfo.freelancer_id,
            chat_id: selectedChatInfo.id,
            status: 'DELIVERABLE_IMAGE',
            deadline: ''
          };
          try{
              const sendMessageResponse = await axios.post(
                `${BAPI}/api/v0/chats/send-message`,
                newMessage,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                }
              );
        
          }
          catch(err){
              // console.log("error while sending Milestone : ", err)
          }
      handleCloseDeliverableInput();
    } else {
      toast.error('Please enter a valid link');
    }
    
    // Send WebSocket message (don't let WebSocket failure affect the main flow)
    try {
        sendMessageSocket();
    } catch (websocketError) {
        // console.log("WebSocket failed but deliverable sending succeeded:", websocketError)
    }
  };

  const handleAccept=async(messageId)=>{
    try{
        const negres = await axios.post(`${BAPI}/api/v0/chats/update-message-status`,{
            "message_id":messageId,
            "status":"DELIVERABLES_ACCEPTED"
        },{
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        })
        await createnotification("Deliverable Accepted", `${freelancername} has accepted the deliverable of ${job_title} job.`)
    }
    catch(err){
        // console.log("Error while Accepting deliverable : ",err)
    }
    
    // Send WebSocket message (don't let WebSocket failure affect the main flow)
    try {
        sendMessageSocket();
    } catch (websocketError) {
        // console.log("WebSocket failed but deliverable acceptance succeeded:", websocketError)
    }
  }


  const handleAcceptDeliverableProposal = async(messageId) => {
    // console.log('✅ Starting accept deliverable (Freelancer):', messageId);
    
    try {
      // Find the message to get deliverable count
      const message = messages.find(msg => msg.id === messageId);
      // console.log('📋 Current message:', message);
      
      if (!message) {
        // console.log('❌ Message not found');
        toast.error('Message not found');
        return;
      }

      // Check if message is already accepted to prevent duplicate calls
      if (message.status === 'DELIVERABLES_ACCEPTED') {
        // console.log('⚠️ Message already accepted, skipping duplicate call (Freelancer)');
        return;
      }

      // Extract deliverable count from message content
      const acceptedDeliverables = parseInt(message.message);
      if (isNaN(acceptedDeliverables)) {
        toast.error('Invalid deliverable count format');
        return;
      }
      // console.log('📊 Accepted deliverables count:', acceptedDeliverables);
      // console.log('📝 Deliverable description:', message.message);

      // Get job ID and freelancer ID from selected chat info
      const jobId = selectedChatInfo?.job_id;
      const freelancerId = selectedChatInfo?.freelancer_id;
      
      // console.log('🔍 Job and freelancer info:', { jobId, freelancerId });
      
      if (!jobId || !freelancerId) {
        // console.log('❌ Missing job or freelancer information');
        toast.error('Missing job or freelancer information');
        return;
      }

      // First update message status
      // console.log('📤 Updating message status to ACCEPTED...');
      const statusResponse = await axios.post(`${BAPI}/api/v0/chats/update-message-status`,{
        "message_id": messageId,
        "status":"DELIVERABLES_ACCEPTED"
      },{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      // console.log('✅ Status update response:', statusResponse.data);

      // Call backend API to update job with accepted deliverables
      // console.log('📤 Calling accept-deliverable-proposal API...');
      const acceptPayload = {
        job_id: jobId,
        accepted_deliverables: acceptedDeliverables,
        freelancer_id: freelancerId
      };
      // console.log('📦 Accept payload:', acceptPayload);
      
      const acceptResponse = await axios.post(`${BAPI}/api/v0/jobs/accept-deliverable-proposal`, acceptPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      // console.log('✅ Accept API response:', acceptResponse.data);

      // Update remaining_deliverables
      const remainingPayload = {
        job_id: jobId,
        remaining_deliverables: acceptedDeliverables
      };
      console.log('📦 Remaining payload:', remainingPayload);
      console.log('📊 acceptedDeliverables type:', typeof acceptedDeliverables, 'value:', acceptedDeliverables);
      
      try {
        const remainingResponse = await axios.post(`${BAPI}/api/v0/jobs/update-remaining-deliverables`, remainingPayload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        console.log('✅ Remaining deliverables updated:', remainingResponse.data);
      } catch (remainingError) {
        console.error('❌ Error updating remaining deliverables:', remainingError.response?.data);
        console.error('❌ Error status:', remainingError.response?.status);
        console.error('❌ Full error:', remainingError);
        // Don't fail the whole process if this fails
      }

      // Update local messages state
      // console.log('🔄 Updating local messages state...');
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? {
            ...msg,
            status: 'DELIVERABLES_ACCEPTED'
          } : msg
        )
      );

      // console.log('✅ Local state updated');
      toast.success('Deliverable proposal accepted!');
      
      // Send notification
      // console.log('🔔 Sending notification...');
      try {
        await createnotification("Deliverable Proposal Accepted", `${freelancername} has accepted the deliverable proposal for ${job_title} job.`)
        // console.log('✅ Notification sent');
      } catch (notificationError) {
        // console.log('❌ Notification error:', notificationError);
      }
      
      // Send WebSocket message
      // console.log('🌐 Sending WebSocket message...');
      try {
        sendMessageSocket();
        // console.log('✅ WebSocket message sent');
      } catch (websocketError) {
        // console.log('❌ WebSocket error:', websocketError);
      }
      
      // console.log('🎉 Accept process completed successfully');
    } catch (error) {
      toast.error('Failed to accept deliverable proposal. Please try again.');
    }
  };

  const handleRejectDeliverableProposal = async(messageId) => {
    // console.log('🚫 Starting reject deliverable (Freelancer):', messageId);
    
    // Check if message is already rejected to prevent duplicate calls
    const message = messages.find(msg => msg.id === messageId);
    // console.log('📋 Current message status:', message?.status);
    
    if (message && message.status === 'DELIVERABLES_REJECTED') {
      // console.log('⚠️ Message already rejected, skipping duplicate call (Freelancer)');
      return;
    }
    
    try {
      // Show rejection reason dialog
      // console.log('💬 Showing rejection reason dialog...');
      const rejectionReason = await showRejectionReasonDialog();
      // console.log('📝 Rejection reason received:', rejectionReason);
      
      if (!rejectionReason) {
        // console.log('❌ User cancelled rejection');
        return; // User cancelled
      }
      
      // Update message status (same pattern as price rejection)
      // console.log('📤 Sending reject API call...');
      const rejectPayload = {
        "message_id": messageId,
        "status":"DELIVERABLES_REJECTED",
        "rejection_reason": rejectionReason
      };
      // console.log('📦 Reject payload:', rejectPayload);
      
      const rejectResponse = await axios.post(`${BAPI}/api/v0/chats/update-message-status`, rejectPayload, {
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      
      // console.log('✅ Reject API response:', rejectResponse.data);

      // Update local messages state
      // console.log('🔄 Updating local messages state...');
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? {
            ...msg,
            status: 'DELIVERABLES_REJECTED',
            rejection_reason: rejectionReason
          } : msg
        )
      );

      // console.log('✅ Local state updated');
      toast.success('Deliverable proposal rejected.');
      
      // Send notification
      // console.log('🔔 Sending notification...');
      try {
        await createnotification("Deliverable Proposal Rejected", `${freelancername} has rejected the deliverable proposal for ${job_title} job.`)
        // console.log('✅ Notification sent');
      } catch (notificationError) {
        // console.log('❌ Notification error:', notificationError);
      }
      
      // Send WebSocket message
      // console.log('🌐 Sending WebSocket message...');
      try {
        sendMessageSocket();
        // console.log('✅ WebSocket message sent');
      } catch (websocketError) {
        // console.log('❌ WebSocket error:', websocketError);
      }
      
      // console.log('🎉 Reject process completed successfully');
    } catch (error) {
      toast.error('Failed to reject deliverable proposal. Please try again.');
    }
  };

  const handleCancel=async(messageId)=>{
    try{
        const negres = await axios.post(`${BAPI}/api/v0/chats/update-message-status`,{
            "message_id":messageId,
            "status":"NORMAL"
        },{
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        })
        // // console.log(negres);
    }
    catch(err){
        // console.log("Error while  Cancelling deliverables : ",err)
    }
    
    // Send WebSocket message (don't let WebSocket failure affect the main flow)
    try {
        sendMessageSocket();
    } catch (websocketError) {
        // console.log("WebSocket failed but cancel operation succeeded:", websocketError)
    }
  }


  useEffect(()=>{ 
    const uploadImage = async () => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", 'er103mfg');
      data.append("cloud_name", 'dlpcihcmz');
      await fetch('https://api.cloudinary.com/v1_1/dlpcihcmz/image/upload', {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async(data) => {
            // console.log(data)
            const imageUrl = data.url;
              if (imageUrl !== '') {
                const newMessage = {
                  message: imageUrl,
                  sent_by: selectedChatInfo.freelancer_id,
                  chat_id: selectedChatInfo.id,
                  status: 'IMAGE',
                  deadline: ''
                };
                try{
                    const sendMessageResponse = await axios.post(
                      `${BAPI}/api/v0/chats/send-message`,
                      newMessage,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`
                        }
                      }
                    );
              
                    // // console.log(sendMessageResponse);
                }
                catch(err){
                    // console.log("error while sending Image : ", err)
                }
              }
          })
        .catch((err) => {
          // console.log(err);
        });
        setImage(null)
        
        // Send WebSocket message (don't let WebSocket failure affect the main flow)
        try {
            sendMessageSocket();
        } catch (websocketError) {
            // console.log("WebSocket failed but image upload succeeded:", websocketError)
        }
    }

    const uploadVideo = async () => {
        const data = new FormData();
        data.append("file", selectedVideo);
        data.append("upload_preset", 'er103mfg');
        data.append("cloud_name", 'dlpcihcmz');
        await fetch('https://api.cloudinary.com/v1_1/dlpcihcmz/video/upload', {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then(async(data) => {
            // console.log(data)
            const videoUrl = data.url;
              if (videoUrl !== '') {
                const newMessage = {
                  message: videoUrl,
                  sent_by: selectedChatInfo.freelancer_id,
                  chat_id: selectedChatInfo.id,
                  status: 'VIDEO',
                  deadline: ''
                };
                try{
                    const sendMessageResponse = await axios.post(
                      `${BAPI}/api/v0/chats/send-message`,
                      newMessage,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`
                        }
                      }
                    );
              
                    // // console.log(sendMessageResponse);
                }
                catch(err){
                    // console.log("error while sending Image : ", err)
                }
              }
          })
          .catch((err) => {
            // console.log(err);
          });
          setSelectedVideo(null)
          
          // Send WebSocket message (don't let WebSocket failure affect the main flow)
          try {
              sendMessageSocket();
          } catch (websocketError) {
              // console.log("WebSocket failed but video upload succeeded:", websocketError)
          }
      }

    if(image){
        uploadImage() 
    }
    if(selectedVideo){
        uploadVideo() 
    }

  },[image,selectedVideo])

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    // console.log(file);

    if (file === undefined) {
        toast({
            title: "Please Select a File!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
    }
    const fileType = file.type;
    if (fileType.startsWith('image/')) {
        setImage(file);
    } else if (fileType.startsWith('video/')) {
        setSelectedVideo(file);
    } else {
        toast({
            title: "Unsupported File Type!",
            description: "Please select either an image or a video file.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
    }

    setOpen(false);
};

  
  const handleClickAttach = () => {
      setOpen((prev)=>!prev);
  };

  const sendMessage = async() => {
    if (userMessage === '') {
      return toast.error('Please write a message');
    }
  
    const newMessage = {message: userMessage, sent_by: selectedChatInfo.freelancer_id, chat_id:selectedChatInfo.id ,status:'NORMAL',deadline:''};
    
    // Store the current message for immediate display
    const messageToSend = userMessage;
    
    try{
         const response=await axios.post(`${BAPI}/api/v0/chats/send-message`,newMessage,{
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
         })
         
         // Add the sent message to local state immediately for instant feedback
         const sentMessage = {
           ...response.data, // Use the response data which includes the message ID and timestamp
           message: messageToSend,
           sent_by: selectedChatInfo.freelancer_id,
           status: 'NORMAL',
           deadline: ''
         };
         
         setMessages(prevMessages => {
           const limitedMessages = prevMessages.slice(-99); // Keep last 99 messages
           return [...limitedMessages, sentMessage];
         });
         
         // Hide welcome message after sending any message
         setWelcomeMessageShown(true);
         
    }
    catch(err){
        // console.log("Error in sending chat : ",err)
        // Show error toast if message fails to send
        toast.error('Failed to send message. Please try again.');
        return; // Don't clear input or proceed if there's an error
    }
    setuserMessage('');
    
    // Send WebSocket message (don't let WebSocket failure affect the main flow)
    try {
        sendMessageSocket();
    } catch (websocketError) {
        // console.log("WebSocket failed but message sending succeeded:", websocketError)
    }
  };

  const getClientDetails=async(clientId)=>{
    try{
        const response=await axios.get(`${BAPI}/api/v0/users/${clientId}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
           });
        //    // console.log(response)
        setClientPhotoUrl(response.data.photo_url)
    }
    catch(err){
        // console.log("Error while fetching client details : ", err)
    }
  }
  
  useEffect(()=>{
    const getChatInfo=async()=>{
        try{
           const response=await axios.get(`${BAPI}/api/v0/chats/${selectedChat}/get-chat-by-id`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
           });
        //    // console.log("Chat Info : ", response.data)
           setSelectedChatInfo(response.data);
           getClientDetails(response.data.manager_id)
        }
        catch(err){
            // console.log("Error while fetching chat : ", err)
        }
    }
    if(selectedChat!==null){
         getChatInfo();
        }
  },[selectedChat]);

  
  const submitReview=async()=>{
    const review = {
        "stars": parseInt(reviewfeedback.stars),
        "review": reviewfeedback.feedback,
        "review_for": selectedChatInfo.manager_id,
        "job_application_id": selectedChatInfo.application_id,
        "is_freelancer":false
    };
    
    try{
        const response=await axios.post(`${BAPI}/api/v0/reviews/create-reviews`, review, {
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
           });
            setReviewfeedback({
                feedback:'',
                stars:'0'
            })
            handleClose();
    }
    catch(err){
        // console.log("Error while giving review : ",err)
    }
}


const checkcompleted=async()=>{
    let total=0;
    let completed=0;
    messages.forEach((message)=>{
        if(message.status==="DELIVERABLE_IMAGE_ACCEPTED"){
            completed++;
        }
        if(message.status==="DELIVERABLES_ACCEPTED"){
            total++;
        }
    })

    if(total!==0 && total===completed){
        setChatCompleted(true);
    }
}

  // Function to fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return; // Don't fetch if no chat is selected
    
    try {
      const response = await axios.get(`${BAPI}/api/v0/chats/get-chat-message-by_id/${selectedChat}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // Limit message history to prevent memory issues
      const limitedMessages = response.data.slice(-100);
      setMessages(limitedMessages);
    } catch (err) {
      // console.log("Error while fetching chat : ", err);
    }
  };

  // Fetch messages when selectedChat changes
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // Poll for new messages every 30 seconds when chat is selected (fallback only)
  useEffect(() => {
    if (!selectedChat) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 30000); // Poll every 30 seconds as fallback

    return () => clearInterval(interval);
  }, [selectedChat]);

  useEffect(()=>{
    const getChat=async()=>{
        if (!selectedChat) return; // Don't fetch if no chat is selected
        
        try{
           const response=await axios.get(`${BAPI}/api/v0/chats/get-chat-message-by_id/${selectedChat}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
           });
           // console.log("Fetched messages count:", response.data.length);
          // Limit message history to prevent memory issues
          const limitedMessages = response.data.slice(-100);
          setMessages(limitedMessages);
        }
        catch(err){
            // console.log("Error while fetching chat : ", err)
        }
    }
    getChat();
  },[selectedChat,receivedMessage]);

  const handleChatSelect = (chat,title) => {
    if(selectedChat!=chat){
    setChatCompleted(false);
    setReviewfeedback({
        feedback:'',
        stars:'0'
    });
    setMessages([]);
    setSelectedjobtitle(title);
    setSelectedChat(chat);}
  };

  
  const updateTextareaHeight = (element) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConvertDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short' };
    const newdate=date.toLocaleDateString('en-US', options);
    return newdate;
  };

  const handleClientFilter = () => {
    if (!search.trim()) {
        setFilteredClients(clients);
    } else {
        const filtered = clients.filter(client => {
            const fullName = `${JSON.parse(client).first_name} ${JSON.parse(client).last_name}`;
            return fullName.toLowerCase().includes(search.trim().toLowerCase()) ||
            JSON.parse(client).job_title.toLowerCase().includes(search.trim().toLowerCase());
        });
        setFilteredClients(filtered);
    }
};

useEffect(() => {
    handleClientFilter();
}, [search, clients]);

  return (
    <Box>
      <Box>
        <Header3 />
      </Box>
      <Box sx={{padding:{md:'40px 90px',sm:'40px',xs:'0px'}}}>
        <Box sx={{display:'flex',flexDirection:'row',height:{sm:'820px',xs:'100%'},position:'relative'}}>
            <Box sx={{boxShadow: {sm:'0px 0px 4px 1px #00000040',xs:'0'},borderRadius:{lg:'16px 0 0 16px',sm:'16px',xs:'0'},width:{lg:'380px',xs:'100%'},overflowY:'auto'}}>
                <Box sx={{ padding: '15px 25px', display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%',gap:'15px' }}>
                    <Typography sx={{ color: '#000000', fontWeight: '600', fontSize: '28px', marginRight: 'auto' }}>Messaging</Typography>
                    {/* <RxDotsHorizontal style={{ fontSize: '25px', marginLeft: 'auto',cursor:'pointer' }} />
                    <RiEdit2Line style={{ fontSize: '25px', borderRadius: '50px', border: '1px solid #000',cursor:'pointer'}} /> */}
                </Box>
                <Divider />
                <Box sx={{padding:'24px 20px 12px'}}>
                    <Box sx={{boxShadow: '0px 0px 4px 0.5px #00000040',borderRadius:'16px',padding:'1px 15px 1px 15px',display:'flex',flexDirection:'row',flexWrap:'nowrap',alignItems:'center'}}>
                       <CiSearch style={{ fontSize: '20px'}}/>
                       <InputBase
                            sx={{ ml: 1.4, flex: 1 }}
                            placeholder="Search Client"
                            style={{color:'#000000'}}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IconButton type="button" sx={{p: '10px'}} aria-label="filter">
                            {/* <CiFilter /> */}
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{overflowY:'auto',height:'auto'}}>
                    {
                        (filteredClients!==null && filteredClients?.length!==0)?(filteredClients?.map((client,indx)=>(
                            <Box key={indx}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', padding: '22px 20px 13px',alignItems:'center',justifyContent:'space-between',gap:'40px',cursor:'pointer'}} onClick={() => {handleChatSelect(JSON.parse(client).id,JSON.parse(client).job_title); setClientname(JSON.parse(client).first_name+" "+JSON.parse(client).last_name); setClientLocation(JSON.parse(client)?.location)}}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row',alignItems:'center',gap:'10px'}}>
                                        <Avatar sx={{ textTransform: 'uppercase', width: '50px', height: '50px' }}>
                                        {(JSON.parse(client).first_name+" "+JSON.parse(client).last_name)?.split(' ').slice(0, 2).map((part, idx) => part[0]).join('')}
                                        </Avatar>
                                        <Box sx={{display:'flex',flexDirection:'column'}}>
                                        <Typography sx={{color:'#353535',fontWeight:'500',fontSize:'18px'}}>{JSON.parse(client).first_name} {JSON.parse(client).last_name}</Typography>
                                        <Typography sx={{color:'#353535',fontWeight:'400',fontSize:'12px'}}><span style={{fontWeight:'bold'}}></span>{JSON.parse(client)?.company}</Typography>
                                        <Typography sx={{color:'#353535',fontWeight:'400',fontSize:'12px'}}><span style={{fontWeight:'bold'}}>Job Profile : </span>{JSON.parse(client).job_title}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{minWidth:'50px'}}>
                                       <Typography sx={{color:'#74767E',fontSize:'13px'}}>{handleConvertDate(JSON.parse(client)?.created_at)}</Typography>
                                    </Box>
                                </Box>
                                <Divider/>
                            </Box>
                        ))):<Box sx={{padding: '22px 20px 13px',textAlign:'center'}}>No chats available</Box>
                    }
                </Box>
            </Box>
            <Box sx={{boxShadow: {sm:'0px 0px 4px 1px #00000040',xs:'0'},borderRadius:{lg:'0 16px 16px 0',sm:'16px',xs:'0'},flex:1,position:{lg:'relative',xs:'absolute'},backgroundColor:'#ffffff',width:{xs:'100%',lg:'auto'}}}>
            <Box sx={{width:'100%',height:selectedChat!==null?{sm:'820px',xs:'100vh'}:'auto'}}>
                {selectedChat!=null && <div className='chat-container'>
                    <div className='chat_Profile_frnd'>
                        <Box>
                        {(freelancerphotoUrl && freelancerphotoUrl!=='') ? (
                                                  <img
                                                      // className='user-picture-img'
                                                      alt={freelancername[0]}
                                                      src={freelancerphotoUrl}
                                                      style={{ borderRadius:'50%',width:'50px',height:'50px',objectFit: 'cover'  }}
                                                  />
                                              ) : (
                                                <Avatar sx={{ textTransform: 'uppercase', width: '50px', height: '50px' }}>
                                                {freelancername?.split(' ').slice(0, 2).map((part, idx) => part[0]).join('')}
                                                </Avatar>
                                              )}
                           
                           {freeLancerOnline ? <div className='chat_Profile_Online'></div> : null}
                        </Box>
                        <div className='chat_Profile_frnd_Name'>
                            <h3>{freelancername}</h3>
                            <p>Online</p>
                        </div>
                        <div className='chat_profile_settings'>
                            {/* <div className='chat_profile_settings_menu'>
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </div>
                            <div className=''>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div> */}
                            <div className='' onClick={()=>setSelectedChat(null)}>
                                <i className="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className='chat-container_client'>
                        <Box>
                            {
                                (clientphotoUrl && clientphotoUrl !=='' )?(
                                    <img
                                    // className='user-picture-img'
                                    alt={clientname[0]}
                                    src={clientphotoUrl}
                                    style={{ borderRadius:'50%',width:'70px',height:'70px',objectFit: 'cover'  }}
                                />
                                ):(
                                    <Avatar sx={{ textTransform: 'uppercase', width: '70px', height: '70px' }}>
                                    {clientname?.split(' ').slice(0, 2).map((part, idx) => part[0]).join('')}
                                    </Avatar>
                                )
                            }
                            
                            {clientOnline ? <div className='chat_container_client_Online'></div> : null}
                        </Box>
                        <div className='chat-container_client_Name'>
                            <h3>{clientname}</h3>
                            <p>{clientlocation?clientlocation:"Location : N/A"}</p>
                        </div>
                    </div>
                    <Divider />
                    
                    {/* Deliverable Payment Status */}
                    {deliverablePayments.length > 0 && (
                        <Box sx={{
                            padding: '15px 20px',
                            backgroundColor: '#f8f9fa',
                            borderBottom: '1px solid #e9ecef'
                        }}>
                            <Typography sx={{ fontWeight: '600', marginBottom: '10px', color: '#495057' }}>
                                Deliverable Payment Status
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {deliverablePayments.map((payment, index) => (
                                    <Box key={payment.id} sx={{
                                        padding: '8px 12px',
                                        backgroundColor: payment.status === 'PAID' ? '#d4edda' : '#fff3cd',
                                        border: `1px solid ${payment.status === 'PAID' ? '#c3e6cb' : '#ffeaa7'}`,
                                        borderRadius: '6px',
                                        fontSize: '12px'
                                    }}>
                                        <Typography sx={{ fontWeight: '500', color: payment.status === 'PAID' ? '#155724' : '#856404' }}>
                                            Deliverable {payment.deliverable_number}
                                        </Typography>
                                        <Typography sx={{ fontSize: '11px', color: payment.status === 'PAID' ? '#155724' : '#856404' }}>
                                            ₹{(payment.amount / 100).toFixed(2)} - {payment.status}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    
                    {/* <div className='chat-container_chat_date'>
                        8 Dec 2024
                    </div> */}

                    <Grid sx={{padding:{sm:'20px 35px',xs:'14px'},display:'flex',flexDirection:'column',gap:'13px',overflowY:'auto',width:'100%',flex:1}} className='chat-container_chat_msg_scroll' ref={chatContainerRef}>
                    
                    {/* Welcome Message - Show when no messages exist and not shown before */}
                    {messages.length === 0 && !welcomeMessageShown && (
                        <>
                            {/* Show current date */}
                            <Box
                                sx={{
                                    display:'flex',
                                    flexDirection:'row',
                                    justifyContent:'center',
                                    gap:'10px',
                                    alignItems:'center',
                                    width:'100%',
                                    margin:{md:'5px 0',xs:'2px 0'}
                                }}
                            >
                                <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>
                                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </Typography>
                            </Box>
                            
                            {/* Welcome message */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    margin: {md:'10px 0',xs:'5px 0'},
                                    padding: '12px 20px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}
                            >
                                <Typography 
                                    sx={{
                                        color: '#495057',
                                        fontWeight: '500',
                                        fontSize: {md: '14px', sm: '13px', xs: '12px'},
                                        textAlign: 'center',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    💰 Hi! Welcome to the project. Please click the dollar icon in the chat input area to propose your rate for this project.
                                </Typography>
                            </Box>
                        </>
                    )}
                    
                    {messages.map((message, index) => {

if (message.status === 'DELIVERABLES_ACCEPTED') {
    countDeliverable++;
}
if (message.status === 'DELIVERABLE_IMAGE_ACCEPTED') {
    submittedacceptDeliverables++;
}
                                const convertedDate=handleConvertDate(message.created_at);

return (
<div key={`message-${index}`}>{ (index===0 || handleConvertDate(messages[index-1]?.created_at)!==convertedDate) && (
                                        <Box key={`date-${index}`}
                                        sx={{
                                           display:'flex',
                                           flexDirection:'row',
                                           justifyContent:'center',
                                           gap:'10px',
                                           alignItems:'center',
                                           width:'100%',
                                           margin:{md:'5px 0',xs:'2px 0'}
                                        }}>
                                         <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>{convertedDate}</Typography>
                                        </Box>
                                    )
                                }
        <Grid key={`message-${index}`} className={message.sent_by!==selectedChatInfo?.freelancer_id ? 'message-receive' : 'message-send'}
            sx={{
                display: 'flex',
                flexDirection:'row',
                alignItems:'center',
                gap:'10px',
                // width:'60%'
            }}>
                {index === 0 || messages[index - 1].sent_by !== message.sent_by ? (
                    <>
                    {
                        message.sent_by!==selectedChatInfo?.manager_id &&(
                            <>
                            {(freelancerphotoUrl && freelancerphotoUrl!=='') ? (
                                <img
                                    // className='user-picture-img'
                                    alt={freelancername[0]}
                                    src={freelancerphotoUrl}
                                    style={{ borderRadius:'50%',width:'40px',height:'40px',objectFit: 'cover'  }}
                                />
                            ) : (
                                <Avatar sx={{ textTransform: 'uppercase', width: '40px', height: '40px'}}>
                                {/* {message.username[0]} */}
                                {(message.sent_by!==selectedChatInfo?.manager_id?(freelancername):(clientname))?.split(' ').slice(0, 2).map((part, idx) => part[0]).join('')}
                              </Avatar>
                            )}
                            </>
                        )
                    }
                    {
                        message.sent_by===selectedChatInfo?.manager_id &&(
                            <>{
                                (clientphotoUrl && clientphotoUrl !=='' )?(
                                    <img
                                    // className='user-picture-img'
                                    alt={clientname[0]}
                                    src={clientphotoUrl}
                                    style={{ borderRadius:'50%',width:'40px',height:'40px',objectFit: 'cover'  }}
                                />
                                ):(
                                    <Avatar sx={{ textTransform: 'uppercase', width: '40px', height: '40px'}}>
                              {/* {message.username[0]} */}
                              {(message.sent_by!==selectedChatInfo?.manager_id?(freelancername):(clientname))?.split(' ').slice(0, 2).map((part, idx) => part[0]).join('')}
                            </Avatar>
                                )
                            }
                            
                            </>
                        )
                    }
                    </>
              ) : <div style={{width:'40px'}}></div>}                                      
                {(message.status === 'DELIVERABLE_IMAGE' || message.status === 'DELIVERABLE_IMAGE_ACCEPTED' ||message.status === 'DELIVERABLE_IMAGE_REJECTED' ) && (
                    <Box sx={{display:'flex',justifyContent:'flex-end',flexDirection:'column',marginBottom:'5px'}}>
                        {/* <img
                            className="image_deliverable"
                            src={message.message}
                            alt="Image"
                            style={{width:'220px', height:'220px'}}
                        /> */}
                        <Box sx={{
                            backgroundColor: '#f2f2f2',
                            boxShadow: '0px 0px 4px 1px #00000040',
                            borderRadius: '10px',
                            border: '10px solid #FFFFFF',
                            width: {md:'220px',sm:'170px',xs:'150px'},
                            height: {sm:'80px',xs:'60px'},
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden', 
                            padding:'5px',
                            color:"#b3b3b3",
                            fontSize:{md:'16px',xs:'13px'}
                            }}>
                            <a href={message.message} target="_blank" style={{color:"#b3b3b3"}}>
                                {message.message}
                            </a>
                            </Box>


                        <Box sx={{display: 'flex',flexDirection:'row',gap:'10px',justifyContent:'flex-end',marginTop:'10px'}}>
                            {
                                message.status==='DELIVERABLE_IMAGE'?
                                    (<Box sx={{display: 'flex',width:'100%',flexDirection:'row',gap:'10px',justifyContent:'center'}}>
                                        <Button sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 20px',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} onClick={()=>{handleCancel(message.id)}}>Unsend</Button>
                                        <Button sx={{backgroundColor:'#fff',color:'#B27EE3',padding:'7px 20px',border:'1px solid #B27EE3',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#fff',color:'#B27EE3'}}} onClick={()=>{handleEditDeliverable(message)}}>Edit</Button>
                                    </Box>):null 
                            }
                        </Box>
                    </Box>
                )}
                {(message.status === 'IMAGE' ) && (
                                             <Box sx={{display:'flex',justifyContent:'flex-end',flexDirection:'column',marginBottom:'5px'}}>
                                             <img
                                                   className="image_deliverable"
                                                    src={message.message}
                                                    alt="Image"
                                                    style={{width:'220px', height:'220px'}}
                                                />
                                            </Box>
                                        )}                           
                                      
                {message.status === 'VIDEO' && (
                                             <Box sx={{display:'flex',justifyContent:'flex-end',flexDirection:'column',marginBottom:'5px'}}>
                                                <video
                                                className="image_deliverable"
                                                controls
                                                src={message.message}
                                                alt="Video"
                                                style={{width:'220px', height:'220px'}}
                                                />
                                                
                                            </Box>
                                            
                                        )}
                {(message.status === 'NEGOTIATION_ACCEPTED' || message.status === 'NEGOTIATION_PENDING' || message.status==='NEGOTIATION_REJECTED') && (
                    <Box sx={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'10px'}}>
                    <Box sx={{
                            maxWidth: '100%',
                            color: message.status!=='NEGOTIATION_REJECTED'?'#ffffff':'#000000',
                            padding:'10px 15px 10px 15px',
                            minWidth:'130px',
                            backgroundColor:message.status!=='NEGOTIATION_REJECTED'?'#ED8335':'#EAEAEA',
                            borderRadius:'16px',
                            display:'flex',flexDirection:'column',gap:'0px'
                        }}>
                            <Typography sx={{
                                    fontWeight:'500',
                                    fontSize:{sm:'12px',xs:'10px'}
                            }}>
                                Price
                            </Typography>
                            <Typography sx={{
                                    fontWeight:'500',
                                    fontSize:{md:'20px',sm:'16px',xs:'14px'},lineHeight:'1'
                            }}>
                                ₹{message.message}
                            </Typography>
                    </Box>
                    {
                        message.status==='NEGOTIATION_PENDING'?
                        (<Box sx={{display: 'flex',width:'100%',flexDirection:'row',gap:'10px',justifyContent:'center'}}>
                            <Button sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 20px',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} onClick={()=>{handleCancel(message.id)}}>Cancel</Button>
                            <Button sx={{backgroundColor:'#fff',color:'#B27EE3',padding:'7px 20px',border:'1px solid #B27EE3',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#fff',color:'#B27EE3'}}} onClick={()=>{handleEditPrice(message)}}>Edit</Button>
                        </Box>):null
                    }
                    </Box>
                    
                )}
                {(message.status === 'DELIVERABLES' || message.status === 'DELIVERABLES_ACCEPTED') && (
                    <Box sx={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'10px'}}>
                    <Box sx={{
                            maxWidth: '100%',
                            color: '#ffffff',
                            padding:'10px 15px 10px 15px',
                            minWidth:{md:'120px'},
                            backgroundColor: '#ED8335',
                            borderRadius:'16px',
                            display:'flex',flexDirection:'column',gap:'0px'
                        }}>
                            <Typography sx={{
                                    fontWeight:'500',
                                    fontSize:{sm:'12px',xs:'10px'}
                            }}>
                                Deliverables
                            </Typography>
                            <Typography sx={{
                                    fontWeight:'500',
                                    fontSize:{md:'20px',sm:'16px',xs:'14px'},lineHeight:'1'
                            }}>
                                {message.message} deliverable(s)
                            </Typography>
                    </Box>
                    {
                        message.status==='DELIVERABLES' && message.sent_by!==selectedChatInfo?.freelancer_id?
                        (<Box sx={{display: 'flex',width:'100%',flexDirection:'row',gap:'10px',justifyContent:'center'}}>
                            <Button sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 20px',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} onClick={()=>handleAcceptDeliverableProposal(message.id)}>Accept</Button>
                            <Button sx={{backgroundColor:'#fff',color:'#B27EE3',padding:'7px 20px',border:'1px solid #B27EE3',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#fff',color:'#B27EE3'}}} onClick={()=>handleRejectDeliverableProposal(message.id)}>Reject</Button>
                        </Box>):null
                    }
                    </Box>
                )}
                {/* {message.status === 'DELIVERABLES_ACCEPTED' && setCountDeliverable(prevCount => prevCount + 1)} */}
                {message.status === 'NORMAL' && (
                    <Typography sx={{
                            fontWeight:'500',
                            maxWidth: '50%',
                            wordBreak:'break-word',
                            color: '#000000',
                            whiteSpace: 'pre-line',
                            padding:'5px 15px',
                            backgroundColor:'#EAEAEA',
                            borderRadius:'16px',
                            fontSize:{md:'18px',sm:'16px',xs:'14px'}
                        }}>
                            {message.message}
                    </Typography>

                )}
        </Grid>
        {
            message.status==="NEGOTIATION_ACCEPTED" && (
                <Box 
                sx={{
                   display:'flex',
                   flexDirection:'row',
                   justifyContent:'center',
                   gap:'10px',
                   alignItems:'center',
                   width:'100%',
                   margin:{md:'5px 0',sm:'2px 0',xs:'0'}
                }}>
                 <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>Congrats your project has been started</Typography>
                </Box>
            )
        }
        {
            message.status==="NEGOTIATION_REJECTED" && (
                <Box 
                sx={{
                   display:'flex',
                   flexDirection:'row',
                   justifyContent:'center',
                   gap:'10px',
                   alignItems:'center',
                   width:'100%',
                   margin:{md:'5px 0',sm:'2px 0',xs:'0'}
                }}>
                 <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>Price was negotiated by the client</Typography>
                </Box>
            )
        }
        {
            message.status==="DELIVERABLES_REJECTED" && (
                <Box 
                sx={{
                   display:'flex',
                   flexDirection:'column',
                   justifyContent:'center',
                   gap:'10px',
                   alignItems:'center',
                   width:'100%',
                   margin:{md:'5px 0',sm:'2px 0',xs:'0'}
                }}>
                 <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>
                   {message.rejection_reason 
                     ? `Deliverable proposal rejected: ${message.rejection_reason}`
                     : 'Deliverable proposal was rejected by freelancer'
                   }
                 </Typography>
                </Box>
            )
        }
        {
            message.status==="DELIVERABLES_ACCEPTED" && (
                <Box 
                sx={{
                   display:'flex',
                   flexDirection:'row',
                   justifyContent:'center',
                   gap:'10px',
                   alignItems:'center',
                   width:'100%',
                   margin:{md:'5px 0',sm:'2px 0',xs:'0'}
                }}>
                 <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>Deliverable proposal accepted! {message.message} deliverable(s) confirmed.</Typography>
                </Box>
            )
        }
        {
            message.status==="DELIVERABLE_IMAGE_ACCEPTED" && (
                <Box 
                sx={{
                   display:'flex',
                   flexDirection:'row',
                   justifyContent:'center',
                   gap:'10px',
                   alignItems:'center',
                   width:'100%',
                   margin:{md:'5px 0',sm:'2px 0',xs:'0'}
                }}>
                 <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>Deliverable {submittedacceptDeliverables} has been accepted</Typography>
                </Box>
            )
        }
        {
            message.status==="DELIVERABLE_IMAGE_REJECTED" && (
                <Box 
                sx={{
                   display:'flex',
                   flexDirection:'row',
                   justifyContent:'center',
                   gap:'10px',
                   alignItems:'center',
                   width:'100%',
                   margin:{md:'5px 0',sm:'2px 0',xs:'0'}
                }}>
                 <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>Deliverable {submittedacceptDeliverables+1} is declined</Typography>
                </Box>
            )
        }
        
        </div>
    ) })}
    
        {
            chatCompleted && (
                <Box 
                sx={{
                   display:'flex',
                   flexDirection:'row',
                   justifyContent:'center',
                   gap:'10px',
                   alignItems:'center',
                   width:'100%',
                   marginTop:'20px'
                }}>
                 <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>Congrats your project is completed</Typography>
                <Button sx={{
                    borderRadius:'16px',
                    color:'#fff',
                    backgroundColor:'#000',
                    padding:'5px 10px',
                    fontSize:'13px',
                    ':hover':{
                        color:'#fff',
                        backgroundColor:'#000',
                    }
                }} onClick={handleOpen} >Give Review</Button>
                <Modal
                    open={openm}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width:{sm:'600px',xs:'90%'},
                        backgroundColor: '#fff',
                        boxShadow: '0px 0px 4px 1px #00000040',
                        borderRadius:'7px',
                        padding:'25px'
                    }}>
                    <Typography sx={{color:'#000000',fontSize:{sm:'23px',xs:'18px'},fontWeight:'700'}} >
                        Review
                    </Typography>
                    <Box sx={{
                        marginTop:'20px'
                    }}>
                        <Form.Group controlId="form">
                            <Form.Control as="textarea"
                                value={reviewfeedback.feedback}
                                onChange={(e)=>{
                                    setReviewfeedback({ ...reviewfeedback, feedback: e.target.value });
                                }}
                                rows="5"
                                className='form-val proposaldesc' 
                                type="text" name='feedback' placeholder="Enter your feedback here.." />
                        </Form.Group>
                        <Rating
                            emptyIcon={<StarIcon style={{ opacity: 0.55, color:'grey'}} fontSize="inherit" />}
                            name="simple-controlled"
                            value={reviewfeedback.stars}
                            onChange={(e, newValue) => {
                                setReviewfeedback({ ...reviewfeedback, stars: newValue });
                            }}
                        />
                        <Button 
                        onClick={()=>{submitReview()}}
                        sx={{
                            borderRadius:'5px',
                            color:'#fff',
                            backgroundColor:'#000',
                            padding:'6px 15px',
                            fontSize:{sm:'15px',xs:'12px'},
                            marginLeft:'auto',
                            ':hover':{
                                color:'#fff',
                                backgroundColor:'#000',
                            },
                            float:'right'
                        }}>Submit Review</Button>
                    </Box>
                    </Box>
                </Modal>
                </Box>
            )
        }
                    </Grid>

                    <Box sx={{display:'flex',flexDirection:'column'}} className="chat_footer">
                            <Divider />
                            <div className='chat_Container_Textarea'>
                                <textarea
                                    value={userMessage}
                                    onChange={(e) => setuserMessage(e.target.value)}
                                    type="text"
                                    className='Textarea_chat'
                                    placeholder='Write a message...'
                                    rows="3"
                                    />
                                {/* <i class="fa-solid fa-chevron-up"></i> */}
                            </div>
                            <Divider />
                            <div className='chat_Profile_send'>
                                <div className='chat_Profile_send1'>
                                    <Box sx={{position:'relative'}} ref={container1}>
                                        <i className="fa-solid fa-paperclip" onClick={()=>{handleClickAttach()}}></i>
                                        <Box sx={{position:'absolute',display:open?'flex':'none',top:'-70px',left:'-20px',backgroundColor:'#ffffff',boxShadow:'0px 0px 4px 1px #00000040',borderRadius:'16px',padding:'10px'}} >
                                            <Button component="label" htmlFor="ImageInput" ><MdAddPhotoAlternate style={{fontSize:'20px',color:'#B27EE3'}}/></Button>
                                            <input
                                                id="ImageInput"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                                disabled={chatCompleted}
                                            />
                                            <Button component="label" htmlFor="videoInput" ><MdOutlineSlowMotionVideo style={{fontSize:'20px',color:'#B27EE3'}}/></Button>
                                            <input
                                                id="videoInput"
                                                type="file"
                                                accept="video/*"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                                disabled={chatCompleted}
                                                />
                                        </Box>
                                    </Box>
                                    <Box sx={{position:'relative'}} ref={container3}>
                                        <BsCurrencyDollar style={{fontSize: '20px',cursor:'pointer'}} onClick={()=>handleOpenPrice()} />
                                        <Box sx={{position:'absolute',display:priceInputOpen?'flex':'none',top:'-100px',left:'-20px',backgroundColor:'#ffffff',boxShadow:'0px 0px 4px 1px #00000040',borderRadius:'16px',padding:'15px',flexDirection:'column',gap:'10px'}}>
                                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between'}} >
                                               <Typography>Enter Price :</Typography>
                                               <RxCrossCircled style={{fontSize:'20px',cursor:'pointer'}} onClick={handleClosePriceInput} />
                                            </Box>
                                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',alignItems:'center',gap:'10px'}}>
                                                <input 
                                                    autoFocus
                                                    type="text"
                                                    value={priceValue}
                                                    placeholder='Price'
                                                    onChange={(e)=>setPriceValue(e.target.value)}
                                                    style={{border:'none',outline:'none',boxShadow:'0px 0px 4px 1px #00000040',borderRadius:'8px',padding:'5px 10px',width:'120px'}}
                                                />
                                                <IoSend style={{fontSize:'20px',cursor: chatCompleted ? 'not-allowed' : 'pointer',color:'#B27EE3'}} onClick={chatCompleted?null:(editMode? handleEditedSendPrice:handleSendPrice)} />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{position:'relative'}} ref={container2}>
                                    {/* Calendar icon for individual deliverable submission - only show after deliverable proposal is accepted */}
                                    {(() => {
                                        const hasDeliverablesAccepted = messages.some(msg => msg.status === 'DELIVERABLES_ACCEPTED');
                                        // console.log('🔍 Calendar Icon Debug (Freelancer):');
                                        // console.log('- Total messages:', messages.length);
                                        // console.log('- Messages with DELIVERABLES_ACCEPTED:', messages.filter(msg => msg.status === 'DELIVERABLES_ACCEPTED').length);
                                        // console.log('- Has deliverables accepted:', hasDeliverablesAccepted);
                                        // console.log('- All message statuses:', messages.map(msg => ({ id: msg.id, status: msg.status, message: msg.message?.substring(0, 30) })));
                                        return hasDeliverablesAccepted;
                                    })() && (
                                        <i className="fa-regular fa-calendar" onClick={()=>handleOpenDeliverable()}></i>
                                    )}
                                    <Box sx={{position:'absolute',display:deliverableInputOpen?'flex':'none',top:'-138px',left:'-20px',backgroundColor:'#ffffff',boxShadow:'0px 0px 4px 1px #00000040',borderRadius:'16px',padding:'15px',flexDirection:'column',gap:'10px'}}>
                                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',gap:'20px'}} >
                                               <Typography> Post a Milestone :</Typography>
                                               <RxCrossCircled style={{fontSize:'20px',cursor:'pointer'}} onClick={handleCloseDeliverableInput} />
                                            </Box>
                                            <Box sx={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
                                                <input 
                                                placeholder='Link here'
                                                    autoFocus
                                                    type="text"
                                                    value={deliverableValue}
                                                    onChange={(e)=>setDeliverableValue(e.target.value)}
                                                    style={{border:'none',outline:'none',boxShadow:'0px 0px 4px 1px #00000040',borderRadius:'8px',padding:'5px 10px',width:'200px'}}
                                                />
                                                
                                                <Box sx={{
                                                    backgroundColor:'#B27EE3',
                                                    cursor: chatCompleted ? 'not-allowed' : 'pointer',
                                                    width:'100%',
                                                    borderRadius:'8px',textAlign:'center',padding:'2px 0'
                                                }}  
                                                onClick={chatCompleted? null:(editMode? handleSendEditedDeliverable:handleSendDeliverable)}>
                                                <IoSend style={{fontSize:'18px',color:'#fff'}}/>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </div>
                                <div className='chat_Profile_send_div'>
                                    <Button onClick={sendMessage} style={{ cursor: 'pointer' }} disabled={chatCompleted} >Send</Button>
                                    <div className='' style={{marginRight:'20px'}}>
                                                                                 {/* <i class="fa-solid fa-ellipsis" style={{ fontSize: '25px' }}></i> */}
                                    </div>
                                </div>
                            </div>
                    </Box>
                </div>}

                <Toaster
                    position="top-center"
                    reverseOrder={true}
                />

                {/* Deliverable Payments Display */}
                {deliverablePayments.length > 0 && (
                    <Box sx={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        width: '300px',
                        backgroundColor: '#fff',
                        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        padding: '15px',
                        zIndex: 1000,
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        <Typography sx={{ fontWeight: '700', fontSize: '16px', marginBottom: '10px' }}>
                            Deliverable Payments
                        </Typography>
                        
                        {deliverablePayments.map((payment, index) => (
                            <Box key={payment.id} sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '8px',
                                backgroundColor: payment.status === 'PAID' ? '#e8f5e8' : 
                                               payment.status === 'REJECTED' ? '#ffe8e8' : '#f8f8f8'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <Typography sx={{ fontWeight: '600' }}>
                                        Deliverable {payment.deliverable_number}
                                    </Typography>
                                    <Typography sx={{ 
                                        color: payment.status === 'PAID' ? '#4caf50' : 
                                               payment.status === 'REJECTED' ? '#f44336' : '#ff9800',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {payment.status}
                                    </Typography>
                                </Box>
                                
                                <Typography sx={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                                    Amount: ${payment.amount}
                                </Typography>
                                
                                {payment.status === 'PAID' && payment.transaction_id && (
                                    <Typography sx={{ fontSize: '10px', color: '#666' }}>
                                        Transaction: {payment.transaction_id.substring(0, 8)}...
                                    </Typography>
                                )}
                                
                                {payment.status === 'PAID' && payment.paid_at && (
                                    <Typography sx={{ fontSize: '10px', color: '#666' }}>
                                        Paid: {new Date(payment.paid_at).toLocaleDateString()}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
            </Box>
        </Box>
      </Box>
    </Box>


  )
}
