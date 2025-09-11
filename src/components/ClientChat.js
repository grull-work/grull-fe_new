import { Avatar, Box, Button, Divider, IconButton, InputBase, Typography } from '@mui/material'
import React, { useEffect, useRef, useState, Fragment } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { CiSearch } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import '../styles/Chat.css'
import Form from 'react-bootstrap/Form';
import Rating from '@mui/material/Rating';
import { MdAddPhotoAlternate } from "react-icons/md";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { Grid} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import Modal from '@mui/material/Modal';
import { IoSend } from "react-icons/io5";
import { DatePicker} from 'antd';
import BAPI, { getSocketIOUrl } from '../helper/variable'
// import {Cloudinary} from "@cloudinary/url-gen";
import axios from 'axios';
import dayjs from 'dayjs';
import io from 'socket.io-client';
import Header4 from './Header4';




export default function Clientchat() {
  const accessToken=localStorage.getItem("accessToken");
  const [freelancers,setFreelancers] =useState([]);
  const [search,setSearch]=useState('');
  const [userMessage, setuserMessage] = useState('');
  const [freeLancerOnline, setFreeLancerOnline] = useState(true);
  const [clientOnline, setClientOnline] = useState(true);
  const [messages, setMessages] = useState([
    // { type: 'text', content: 'Hello Akarsh', username: 'other' },
  ]);

  // Debug wrapper for setMessages
  const debugSetMessages = (newMessages) => {
    setMessages(newMessages);
  };
  const chatContainerRef = useRef(null);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [priceInputOpen, setPriceInputOpen] = useState(false);
  const [priceValue, setPriceValue] = useState('');
  const [deliverableInputOpen, setDeliverableInputOpen] = useState(false);
  const [deliverableValue, setDeliverableValue] = useState('');
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [dateval,setDateval]=useState('');
  const [photoUrl,setPhotoUrl] =useState('');
  const [image,setImage]=useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatInfo,setSelectedChatInfo]=useState(null);
  const [editMode,setEditMode]=useState(false);
  const [editmessageId,setEditmessageId]=useState('');
  let countDeliverable = 0;
  let submittedacceptDeliverables=0;
  let priceAcceptId=null;
  const [receivedMessage, setReceivedMessage] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [clientId, setClientId] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  const [websckt, setWebsckt] = useState();
  const [clientname,setClientname]=useState('');
  const [freelancername,setfreelancername]=useState('');
  const [freelancerlocation,setFreelancerlocation]=useState('')
  const [openm, setOpenm] = useState(false);
  const [reviewfeedback,setReviewfeedback]=useState({
    feedback:'',
    stars:'0'
  })
  const [chatCompleted,setChatCompleted]=useState(false);
  const [job_title,setSelectedjobtitle]=useState('');
  const container1 = useRef();
  const container2 = useRef();
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [freelancerphotoUrl,setFreelancerPhotoUrl] =useState(null);
  const [clientphotoUrl, setClientPhotoUrl]=useState(null)
  
  // Freelancer info state
  const [freelancerInfo, setFreelancerInfo] = useState(null);
  const [price, setPrice] = useState(null);
  const [deliverables, setDeliverables] = useState(null);
  const [setupDeliverablesOpen, setSetupDeliverablesOpen] = useState(false);
  const [numberOfDeliverables, setNumberOfDeliverables] = useState(1);
  
  // Remaining deliverables state
  const [remainingDeliverables, setRemainingDeliverables] = useState(0);


  const handleApiCheck=async()=>{
    try{
      const response=await axios.get(`${BAPI}/api/v0/applications/`,
        {
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        }
      );
      // console.log(response.data);
    }
    catch(err){
  }}

  const handleClickOutside = (e) => {
    if (container1.current && !container1.current.contains(e.target)) {
        setOpen(false);
    }
    if (container2.current && !container2.current.contains(e.target) && !e.target.closest('.ant-picker-dropdown')) {
        setDeliverableInputOpen(false);
        setSelectedDate('');
        if(document.getElementsByClassName('ant-picker-clear') && document.getElementsByClassName('ant-picker-clear')[0]){
            document.getElementsByClassName('ant-picker-clear')[0].click();}
        setDeliverableValue('');
    }
};

useEffect(()=>{
    try{
        const data = handleApiCheck();
        // console.log(data);
    }
    catch(err){
        console.error('Error occurred:', err);
    }
},[])
// attaches an eventListener to listen when componentDidMount
useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    // optionally returning a func in useEffect runs like componentWillUnmount to cleanup
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
    const handleOpen = () => setOpenm(true);
  const handleClose = () => setOpenm(false);

  const handleSetupDeliverablesOpen = () => {
    setSetupDeliverablesOpen(true);
  };
  const handleSetupDeliverablesClose = () => setSetupDeliverablesOpen(false);

  const handleSetupDeliverablesSubmit = async () => {
    console.log("reach")
    if (!numberOfDeliverables || numberOfDeliverables < 1) {
      toast.error('Number of deliverables must be at least 1');
      return;
    }

    
    try {
      // Send deliverable proposal message (same pattern as price proposal)
      const deliverableProposalMessage = {
        message: numberOfDeliverables.toString(),
        sent_by: selectedChatInfo.manager_id,
        chat_id: selectedChatInfo.id,
        status: 'NO_OF_DELIVERABLES',
        deadline: ''
      };

      console.log("deliverableProposalMessage",deliverableProposalMessage)

      const sendMessageResponse = ""


      try{
       sendMessageResponse = await axios.post(`${BAPI}/api/v0/chats/send-message`, deliverableProposalMessage, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }catch(error){
      console.log("error",error)
    }

      // Add the sent message to local state
      const sentMessage = {
        ...sendMessageResponse.data,
        message: numberOfDeliverables.toString(),
        sent_by: selectedChatInfo.manager_id,
        status: 'NO_OF_DELIVERABLES',
        deadline: ''
      };
      
      setMessages(prevMessages => {
        const limitedMessages = prevMessages.slice(-99);
        const newMessages = [...limitedMessages, sentMessage];
        return newMessages;
      });

      // Send notification to freelancer
      await createnotification("Deliverable Proposal", `${clientname} has proposed ${numberOfDeliverables} deliverable(s) for ${job_title} job.`);

      // Send WebSocket message
      sendMessageSocket();

      toast.success(`Deliverable proposal sent! ${numberOfDeliverables} deliverable(s) proposed to freelancer.`);
      handleSetupDeliverablesClose();
    } catch (error) {
      console.log('Error sending deliverable proposal:', error);
      toast.error('Failed to send deliverable proposal. Please try again.');
    }
  };



  useEffect(()=>{
      const user=localStorage.getItem('user');
      setClientname(JSON.parse(user).full_name);
      setClientPhotoUrl(JSON.parse(user).photo_url)
  },[])
  useEffect(() => {
    // Generate a unique client ID
    const newClientId = Date.now().toString();
    setClientId(newClientId);

    // Use environment-based Socket.IO URL
    const url = getSocketIOUrl();
    
    // Create Socket.IO connection
    const socket = io(url, {
        transports: ['websocket', 'polling'],
        autoConnect: true
    });

    // Socket.IO event handlers
    socket.on('connect', () => {        
        // If we already have a selected chat, join it now that Socket.IO is ready
        if (selectedChat) {
            setTimeout(() => {
                try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    socket.emit('join_chat', {
                        chat_id: selectedChat,
                        user_id: user.id
                    });
                } catch (error) {
                    toast.error('Failed to join chat room. Please try again.');
                }
            }, 100); // Small delay to ensure connection is stable
        }
    });

    socket.on('disconnect', () => {
    });

    socket.on('connected', (data) => {
    });

    socket.on('joined_chat', (data) => {
    });

    socket.on('left_chat', (data) => {
    });

    socket.on('new_message', (data) => {        
        // console.log('📨 Socket new_message received (Client):', data);
        // Handle new message for current chat
        if (data.chat_id === selectedChat) {            
            // console.log('✅ Message is for current chat (Client)');
            // Add new message directly to messages array
            if (data.data && data.data.message) {
                // console.log('📝 Adding message via socket (Client):', data.data.message.substring(0, 50) + '...');
                setMessages(prevMessages => {
                    // console.log('📊 Current messages count before adding (Client):', prevMessages.length);
                    // Check if message already exists to avoid duplicates (by ID, content, and timestamp)
                    const messageExists = prevMessages.some(msg => 
                        msg.id === data.data.id || 
                        (msg.message === data.data.message && 
                         msg.sent_by === data.data.sent_by && 
                         Math.abs(new Date(msg.created_at) - new Date(data.data.created_at)) < 1000) // Within 1 second
                    );
                    if (messageExists) {
                        // console.log("⚠️ Duplicate message detected, skipping (Client)");
                        return prevMessages;
                    }
                    // Limit message history to prevent memory issues (keep last 100 messages)
                    const limitedMessages = prevMessages.slice(-99);
                    const newMessages = [...limitedMessages, data.data];
                    // console.log('✅ Message added via socket (Client). New count:', newMessages.length);
                    // console.log('📝 New message details:', data.data);
                    return newMessages;
                });
            } else {
                // console.log('⚠️ No message content, triggering refresh (Client)');
                setReceivedMessage(prev => prev + 1);
            }
        } else {
            // console.log('❌ Message not for current chat (Client). Chat ID:', data.chat_id, 'Current:', selectedChat);
        }
    });

    socket.on('message_update', (data) => {        
        if (data.chat_id === selectedChat) {
            // Update the specific message in the messages array
            setMessages(prevMessages => {
                return prevMessages.map(msg => {
                    if (msg.id === data.data.id) {
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
        if (socket) {
            socket.disconnect();
        }
    };
}, []);

// Join chat room when selectedChat changes
useEffect(() => {
    if (websckt && websckt.connected && selectedChat) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            websckt.emit('join_chat', {
                chat_id: selectedChat,
                user_id: user.id
            });
        } catch (error) {
            console.error("Error joining chat room:", error);
        }
    }
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
            console.error("Error sending WebSocket message:", error);
        }
    }
};

  useEffect(()=>{
    const getChats=async()=>{
        try{
           const response=await axios.get(`${BAPI}/api/v0/chats/get-manager-chats`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
           });

           const sortedFreelancers = response.data.sort((a, b) => {
            const dateA = new Date(JSON.parse(a).created_at);
            const dateB = new Date(JSON.parse(b).created_at);
            return dateB - dateA; 
        });

          setFreelancers(sortedFreelancers);
        }
        catch(err){
            toast.error('Failed to fetch chats. Please try again.');
        }
    }
         getChats();
  },[])

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleOpenDeliverable = () => {
    setDeliverableValue('');
    // setDateval('');
    // setSelectedDate('');
    setDeliverableInputOpen((prev)=>(!prev));
  };

  const handleCloseDeliverableInput = () => {
    setDeliverableInputOpen(false);
    setSelectedDate('');
if(document.getElementsByClassName('ant-picker-clear') && document.getElementsByClassName('ant-picker-clear')[0]){
    document.getElementsByClassName('ant-picker-clear')[0].click();}
    setDeliverableValue('');
  };

  const handleSendEditedDeliverable = async() => {
    if (deliverableValue.trim() !== '' && selectedDate) {
      const newDeliverableMessage = {message: deliverableValue,  message_id:editmessageId ,status:'DELIVERABLES',deadline:selectedDate};
      
      // Store values for immediate display
      const deliverableToSend = deliverableValue;
      const dateToSend = selectedDate;
      
      try{
        const response=await axios.post(`${BAPI}/api/v0/chats/update-deliverable`,newDeliverableMessage,{
           headers:{
               Authorization:`Bearer ${accessToken}`,
           }
        })
        
        // Update the specific message in local state immediately for instant feedback
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === editmessageId ? {
              ...msg,
              message: deliverableToSend,
              deadline: dateToSend,
              status: 'DELIVERABLES'
            } : msg
          )
        );
        
        }
        catch(err){
            toast.error('Failed to update deliverable. Please try again.');
            return; // Don't proceed if there's an error
        }
      
      setEditMode(false);
      setEditmessageId(null);
      handleCloseDeliverableInput();
    } else {
      toast.error('Please enter a valid deliverable and select a date');
    }
    sendMessageSocket();
    
    // WebSocket will handle real-time updates, no need to fetch manually
  };


  const handleSendNOOFDeliverable = async() => {
       
  }

  const handleSendDeliverable = async() => {
    if(!priceAcceptId){
        // console.log('❌ No price accepted yet');
        toast.error('Price should be fixed first');
        handleCloseDeliverableInput();
        return;
    }
    
    if (deliverableValue.trim() !== '' && selectedDate) {
      try {
        // console.log('🚀 Sending deliverable:', deliverableValue);
        
        // Get current deliverable count from database
        let currentDeliverables = [];
        let activeDeliverables = [];
        let rejectedDeliverables = [];
        
        try {
          const deliverablesResponse = await axios.get(`${BAPI}/api/v0/chats/job-deliverables-status/${selectedChatInfo.job_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          
          currentDeliverables = deliverablesResponse.data.deliverables || [];
          activeDeliverables = currentDeliverables.filter(d => d.status !== 'REJECTED');
          rejectedDeliverables = currentDeliverables.filter(d => d.status === 'REJECTED');
        } catch (error) {
          // If job doesn't exist or no deliverables yet, start with empty arrays
          console.warn('No deliverables found for this job yet:', error.response?.data);
        }
        
        // Update local state with database data
        setDeliverables({
          count: activeDeliverables.length,
          total: currentDeliverables.length,
          active: activeDeliverables,
          rejected: rejectedDeliverables
        });
        
        // Get agreed deliverables from job data
        let agreedDeliverables = deliverables?.count || 0;
        if (agreedDeliverables === 0 && selectedChatInfo?.job_id) {
          try {
            const jobResponse = await axios.get(`${BAPI}/api/v0/jobs/${selectedChatInfo.job_id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            agreedDeliverables = jobResponse.data.total_deliverables || 0;
          } catch (jobErr) {
            // console.log('❌ Error fetching job data:', jobErr);
            agreedDeliverables = 0;
          }
        }
        
        // console.log('📊 Deliverable Status:', {
        //   active: activeDeliverables.length,
        //   agreed: agreedDeliverables,
        //   rejected: rejectedDeliverables.length
        // });
        
        // Check if we can add more deliverables
        if (activeDeliverables.length >= agreedDeliverables) {
          if (rejectedDeliverables.length > 0) {
            // console.log('🔄 Found rejected deliverables - showing resubmit options');
            const shouldResubmit = await showDeliverableResubmitDialog(rejectedDeliverables);
            if (shouldResubmit) {
              // console.log('✅ Resubmitting deliverable');
              await resubmitDeliverable(shouldResubmit.deliverable_id, deliverableValue, selectedDate);
              return;
            }
          } else {
            // console.log('❌ Limit reached - cannot add more deliverables');
            toast.error(`Cannot add more deliverables. Only ${agreedDeliverables} deliverables were agreed upon.`);
            return;
          }
        }
        
        // Create new deliverable
        const newDeliverableMessage = {
          message: deliverableValue, 
          sent_by: selectedChatInfo.manager_id, 
          chat_id: selectedChatInfo.id,
          status: 'DELIVERABLES',
          deadline: selectedDate
        };
        
        const response = await axios.post(`${BAPI}/api/v0/chats/send-message`, newDeliverableMessage, {
           headers: {
               Authorization: `Bearer ${accessToken}`,
           }
        });
        
        // console.log('✅ Deliverable sent successfully');
        
        // Update local state immediately for better UX
        setDeliverables(prev => ({
          ...prev,
          count: (prev?.count || 0) + 1,
          total: (prev?.total || 0) + 1
        }));
        
        await createnotification("Deliverable added", `${clientname} has added a new deliverable for ${job_title} job.`)
        
      } catch(err){
          console.error('❌ Error sending deliverable:', err.response?.data || err.message);
          toast.error('Failed to send deliverable. Please try again.');
          return;
      }
      handleCloseDeliverableInput();
    } else {
      toast.error('Please enter a valid deliverable and select a date');
    }
    
    sendMessageSocket();
  };


  const createnotification=async(title, content)=>{
    const notification={
        "title": title,
        "content": content,
        "notification_for": selectedChatInfo.freelancer_id
      }
    try{
        const response=await axios.post(`${BAPI}/api/v0/notifications/create-notification`,notification,{
         headers:{
             Authorization:`Bearer ${accessToken}`
         }
        });
        return response.data;
     }
     catch(err){         // Don't throw error for notification failures - they shouldn't break the main flow
         return null;
     }
  }

  // Enhanced deliverable management functions
  const showDeliverableResubmitDialog = async (rejectedDeliverables) => {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; width: 90%;">
            <h3>Resubmit Rejected Deliverable</h3>
            <p>You have ${rejectedDeliverables.length} rejected deliverable(s) that can be resubmitted:</p>
            <ul style="list-style: none; padding: 0;">
              ${rejectedDeliverables.map(d => `
                <li style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>Deliverable ${d.deliverable_number}:</strong> ${d.title}
                  <br><small style="color: #666;">Rejected: ${d.rejection_reason}</small>
                  <br><button onclick="selectDeliverable('${d.id}')" style="margin-top: 5px; padding: 5px 10px; background: #B27EE3; color: white; border: none; border-radius: 3px; cursor: pointer;">Resubmit This One</button>
                </li>
              `).join('')}
            </ul>
            <div style="margin-top: 20px; text-align: center;">
              <button onclick="createNewDeliverable()" style="margin-right: 10px; padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">Create New Deliverable Instead</button>
              <button onclick="cancelDialog()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">Cancel</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(dialog);
      
      window.selectDeliverable = (deliverableId) => {
        document.body.removeChild(dialog);
        resolve({ deliverable_id: deliverableId });
      };
      
      window.createNewDeliverable = () => {
        document.body.removeChild(dialog);
        resolve(null); // Will create new deliverable
      };
      
      window.cancelDialog = () => {
        document.body.removeChild(dialog);
        resolve(false);
      };
    });
  };

  const resubmitDeliverable = async (deliverableId, title, description, deadline) => {
    try {
      const response = await axios.post(`${BAPI}/api/v0/chats/resubmit-deliverable`, {
        deliverable_id: deliverableId,
        title: title,
        description: description,
        deadline: deadline
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      
      toast.success('Deliverable resubmitted successfully!');
      
      // Add resubmitted message to chat
      const resubmittedMessage = {
        id: response.data.deliverable_id,
        message: `Resubmitted: ${title}`,
        sent_by: selectedChatInfo.manager_id,
        status: 'DELIVERABLES',
        deadline: deadline,
        created_at: new Date().toISOString()
      };
      
      setMessages(prevMessages => {
        const limitedMessages = prevMessages.slice(-99);
        return [...limitedMessages, resubmittedMessage];
      });
      
      await createnotification("Deliverable Resubmitted", `${clientname} has resubmitted a deliverable for ${job_title} job.`);
      
      handleCloseDeliverableInput();
      sendMessageSocket();
      
      return response.data;
      
    } catch (error) {
      console.error('Error resubmitting deliverable:', error);
      toast.error('Failed to resubmit deliverable. Please try again.');
      throw error;
    }
  };

    const handleNegotiate=async(messaegId)=>{
        try{
            const negres = await axios.post(`${BAPI}/api/v0/chats/update-message-status`,{
                "message_id":messaegId,
                "status":"NEGOTIATION_REJECTED"
            },{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            })
            
            // Update the message status in local state immediately for instant feedback
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === messaegId ? {
                  ...msg,
                  status: 'NEGOTIATION_REJECTED'
                } : msg
              )
            );
            
            await createnotification("Price Negotiation", `${clientname} has negotiated the price of ${job_title} job.`)
            
            // Send WebSocket message (don't let WebSocket failure affect the main flow)
            try {
                sendMessageSocket();
            } catch (websocketError) {
                toast.error('Failed to negotiate price. Please try again.');
            }
        }
        catch(err){
            toast.error('Failed to negotiate price. Please try again.');
        }
    }

    const handleAcceptPrice=async(messageId)=>{
        try{
            // Find the message to get price
            const message = messages.find(msg => msg.id === messageId);
            if (!message) {
                toast.error('Message not found');
                return;
            }

            // Extract price from message content
            const acceptedPrice = parseFloat(message.message);
            if (isNaN(acceptedPrice)) {
                toast.error('Invalid price format');
                return;
            }

            // Get job ID and freelancer ID from selected chat info
            const jobId = selectedChatInfo?.job_id;
            const freelancerId = selectedChatInfo?.freelancer_id;
            
            // console.log('selectedChatInfo:', selectedChatInfo);
            // console.log('jobId:', jobId);
            // console.log('freelancerId:', freelancerId);
            
            if (!jobId || !freelancerId) {
                toast.error('Missing job or freelancer information');
                return;
            }

            // First update message status
            await axios.post(`${BAPI}/api/v0/chats/update-message-status`,{
                "message_id": messageId,
                "status":"NEGOTIATION_ACCEPTED"
            },{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            });

            
            
            const response = await axios.post(`${BAPI}/api/v0/jobs/accept-price`, {
                job_id: jobId,
                accepted_price: acceptedPrice,
                freelancer_id: freelancerId
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            // console.log('Accept-price response:', response.data);
            
            if (response.data.status === 'success') {
                // Store the accepted price in state
                setPrice(acceptedPrice);
                
                // Update local messages state
                setMessages(prevMessages => 
                  prevMessages.map(msg => 
                    msg.id === messageId ? {
                      ...msg,
                      status: 'NEGOTIATION_ACCEPTED'
                    } : msg
                  )
                );
                
                toast.success(`Price accepted! Job rate updated to ₹${acceptedPrice}`);
                
                // Send notification
                try {
                    await createnotification("Price Accepted", `${clientname} has accepted the price negotiation of ${job_title} job.`)
                } catch (notificationError) {
                    // console.log('Notification error:', notificationError);
                }
                
                // Send WebSocket message
                try {
                    sendMessageSocket();
                } catch (websocketError) {
                    // console.log('WebSocket error:', websocketError);
                }
            }
        }
        catch(err){
            // console.log('Error accepting price:', err);
            // console.log('Error details:', err.response?.data);
            // console.log('Error status:', err.response?.status);
            toast.error('Failed to accept price. Please try again.');
        }
    }

    const handleAcceptSubmission = async(messageId)=>{
        try{
            // First update the message status
            const negres = await axios.post(`${BAPI}/api/v0/chats/update-message-status`,{
                "message_id":messageId,
                "status":"DELIVERABLE_IMAGE_ACCEPTED"
            },{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            })
            
            // Only update local state after successful API call
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === messageId ? {
                  ...msg,
                  status: 'DELIVERABLE_IMAGE_ACCEPTED'
                } : msg
              )
            );
            
            // Process deliverable payment
            if (selectedChatInfo?.application_id) {
                try {
                                         // Get the current deliverable number from the job
                     const jobResponse = await axios.get(`${BAPI}/api/v0/applications/${selectedChatInfo.application_id}`, {
                         headers: {
                             Authorization: `Bearer ${accessToken}`
                         }
                     });
                     
                     const job = jobResponse.data.job;
                    const currentDeliverableNumber = job.completed_deliverable + 1;
                    
                    // Process the payment
                    const paymentResponse = await axios.post(`${BAPI}/api/v0/chats/process-deliverable`, {
                        job_id: job.id,
                        deliverable_number: currentDeliverableNumber,
                        action: "ACCEPT",
                        remarks: `Payment for deliverable ${currentDeliverableNumber}`
                    }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    
                    // Show success message with payment details
                    const paymentAmount = paymentResponse.data.amount;
                    toast.success(`Deliverable accepted! Payment of ₹${(paymentAmount / 100).toFixed(2)} transferred to freelancer.`);
                    
                } catch (paymentError) {
                    toast.error('Deliverable accepted but payment processing failed. Please contact support.');
                }
            }
            
            await createnotification("Accepted Submission", `${clientname} has accepted the submission of ${job_title} job.`)
            
            // Send WebSocket message (don't let WebSocket failure affect the main flow)
            try {
                sendMessageSocket();
            } catch (websocketError) {
            }
        }
        catch(err){
            toast.error('Failed to accept submission. Please try again.');
        }
        
        // WebSocket will handle real-time updates, no need to fetch manually
    }

    const handleRejectSubmission = async(messageId)=>{
        try{
            const negres = await axios.post(`${BAPI}/api/v0/chats/update-message-status`,{
                "message_id":messageId,
                "status":"DELIVERABLE_IMAGE_REJECTED"
            },{
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                }
            })
            
            // Only update local state after successful API call
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === messageId ? {
                  ...msg,
                  status: 'DELIVERABLE_IMAGE_REJECTED'
                } : msg
              )
            );
            
            await createnotification("Submission declined", `${clientname} has declined the submission of ${job_title} job.`)
            
            // Send WebSocket message (don't let WebSocket failure affect the main flow)
            try {
                sendMessageSocket();
            } catch (websocketError) {
            }
        }
        catch(err){
            toast.error('Failed to reject submission. Please try again.');
        }
        
        // WebSocket will handle real-time updates, no need to fetch manually
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
              const imageUrl = data.url;
                if (imageUrl !== '') {
                  const newMessage = {
                    message: imageUrl,
                    sent_by: selectedChatInfo.manager_id,
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
                      // Add the sent image message to local state immediately for instant feedback
                      const sentImageMessage = {
                        ...sendMessageResponse.data, // Use the response data which includes the message ID and timestamp
                        message: imageUrl,
                        sent_by: selectedChatInfo.manager_id,
                        status: 'IMAGE',
                        deadline: ''
                      };
                      
                      setMessages(prevMessages => {
                        const limitedMessages = prevMessages.slice(-99); // Keep last 99 messages
                        return [...limitedMessages, sentImageMessage];
                      });
                      
                  }
                  catch(err){
                      toast.error('Failed to send image. Please try again.');
                  }
                }
            })
            .catch((err) => {
              toast.error('Failed to upload image. Please try again.');
            });
            setImage(null);
            sendMessageSocket();
            
            // WebSocket will handle real-time updates, no need to fetch manually
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
                const videoUrl = data.url;
                  if (videoUrl !== '') {
                    const newMessage = {
                      message: videoUrl,
                      sent_by: selectedChatInfo.manager_id,
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
                        
                        // Add the sent video message to local state immediately for instant feedback
                        const sentVideoMessage = {
                          ...sendMessageResponse.data, // Use the response data which includes the message ID and timestamp
                          message: videoUrl,
                          sent_by: selectedChatInfo.manager_id,
                          status: 'VIDEO',
                          deadline: ''
                        };
                        
                        setMessages(prevMessages => {
                          const limitedMessages = prevMessages.slice(-99); // Keep last 99 messages
                          return [...limitedMessages, sentVideoMessage];
                        });
                        
                    }
                    catch(err){
                        toast.error('Failed to send video. Please try again.');
                    }
                  }
              })
              .catch((err) => {
                toast.error('Failed to upload video. Please try again.');
              });
              setSelectedVideo(null)
              sendMessageSocket();
              
              // WebSocket will handle real-time updates, no need to fetch manually
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
    const newMessage = {message: userMessage, sent_by: selectedChatInfo.manager_id, chat_id:selectedChatInfo.id ,status:'NORMAL',deadline:''};
    
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
           sent_by: selectedChatInfo.manager_id,
           status: 'NORMAL',
           deadline: ''
         };
         
         setMessages(prevMessages => {
           const limitedMessages = prevMessages.slice(-99); // Keep last 99 messages
           return [...limitedMessages, sentMessage];
         });
         
    }
    catch(err){
        // Show error toast if message fails to send
        toast.error('Failed to send message. Please try again.');
        return; // Don't clear input or proceed if there's an error
    }
    setuserMessage('');
    sendMessageSocket();
    
    // WebSocket will handle real-time updates, no need to fetch manually
  };

  const getFreelancerDetails=async(freelancer_id)=>{
    try{
        const response=await axios.get(`${BAPI}/api/v0/users/${freelancer_id}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
           });
        setFreelancerPhotoUrl(response.data.photo_url)
    }
    catch(err){
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
           setSelectedChatInfo(response.data);
           getFreelancerDetails(response.data.freelancer_id)
        }
        catch(err){
        }
    }
    if(selectedChat!==null){
         getChatInfo();
        }
  },[selectedChat]);

  const submitReview=async()=>{
    const review={
      "stars": reviewfeedback.stars,
      "review": reviewfeedback.feedback,
      "review_for": selectedChatInfo.freelancer_id,
      "job_application_id": selectedChatInfo.application_id,
      "is_freelancer":true
    }
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
    }
}

  // Function to fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return; // Don't fetch if no chat is selected
    
    // console.log('🔄 Fetching messages from API (Client)');
    try {
      const response = await axios.get(`${BAPI}/api/v0/chats/get-chat-message-by_id/${selectedChat}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // Limit message history to prevent memory issues
      const limitedMessages = response.data.slice(-100);
      // console.log('📥 API Response (Client):', limitedMessages.length, 'messages');
      // console.log('📥 API Messages (Client):', limitedMessages.map(msg => ({ id: msg.id, status: msg.status, message: msg.message?.substring(0, 30) })));
      debugSetMessages(limitedMessages);
    } catch (err) {
      // console.log('❌ Error fetching messages (Client):', err);
    }
  };

  // Fetch messages when selectedChat changes
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // Set price and deliverables from existing accepted negotiation messages when messages are loaded
  useEffect(() => {
    if (messages.length > 0) {
      const acceptedPriceMessage = messages.find(msg => msg.status === 'NEGOTIATION_ACCEPTED');
      if (acceptedPriceMessage) {
        const acceptedPrice = parseFloat(acceptedPriceMessage.message);
        if (!isNaN(acceptedPrice)) {
          setPrice(acceptedPrice);
          // Set default deliverables if not already set
          if (!deliverables) {
            setDeliverables({
              count: 1
            });
          }
        }
      }
    }
  }, [messages, deliverables, job_title]);



  // Poll for new messages every 30 seconds when chat is selected (fallback only)
  useEffect(() => {
    if (!selectedChat) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 30000); // Poll every 30 seconds as fallback

    return () => clearInterval(interval);
  }, [selectedChat]);
  
  const handleChatSelect = (chat,title) => {
    if(selectedChat!=chat){
    setChatCompleted(false);
    setReviewfeedback({
        feedback:'',
        stars:'0'
    });
    setMessages([]);
    setSelectedjobtitle(title);
    setSelectedChat(chat);
    setPrice(null); // Reset price when switching chats
    setDeliverables(null); // Reset deliverables when switching chats
    setNumberOfDeliverables(1); // Reset number of deliverables when switching chats
    setSetupDeliverablesOpen(false); // Close any open modals
    }
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

  const handleFilter = () => {
    if (!search.trim()) {
        setFilteredFreelancers(freelancers);
    } else {
        const filtered = freelancers.filter(chat => {
            const fullName = `${JSON.parse(chat).first_name} ${JSON.parse(chat).last_name}`;
            return fullName.toLowerCase().includes(search.trim().toLowerCase()) ||
                JSON.parse(chat).job_title.toLowerCase().includes(search.trim().toLowerCase());
        });
        setFilteredFreelancers(filtered);
    }
};

useEffect(() => {
    handleFilter();
}, [search, freelancers]);

// Fetch remaining deliverables once when component mounts
useEffect(() => {
    const fetchRemainingDeliverables = async () => {
        console.log("reach");
        try {
            // Only fetch if we have a selected chat with job_id
            if (selectedChatInfo?.job_id) {
                const response = await axios.get(`${BAPI}/api/v0/jobs/${selectedChatInfo.job_id}/remaining-deliverables`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                
                // Extract remaining_deliverables from response
                const remaining = response.data.remaining_deliverables;
                setRemainingDeliverables(remaining);
                console.log('📊 Fetched remaining deliverables:', remaining);
            }
        } catch (error) {
            toast.error("Network Error");
            console.log(error)
            setRemainingDeliverables(0);
        }
    };

    fetchRemainingDeliverables();
}, [selectedChatInfo]); 


  return (
    <Box>
      <Box>
        <Header4 />
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
                            placeholder="Search Message"
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
                        (filteredFreelancers!==null && filteredFreelancers?.length!==0)?(filteredFreelancers?.map((chat,indx)=>(
                            <React.Fragment key={indx}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', padding: '22px 20px 13px',alignItems:'center',justifyContent:'space-between',gap:'40px',cursor:'pointer'}} onClick={() =>{ handleChatSelect(JSON.parse(chat).id,JSON.parse(chat).job_title);setfreelancername(JSON.parse(chat).first_name+" "+JSON.parse(chat).last_name); setFreelancerlocation(JSON.parse(chat).location)}}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row',alignItems:'center',gap:'10px'}}>
                                        <Avatar sx={{ textTransform: 'uppercase', width: '50px', height: '50px' }}>
                                        {(JSON.parse(chat).first_name+" "+JSON.parse(chat).last_name)?.split(' ').slice(0, 2).map(part => part[0]).join('')}
                                        </Avatar>
                                        <Box sx={{display:'flex',flexDirection:'column'}}>
                                        <Typography sx={{color:'#353535',fontWeight:'500',fontSize:'18px'}}>{JSON.parse(chat).first_name} {JSON.parse(chat).last_name}</Typography>
                                        <Typography sx={{color:'#353535',fontWeight:'400',fontSize:'12px'}}><span style={{fontWeight:'bold'}}></span>{JSON.parse(chat).company}</Typography>
                                        <Typography sx={{color:'#353535',fontWeight:'400',fontSize:'12px'}}><span style={{fontWeight:'bold'}}>Job Profile : </span>{JSON.parse(chat).job_title}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{minWidth:'50px'}}>
                                       <Typography sx={{color:'#74767E',fontSize:'13px'}}>{handleConvertDate(JSON.parse(chat)?.created_at)}</Typography>
                                    </Box>
                                </Box>
                                <Divider/>
                            </React.Fragment>
                        ))):<Box sx={{padding: '22px 20px 13px',textAlign:'center'}}>No chats available</Box>
                    }
                </Box>
            </Box>
            <Box sx={{boxShadow: {sm:'0px 0px 4px 1px #00000040',xs:'0'},borderRadius:{lg:'0 16px 16px 0',sm:'16px',xs:'0'},flex:1,position:{lg:'relative',xs:'absolute'},backgroundColor:'#ffffff',width:{xs:'100%',lg:'auto'}}}>
            <Box sx={{width:'100%',height:selectedChat!==null?{sm:'820px',xs:'100vh'}:'auto'}}>

                {selectedChat!=null && <div className='chat-container'>
                    <div className='chat_Profile_frnd'>
                        <Box>
                        {
                                (clientphotoUrl && clientphotoUrl !=='' )?(
                                    <img
                                    // className='user-picture-img'
                                    alt={clientname[0]}
                                    src={clientphotoUrl}
                                    style={{ borderRadius:'50%',width:'50px',height:'50px',objectFit: 'cover'  }}
                                />
                                ):(
                                    <Avatar sx={{ textTransform: 'uppercase', width: '50px', height: '50px' }}>
                                    {clientname?.split(' ').slice(0, 2).map(part => part[0]).join('')}
                                    </Avatar>
                                )
                            }
                           {freeLancerOnline ? <div className='chat_Profile_Online'></div> : null}
                        </Box>
                        <div className='chat_Profile_frnd_Name'>
                            <h3>{clientname}</h3>
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
                        {(freelancerphotoUrl && freelancerphotoUrl!=='') ? (
                                                  <img
                                                      // className='user-picture-img'
                                                      alt={freelancername[0]}
                                                      src={freelancerphotoUrl}
                                                      style={{ borderRadius:'50%',width:'70px',height:'70px',objectFit: 'cover'  }}
                                                  />
                                              ) : (
                                                <Avatar sx={{ textTransform: 'uppercase', width: '70px', height: '70px' }}>
                                                {freelancername?.split(' ').slice(0, 2).map(part => part[0]).join('')}
                                                </Avatar>
                                              )}
                            {clientOnline ? <div className='chat_container_client_Online'></div> : null}
                        </Box>
                        <div className='chat-container_client_Name'>
                            <h3>{freelancername}</h3>
                            <p>{freelancerlocation?freelancerlocation:"Location : N/A"}</p>
                        </div>
                    </div>
                    <Divider />
                    

                    
                    {/* <div className='chat-container_chat_date'>
                        8 Dec 2024
                    </div> */}

                    <Grid sx={{padding:{sm:'20px 35px',xs:'14px'},display:'flex',flexDirection:'column',gap:'13px',overflowY:'auto',width:'100%',flex:1}} className='chat-container_chat_msg_scroll' ref={chatContainerRef}>
                    {messages.map((message, index) => {
                      
                        {if(message.status === 'NO_OF_DELIVERABLES'){
                                {console.log("message",message)}
                                {console.log("selectedChatInfo",selectedChatInfo)}
                           }
                        }
                                 if (message.status === 'DELIVERABLES_ACCEPTED') {
                                    countDeliverable++;
                                }
                                {console.log("countDeliverable",countDeliverable)}
                                if (message.status === 'DELIVERABLE_IMAGE_ACCEPTED') {
                                    submittedacceptDeliverables++;
                                }
                                if(message.status === 'NEGOTIATION_ACCEPTED'){
                                    priceAcceptId=message.id;
                                }
                                const convertedDate=handleConvertDate(message.created_at);
                             return (
                             <Fragment key={`message-container-${message.id || index}`}>
                             { (index===0 || handleConvertDate(messages[index-1]?.created_at)!==convertedDate) && (
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
                             <Grid  key={`message-${message.id || index}`}  className={message.sent_by!==selectedChatInfo?.manager_id ? 'message-receive' : 'message-send'}
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
                                                      {(message.sent_by!==selectedChatInfo?.manager_id?(freelancername):(clientname))?.split(' ').slice(0, 2).map(part => part[0]).join('')}
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
                                                          style={{ borderRadius:'50%',width:'40px',height:'40px' ,objectFit: 'cover' }}
                                                      />
                                                      ):(
                                                          <Avatar sx={{ textTransform: 'uppercase', width: '40px', height: '40px'}}>
                                                    {/* {message.username[0]} */}
                                                    {(message.sent_by!==selectedChatInfo?.manager_id?(freelancername):(clientname))?.split(' ').slice(0, 2).map(part => part[0]).join('')}
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
                                <Button sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 20px',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} onClick={()=>handleAcceptSubmission(message.id)}>Accept</Button>
                                <Button sx={{backgroundColor:'#fff',color:'#B27EE3',padding:'7px 20px',border:'1px solid #B27EE3',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#fff',color:'#B27EE3'}}} onClick={()=>[handleRejectSubmission(message.id)]} >Decline</Button>
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
                                                message.status==='DELIVERABLES' && message.sent_by===selectedChatInfo?.manager_id?
                                                (<Box sx={{display: 'flex',width:'100%',flexDirection:'row',gap:'10px',justifyContent:'center'}}>
                                                    <Button sx={{backgroundColor:'#fff',color:'#B27EE3',padding:'7px 20px',border:'1px solid #B27EE3',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#fff',color:'#B27EE3'}}} onClick={()=>{}}>Cancel</Button>
                                                    <Button sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 20px',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} onClick={()=>{}}>Edit</Button>
                                                </Box>):null
                                            }
                                            </Box>
                                        )}
                                            {
                                                message.status==='NO_OF_DELIVERABLES' && message.sent_by===selectedChatInfo?.manager_id &&
                                                (
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
                                                <Box sx={{display: 'flex',width:'100%',flexDirection:'row',gap:'10px',justifyContent:'center'}}>
                                                    <Button sx={{backgroundColor:'#fff',color:'#B27EE3',padding:'7px 20px',border:'1px solid #B27EE3',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#fff',color:'#B27EE3'}}} onClick={()=>{}}>Cancel</Button>
                                                    console.log("yes reached here with wuabkvbudxfvbk")
                                                    <Button sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 20px',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} onClick={()=>{}}>Edit</Button>
                                                </Box>
                                                </Box>
                                                )
                                            }
                                        {(message.status === 'NEGOTIATION_ACCEPTED' || message.status=== 'NEGOTIATION_PENDING' || message.status==='NEGOTIATION_REJECTED') && (
                                            <Box sx={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'10px'}}>
                                            <Box sx={{
                                                    maxWidth: '100%',
                                                    color: message.status!=='NEGOTIATION_REJECTED'?'#ffffff':'#000000',
                                                    padding:'10px 15px 10px 15px',
                                                    minWidth:{md:'120px'},
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
                                                    <Button sx={{backgroundColor:'#B27EE3',color:'#fff',padding:'7px 20px',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#B27EE3',color:'#fff'}}} onClick={()=>{handleAcceptPrice(message.id)}}>Accept</Button>
                                                    <Button sx={{backgroundColor:'#fff',color:'#B27EE3',padding:'7px 20px',border:'1px solid #B27EE3',fontSize:'14px',borderRadius:'16px',':hover':{backgroundColor:'#fff',color:'#B27EE3'}}} onClick={()=>handleNegotiate(message.id)}>Negotiaite</Button>
                                                </Box>):null
                                            }
                                            </Box>
                                            
                                        )}
                                        {message.status === 'NORMAL' && (
                                            <Typography sx={{
                                                    fontWeight:'500',
                                                    color: '#000000',
                                                    maxWidth: '50%',
                                                    wordBreak:'break-word',
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
                                    message.status==="NO_OF_DELIVERABLES_ACCEPTED" && (
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
                                         <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>{message.message} deliverable(s) confirmed.</Typography>
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
                                    message.status==="NEGOTIATION_ACCEPTED" && (
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
                                         <Typography sx={{color:'#454545',fontWeight:'700',fontSize:{md:'18px',sm:'15px',xs:'13px'}}}>Rate accepted! Setup deliverables to continue</Typography>
                                         
                                         {/* Display accepted price and deliverables */}
                                         {price && deliverables && (
                                           <Box sx={{
                                             display:'flex',
                                             flexDirection:'column',
                                             gap:'5px',
                                             alignItems:'center',
                                             padding:'10px',
                                             backgroundColor:'#f0f0f0',
                                             borderRadius:'8px',
                                             minWidth:'200px'
                                           }}>
                                             <Typography sx={{color:'#333',fontWeight:'600',fontSize:'14px'}}>
                                               Accepted Price: ₹{price}
                                             </Typography>
                                             <Typography sx={{color:'#666',fontSize:'12px'}}>
                                               Deliverables: {deliverables.count}
                                             </Typography>
                                           </Box>
                                         )}
                                         

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
                                </Fragment>
                            )})
                            }
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
                                                <Form.Group className='form-group' controlId="form">
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
                                                onClick={()=>submitReview()}
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
                                // ref={(textarea) => textarea && updateTextareaHeight(textarea)}
                                rows="3"
                                // maxRows={6}
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
                                    
                                    <Box sx={{position:'relative', display:'flex', gap:'10px', alignItems:'center'}} ref={container2}>
                                    {/* Calendar icon for individual deliverable submission - only show after deliverable proposal is accepted */}
                                    {(() => {
                                        const hasDeliverablesAccepted = messages.some(msg => msg.status === 'DELIVERABLES_ACCEPTED');
                                        // console.log('🔍 Calendar Icon Debug (Client):');
                                        // console.log('- Total messages:', messages.length);
                                        // console.log('- Messages with DELIVERABLES_ACCEPTED:', messages.filter(msg => msg.status === 'DELIVERABLES_ACCEPTED').length);
                                        // console.log('- Has deliverables accepted:', hasDeliverablesAccepted);
                                        // console.log('- All message statuses:', messages.map(msg => ({ id: msg.id, status: msg.status, message: msg.message?.substring(0, 30) })));
                                        return hasDeliverablesAccepted;
                                    })() && (
                                        <i className="fa-regular fa-calendar" onClick={()=>handleOpenDeliverable()} ></i>
                                    )}
                                    {/* + Icon for Setup Deliverables - only show when eligible */}
                                    {(() => {
                                        const hasNegotiationAccepted = messages.some(msg => msg.status === 'NEGOTIATION_ACCEPTED');
                                        const hasDeliverablesAccepted = messages.some(msg => msg.status === 'DELIVERABLES_ACCEPTED');
                                        const shouldShowPlus = hasNegotiationAccepted && !hasDeliverablesAccepted;
                                        // console.log('🔍 Plus Button Debug (Client):');
                                        // console.log('- Has negotiation accepted:', hasNegotiationAccepted);
                                        // console.log('- Has deliverables accepted:', hasDeliverablesAccepted);
                                        // console.log('- Should show plus button:', shouldShowPlus);
                                        return shouldShowPlus;
                                    })() && (
                                        <i 
                                            className="fa-solid fa-plus" 
                                            onClick={handleSetupDeliverablesOpen}
                                            style={{
                                                fontSize: '16px',
                                                color: '#B27EE3',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                borderRadius: '50%',
                                                backgroundColor: '#f0f0f0',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#B27EE3';
                                                e.target.style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#f0f0f0';
                                                e.target.style.color = '#B27EE3';
                                            }}
                                        ></i>
                                    )}
                                    <Box sx={{position:'absolute',display:deliverableInputOpen?'flex':'none',top:'-180px',left:'-20px',backgroundColor:'#ffffff',boxShadow:'0px 0px 4px 1px #00000040',borderRadius:'16px',padding:'15px',flexDirection:'column',gap:'10px'}}>
                                            <Box sx={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',gap:'20px'}} >
                                               <Typography>Post a Deliverable :</Typography>
                                               <RxCrossCircled style={{fontSize:'20px',cursor:'pointer'}} onClick={handleCloseDeliverableInput} />
                                            </Box>
                                            <Box sx={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
                                                <input 
                                                placeholder='Deliverable'
                                                    autoFocus
                                                    type="text"
                                                    value={deliverableValue}
                                                    onChange={(e)=>setDeliverableValue(e.target.value)}
                                                    style={{border:'none',outline:'none',boxShadow:'0px 0px 4px 1px #00000040',borderRadius:'8px',padding:'5px 10px',width:'200px'}}
                                                />
                                                <DatePicker
                                                id="custom-datapicker"
                                                // value={selectedDate!=='' ? moment(selectedDate, "DD-MM-YYYY") : ''}
                                                onChange={handleDateChange}
                                                 style={{width:'100%'}} format="DD-MM-YYYY"/>
                                                <Box sx={{
                                                    backgroundColor:'#B27EE3',
                                                    cursor:'pointer',
                                                    width:'100%',
                                                    borderRadius:'8px',textAlign:'center',padding:'2px 0'
                                                }}  onClick={chatCompleted? null:(editMode? handleSendEditedDeliverable:handleSendDeliverable)} >
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

                {/* Setup Deliverables Modal - Moved completely outside chat container */}
                <Modal
                    open={setupDeliverablesOpen}
                    onClose={handleSetupDeliverablesClose}
                    aria-labelledby="setup-deliverables-modal-title"
                    aria-describedby="setup-deliverables-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: {sm:'500px',xs:'90%'},
                        backgroundColor: '#fff',
                        boxShadow: '0px 0px 4px 1px #00000040',
                        borderRadius:'7px',
                        padding:'25px'
                    }}>
                        <Typography sx={{color:'#000000',fontSize:{sm:'23px',xs:'18px'},fontWeight:'700', marginBottom:'20px'}}>
                            Setup Deliverables
                        </Typography>
                        
                        <Box sx={{display:'flex',flexDirection:'column',gap:'20px'}}>
                            {/* Number of Deliverables Input */}
                            <Box>
                                <Typography sx={{color:'#333',fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>
                                    Number of Deliverables
                                </Typography>
                                                                    <input
                                        type="number"
                                        value={numberOfDeliverables}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                setNumberOfDeliverables('');
                                            } else {
                                                const numValue = parseInt(value);
                                                if (!isNaN(numValue)) {
                                                    setNumberOfDeliverables(numValue);
                                                }
                                            }
                                        }}
                                    style={{
                                        width:'100%',
                                        padding:'10px',
                                        border:'1px solid #ddd',
                                        borderRadius:'8px',
                                        fontSize:'16px',
                                        outline:'none'
                                    }}
                                />
                            </Box>

                            {/* Price Display (Read-only) */}
                            <Box>
                                <Typography sx={{color:'#333',fontSize:'16px',fontWeight:'600',marginBottom:'8px'}}>
                                    Accepted Price
                                </Typography>
                                <input
                                    type="text"
                                    value={`₹${price || '0'}`}
                                    readOnly
                                    style={{
                                        width:'100%',
                                        padding:'10px',
                                        border:'1px solid #ddd',
                                        borderRadius:'8px',
                                        fontSize:'16px',
                                        backgroundColor:'#f5f5f5',
                                        color:'#666',
                                        cursor:'not-allowed'
                                    }}
                                />
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'10px'}}>
                                <Button
                                    onClick={handleSetupDeliverablesClose}
                                    sx={{
                                        borderRadius:'8px',
                                        color:'#666',
                                        backgroundColor:'#f0f0f0',
                                        padding:'8px 20px',
                                        fontSize:'14px',
                                        textTransform:'none',
                                        '&:hover':{
                                            backgroundColor:'#e0e0e0'
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSetupDeliverablesSubmit}
                                    sx={{
                                        borderRadius:'8px',
                                        color:'#fff',
                                        backgroundColor:'#B27EE3',
                                        padding:'8px 20px',
                                        fontSize:'14px',
                                        textTransform:'none',
                                        '&:hover':{
                                            backgroundColor:'#9B6BC7'
                                        }
                                    }}
                                >
                                    Setup Deliverables
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>

                <Toaster
                    position="top-center"
                    reverseOrder={true}
                />


            </Box>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}
