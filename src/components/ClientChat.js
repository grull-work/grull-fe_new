import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Header4 from "./Header4";
import toast, { Toaster } from "react-hot-toast";
import { chatService } from "../services/chatService";
import { jobService } from "../services/jobService";
import { userService } from "../services/userService";
import BAPI, { getSocketIOUrl } from "../helper/variable";
import io from "socket.io-client";
import ChatSidebar from "./chat/ChatSidebar";
import MessageBubble from "./chat/MessageBubble";
import ChatInput from "./chat/ChatInput";

export default function Clientchat() {
  const accessToken = localStorage.getItem("accessToken");
  const [freelancers, setFreelancers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userMessage, setuserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  // Chat Input State
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Price Negotiation State (Client receives mostly, but can edit deliverables)
  // Client doesn't typically propose price via the same popup logic as freelancer in original, but keeping state for consistency if needed.
  const [priceInputOpen, setPriceInputOpen] = useState(false);
  const [priceValue, setPriceValue] = useState("");

  // Deliverable State
  const [deliverableInputOpen, setDeliverableInputOpen] = useState(false);
  const [deliverableValue, setDeliverableValue] = useState("");

  // Phase 2: Deliverable Count Negotiation State
  const [deliverableCountOpen, setDeliverableCountOpen] = useState(false);
  const [deliverableCountValue, setDeliverableCountValue] = useState("");

  // Phase 2.1: Project Parts Details Negotiation
  const [projectPartsInputOpen, setProjectPartsInputOpen] = useState(false);
  const [projectPartTitle, setProjectPartTitle] = useState("");
  const [projectPartDate, setProjectPartDate] = useState("");

  // Chat Info State
  const [freelancerphotoUrl, setFreelancerPhotoUrl] = useState(null);
  const [clientphotoUrl, setClientPhotoUrl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatInfo, setSelectedChatInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editmessageId, setEditmessageId] = useState("");

  // UI State
  const [clientname, setClientname] = useState("");
  const [freelancername, setfreelancername] = useState("");
  const [freelancerlocation, setFreelancerlocation] = useState("");
  const [chatCompleted, setChatCompleted] = useState(false);
  const [job_title, setSelectedjobtitle] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Deliverables
  const [remainingDeliverables, setRemainingDeliverables] = useState(0);

  // Refs
  const container1 = useRef();
  const container2 = useRef();
  const container3 = useRef();

  // Socket
  const [websckt, setWebsckt] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (container1.current && !container1.current.contains(e.target)) setOpen(false);
      if (container2.current && !container2.current.contains(e.target)) setDeliverableInputOpen(false);
      if (container3.current && !container3.current.contains(e.target)) setPriceInputOpen(false);
      // Optional: if we add a new container for deliverable count, we would handle it here. 
      // For now, let's reuse container2 if we use the same icon, or add container4.
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setClientname(user.full_name);
      setClientPhotoUrl(user.photo_url);
    }
  }, []);

  // Socket Initialization
  useEffect(() => {
    const url = getSocketIOUrl();
    const socket = io(url, { transports: ["websocket", "polling"], autoConnect: true });

    socket.on("connect", () => {
      if (selectedChat) {
        const user = JSON.parse(localStorage.getItem("user"));
        socket.emit("join_chat", { chat_id: selectedChat, user_id: user.id });
      }
    });

    socket.on("new_message", (data) => {
      if (data.chat_id === selectedChat && data.data) {
        setMessages((prev) => {
          if (prev.some(msg => msg.id === data.data.id)) return prev;
          return [...prev.slice(-99), data.data];
        });
      }
    });

    socket.on("message_update", (data) => {
      if (data.chat_id === selectedChat) {
        setMessages((prev) => prev.map(msg => msg.id === data.data.id ? { ...msg, ...data.data } : msg));
      }
    });

    socket.on("message_deleted", (data) => {
      if (data.chat_id === selectedChat) {
        setMessages((prev) => prev.filter(msg => msg.id !== data.message_id));
      }
    });

    setWebsckt(socket);
    return () => socket.disconnect();
  }, [selectedChat]);

  const sendMessageSocket = () => {
    if (websckt?.connected) {
      websckt.emit("message_sent", { type: "message_sent", chat_id: selectedChat });
    }
  };

  useEffect(() => {
    if (websckt && websckt.connected && selectedChat) {
      const user = JSON.parse(localStorage.getItem("user"));
      websckt.emit("join_chat", { chat_id: selectedChat, user_id: user.id });
    }
  }, [selectedChat, websckt]);

  const updateSidebarLocally = (chatId) => {
    setFreelancers(prev => {
      const chatIndex = prev.findIndex(c => {
        const obj = typeof c === 'string' ? JSON.parse(c) : c;
        return obj.id === chatId;
      });
      if (chatIndex === -1) return prev;
      const newArr = [...prev];
      const chat = newArr.splice(chatIndex, 1)[0];
      const chatObj = typeof chat === 'string' ? JSON.parse(chat) : chat;
      chatObj.created_at = new Date().toISOString();
      return [chatObj, ...newArr];
    });
  };

  const getChats = async () => {
    try {
      const response = await chatService.getManagerChats();
      const sortedFreelancers = response.data.sort((a, b) => {
        const objA = typeof a === 'string' ? JSON.parse(a) : a;
        const objB = typeof b === 'string' ? JSON.parse(b) : b;
        return new Date(objB.created_at) - new Date(objA.created_at);
      });
      setFreelancers(sortedFreelancers);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  const filteredFreelancers = freelancers.filter((chat) => {
    const chatObj = typeof chat === 'string' ? JSON.parse(chat) : chat;
    const firstName = chatObj.first_name && chatObj.first_name !== "undefined" ? chatObj.first_name : "User";
    const lastName = chatObj.last_name && chatObj.last_name !== "undefined" ? chatObj.last_name : "";
    return `${firstName} ${lastName}`.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedChat) return;
      try {
        setIsFetchingMore(true);
        const [chatInfoRes, messagesRes] = await Promise.all([
          chatService.getChatById(selectedChat),
          chatService.getChatMessages(selectedChat, 1, 25)
        ]);

        setSelectedChatInfo(chatInfoRes.data);
        const msgs = messagesRes.data.reverse();
        setMessages(msgs);
        setPage(1);
        setHasMore(messagesRes.data.length === 25);

      } catch (err) {
        toast.error("Failed to load chat. It may no longer exist.");
        setSelectedChat(null);
        setSelectedChatInfo(null);
        setMessages([]);
      } finally {
        setIsFetchingMore(false);
      }
    };
    fetchData();
  }, [selectedChat]);

  const loadMoreMessages = async () => {
    if (!hasMore || isFetchingMore || !selectedChat) return;
    try {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      const res = await chatService.getChatMessages(selectedChat, nextPage, 25);

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        const newMsgs = res.data.reverse(); // ascending for display
        setMessages(prev => [...newMsgs, ...prev]);
        setPage(nextPage);
        setHasMore(res.data.length === 25);

        if (chatContainerRef.current) {
          const scrollHeight = chatContainerRef.current.scrollHeight;
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - scrollHeight;
            }
          }, 0);
        }
      }
    } catch (err) {
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && hasMore && !isFetchingMore) {
      loadMoreMessages();
    }
  };

  const handleChatSelect = (chat, title) => {
    if (selectedChat !== chat.id) {
      setSelectedChat(chat.id);
      setSelectedjobtitle(title);
      const firstName = chat.first_name && chat.first_name !== "undefined" ? chat.first_name : "User";
      const lastName = chat.last_name && chat.last_name !== "undefined" && chat.last_name !== "Account" ? chat.last_name : "";
      setfreelancername(`${firstName} ${lastName}`.trim());
      setFreelancerlocation(chat.location || "");
      setFreelancerPhotoUrl(chat.photo_url || "");
      setMessages([]);
      setChatCompleted(false);
      setDeliverableCountOpen(false);
      setProjectPartsInputOpen(false);
      setProjectPartTitle("");
      setProjectPartDate("");
      setSelectedChatInfo(null);
      setOpen(false);
    }
  };

  const handleConvertDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Recently";
    }
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith("image/")) setImage(file);
    else if (file.type.startsWith("video/")) setSelectedVideo(file);
    else toast.error("Unsupported file type");
    setOpen(false);
  };

  const sendMessage = async () => {
    if (!selectedChatInfo) return toast.error("Please select a chat first");
    if (!userMessage.trim()) return toast.error("Please write a message");
    if (isSending) return;
    setIsSending(true);
    const newMessage = {
      message: userMessage,
      sent_by: selectedChatInfo.manager_id,
      chat_id: selectedChatInfo.id,
      status: "NORMAL", // Fixed status
      deadline: ""
    };
    try {
      const res = await chatService.sendMessage(newMessage);
      const msgData = res.data?.data;
      if (msgData) {
        setMessages(prev => {
          if (prev.some(m => m.id === msgData.id)) return prev;
          return [...prev.slice(-99), { ...newMessage, id: msgData.id, created_at: msgData.created_at }];
        });
      }
      setuserMessage("");
      sendMessageSocket();
      updateSidebarLocally(selectedChatInfo.id);
    } catch (err) { toast.error("Failed to send message"); }
    finally { setIsSending(false); }
  };

  const handleOpenPrice = () => {
    setPriceInputOpen(!priceInputOpen);
    setPriceValue("");
  };

  const handleSendPrice = async () => {
    if (!selectedChatInfo) return toast.error("Please select a chat first");
    if (!priceValue.trim()) return toast.error("Invalid price");
    if (isSending) return;
    setIsSending(true);
    const payload = {
      message: priceValue,
      sent_by: selectedChatInfo.manager_id,
      chat_id: selectedChatInfo.id,
      status: "NEGOTIATION_PENDING",
      deadline: ""
    };
    try {
      const res = await chatService.sendMessage(payload);
      const msgData = res.data?.data;
      if (msgData) {
        setMessages(prev => {
          if (prev.some(m => m.id === msgData.id)) return prev;
          return [...prev.slice(-99), { ...payload, id: msgData.id, created_at: msgData.created_at }];
        });
      }
      createnotification("Price Negotiation", `${clientname} has proposed a rate.`);
      setPriceInputOpen(false);
      setPriceValue("");
      sendMessageSocket();
      updateSidebarLocally(selectedChatInfo.id);
    } catch (err) { toast.error("Failed to propose rate"); }
    finally { setIsSending(false); }
  };

  const createnotification = async (title, content) => {
    try {
      await chatService.createNotification({ title, content, notification_for: selectedChatInfo.freelancer_id });
    } catch (err) { }
  };

  // Client Specific Actions
  const handleAcceptPrice = async (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    const acceptedPrice = parseFloat(message.message);
    if (!acceptedPrice) return toast.error("Invalid price");

    try {
      await chatService.updateMessageStatus({ message_id: messageId, status: "NEGOTIATION_ACCEPTED" });
      await chatService.acceptPrice({
        job_id: selectedChatInfo.job_id,
        accepted_price: acceptedPrice,
        freelancer_id: selectedChatInfo.freelancer_id
      });
      createnotification("Price Accepted", `${clientname} accepted price for ${job_title}.`);

      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: "NEGOTIATION_ACCEPTED" } : msg));
      sendMessageSocket();
      toast.success("Price accepted!");
    } catch (err) { toast.error("Failed to accept price"); }
  };

  const handleNegotiatePrice = async (messageId) => {
    try {
      await chatService.updateMessageStatus({ message_id: messageId, status: "NEGOTIATION_REJECTED" });
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: "NEGOTIATION_REJECTED" } : msg));
      createnotification("Price Rejected", `${clientname} rejected price for ${job_title}.`);
      sendMessageSocket();
    } catch (err) { }
  };

  const handleAcceptSubmission = async (messageId) => {
    try {
      await chatService.updateMessageStatus({ message_id: messageId, status: "DELIVERABLE_IMAGE_ACCEPTED" });

      const jobRes = await jobService.getApplicationById(selectedChatInfo.application_id);
      const job = jobRes.data.job;
      const deliverableNum = job.completed_deliverable + 1;

      const paymentRes = await chatService.processDeliverable({
        job_id: job.id,
        deliverable_number: deliverableNum,
        action: "ACCEPT",
        remarks: `Payment for deliverable ${deliverableNum}`
      });

      toast.success(`Deliverable Accepted! Payment of ₹${(paymentRes.data.amount / 100).toFixed(2)} processed.`);

      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: "DELIVERABLE_IMAGE_ACCEPTED" } : msg));
      createnotification("Submission Accepted", `${clientname} accepted submission.`);
      sendMessageSocket();
    } catch (err) { toast.error("Failed to accept/pay."); }
  };

  const handleRejectSubmission = async (messageId) => {
    // Simplified rejection
    try {
      await chatService.updateMessageStatus({ message_id: messageId, status: "DELIVERABLE_IMAGE_REJECTED" });
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status: "DELIVERABLE_IMAGE_REJECTED" } : msg));
      createnotification("Submission Rejected", `${clientname} rejected submission.`);
      sendMessageSocket();
    } catch (err) { }
  };

  // Handlers for sending things (Client can send messages, image, video, maybe deliverables if they set milestones?)
  // ClientChat had SetupDeliverables logic.
  // We can treat handleSendDeliverable here as "Client adding a milestone" if your logic supports it.

  const handleOpenDeliverable = () => setDeliverableInputOpen(!deliverableInputOpen);
  const handleCloseDeliverableInput = () => { setDeliverableInputOpen(false); setDeliverableValue(""); };

  const handleSendDeliverable = async () => {
    if (!selectedChatInfo) return toast.error("Please select a chat first");
    if (!deliverableValue.trim()) return toast.error("Invalid link");
    const payload = {
      message: deliverableValue,
      sent_by: selectedChatInfo.manager_id,
      chat_id: selectedChatInfo.id,
      status: "DELIVERABLES",
      deadline: ""
    };
    try {
      const res = await chatService.sendMessage(payload);
      setMessages(prev => [...prev.slice(-99), { ...res.data, ...payload }]);
      createnotification("New Milestone", `${clientname} added a new deliverable.`);
      setDeliverableInputOpen(false);
      setDeliverableValue("");
      sendMessageSocket();
      updateSidebarLocally(selectedChatInfo.id);
    } catch (err) { toast.error("Failed to add deliverable"); }
  };

  const handleOpenDeliverableCount = () => setDeliverableCountOpen(!deliverableCountOpen);
  const handleCloseDeliverableCount = () => { setDeliverableCountOpen(false); setDeliverableCountValue(""); };

  const handleSendDeliverableCount = async () => {
    if (!selectedChatInfo) return toast.error("Please select a chat first");
    if (!deliverableCountValue.trim() || isNaN(deliverableCountValue)) return toast.error("Invalid count");

    if (isSending) return;
    setIsSending(true);

    const payload = {
      message: deliverableCountValue,
      sent_by: selectedChatInfo.manager_id,
      chat_id: selectedChatInfo.id,
      status: "NO_OF_DELIVERABLES",
      deadline: ""
    };

    try {
      const res = await chatService.sendMessage(payload);
      const msgData = res.data?.data;
      if (msgData) {
        setMessages(prev => {
          if (prev.some(m => m.id === msgData.id)) return prev;
          return [...prev.slice(-99), { ...payload, id: msgData.id, created_at: msgData.created_at }];
        });
      }
      createnotification("Deliverable Count Proposed", `${clientname} proposed ${deliverableCountValue} deliverables.`);
      setDeliverableCountOpen(false);
      setDeliverableCountValue("");
      sendMessageSocket();
      updateSidebarLocally(selectedChatInfo.id);
      toast.success("Deliverable count proposed!");
    } catch (err) {
      toast.error("Failed to propose deliverable count");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendEditedDeliverableCount = async () => {
    if (!selectedChatInfo || !editmessageId) return;
    if (!deliverableCountValue.trim() || isNaN(deliverableCountValue)) return toast.error("Invalid count");

    if (isSending) return;
    setIsSending(true);

    try {
      await chatService.updateDeliverable({
        message_id: editmessageId,
        message: deliverableCountValue,
        deadline: ""
      });

      setMessages(prev => prev.map(msg =>
        msg.id === editmessageId ? { ...msg, message: deliverableCountValue } : msg
      ));

      setDeliverableCountOpen(false);
      setDeliverableCountValue("");
      setEditMode(false);
      setEditmessageId("");
      sendMessageSocket();
      toast.success("Deliverable count updated!");
    } catch (err) {
      toast.error("Failed to update deliverable count");
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenProjectParts = () => {
    setProjectPartTitle("");
    setProjectPartDate("");
    setProjectPartsInputOpen(true);
  };

  const handleSendProjectPart = async () => {
    if (!selectedChatInfo) return;
    if (!projectPartTitle.trim()) return toast.error("Please enter a part title");
    if (!projectPartDate) return toast.error("Please enter a deadline date");

    if (isSending) return;
    setIsSending(true);

    const payload = {
      message: projectPartTitle,
      sent_by: selectedChatInfo.manager_id,
      chat_id: selectedChatInfo.id,
      status: "PROJECT_PART_DETAIL",
      deadline: projectPartDate
    };

    try {
      if (editMode && editmessageId) {
        await chatService.updateMessage({
          message_id: editmessageId,
          message: projectPartTitle,
          deadline: projectPartDate
        });
        setMessages(prev => prev.map(m => m.id === editmessageId ? { ...m, message: projectPartTitle, deadline: projectPartDate } : m));
        toast.success("Project part updated!");
      } else {
        const res = await chatService.sendMessage(payload);
        const msgData = res.data?.data;
        if (msgData) {
          setMessages(prev => {
            if (prev.some(m => m.id === msgData.id)) return prev;
            return [...prev.slice(-99), { ...payload, id: msgData.id, created_at: msgData.created_at }];
          });
        }
        createnotification("Project Part Proposal", `${clientname} proposed a project part: ${projectPartTitle} (Due: ${projectPartDate})`);
        toast.success("Project part proposed!");
      }

      setProjectPartsInputOpen(false);
      setProjectPartTitle("");
      setProjectPartDate("");
      setEditMode(false);
      setEditmessageId(null);
      sendMessageSocket();
      updateSidebarLocally(selectedChatInfo.id);
    } catch (err) {
      console.error("Project part error:", err);
      const errMsg = err.response?.data?.detail || err.message || "Unknown error";
      toast.error(editMode ? `Failed to update part detail: ${errMsg}` : `Failed to send part detail: ${errMsg}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelMessage = async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      
      // Clear edit state if this message was being edited
      if (editmessageId === messageId) {
        setEditMode(false);
        setEditmessageId(null);
        setProjectPartsInputOpen(false);
        setPriceInputOpen(false);
        setDeliverableCountOpen(false);
        setProjectPartTitle("");
        setProjectPartDate("");
      }

      sendMessageSocket();
      toast.success("Message cancelled");
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || "Unknown error";
      toast.error(`Failed to cancel message: ${errMsg}`);
    }
  };

  const handleEditMessage = (message) => {
    if (message.status === "NO_OF_DELIVERABLES") {
      setDeliverableCountValue(message.message);
      setEditmessageId(message.id);
      setEditMode(true);
      setDeliverableCountOpen(true);
    } else if (message.status === "NEGOTIATION_PENDING") {
      setPriceValue(message.message);
      setEditmessageId(message.id);
      setEditMode(true);
      setPriceInputOpen(true);
    } else if (message.status === "PROJECT_PART_DETAIL") {
      setProjectPartTitle(message.message);
      setProjectPartDate(message.deadline || "");
      setEditmessageId(message.id);
      setEditMode(true);
      setProjectPartsInputOpen(true);
    } else if (message.status === "DELIVERABLE_IMAGE") {
      // ... existing or planned logic for other types
    }
  };

  // File Upload Effect
  useEffect(() => {
    const uploadFile = async (file, type) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "er103mfg");
      data.append("cloud_name", "dlpcihcmz");
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/dlpcihcmz/${type}/upload`, { method: "post", body: data });
        const json = await res.json();
        if (json.url) {
          await chatService.sendMessage({
            message: json.url,
            sent_by: selectedChatInfo.manager_id,
            chat_id: selectedChatInfo.id,
            status: type === 'image' ? "IMAGE" : "VIDEO",
            deadline: ""
          });
          sendMessageSocket();
        }
      } catch (err) { toast.error("Upload failed"); }
    };

    if (image) uploadFile(image, 'image').then(() => setImage(null));
    if (selectedVideo) uploadFile(selectedVideo, 'video').then(() => setSelectedVideo(null));
  }, [image, selectedVideo]);


  // Scroll to bottom on initial load or new message
  useEffect(() => {
    if (chatContainerRef.current && page === 1) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, page]);


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "#f0f2f5" }}>
      <Header4 />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", flexDirection: { xs: "column", lg: "row" } }}>

        <Box sx={{
          width: { lg: "350px", xs: "100%" },
          height: "100%",
          display: { xs: selectedChat ? "none" : "block", lg: "block" },
          borderRight: "1px solid #e0e0e0"
        }}>
          <ChatSidebar
            filteredChats={filteredFreelancers}
            search={search}
            setSearch={setSearch}
            handleChatSelect={handleChatSelect}
            handleConvertDate={handleConvertDate}
            selectedChatId={selectedChat}
            isFreelancer={false} // Client view
            isLoading={isLoading}
          />
        </Box>

        <Box sx={{ flex: 1, display: { xs: selectedChat ? "flex" : "none", lg: "flex" }, flexDirection: "column", height: "100%", backgroundColor: '#fff' }}>
          {selectedChat ? (
            <>
              <Box sx={{ padding: "10px 20px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {freelancerphotoUrl ? (
                    <img src={freelancerphotoUrl} alt="freelancer" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                  ) : (
                    <Avatar>{freelancername?.[0]}</Avatar>
                  )}
                  <Box>
                    <Typography variant="h6">{freelancername}</Typography>
                    <Typography variant="caption">{freelancerlocation || "Location N/A"}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <div onClick={() => setSelectedChat(null)} style={{ cursor: 'pointer' }}>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </Box>
              </Box>

              <Box
                sx={{ flex: 1, overflowY: "auto", padding: 2, position: 'relative' }}
                ref={chatContainerRef}
                onScroll={handleScroll}
              >

                {isFetchingMore && messages.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  messages.map((msg, index) => (
                    <MessageBubble
                      key={msg.id || index}
                      message={msg}
                      isSender={msg.sent_by === selectedChatInfo?.manager_id}
                      senderName={msg.sent_by === selectedChatInfo?.manager_id ? clientname : freelancername}
                      senderAvatar={msg.sent_by === selectedChatInfo?.manager_id ? clientphotoUrl : freelancerphotoUrl}
                      onUnsend={handleCancelMessage}
                      onEdit={handleEditMessage}
                      handleConvertDate={handleConvertDate}
                      showDate={index === 0 || handleConvertDate(messages[index - 1]?.created_at) !== handleConvertDate(msg.created_at)}
                      onAcceptPrice={handleAcceptPrice}
                      onNegotiatePrice={handleNegotiatePrice}
                      onAcceptDeliverable={handleAcceptSubmission}
                      onRejectDeliverable={handleRejectSubmission}
                      onCancel={handleCancelMessage}
                      onAcceptDeliverableCount={(id) => { }}
                      onRejectDeliverableCount={(id) => { }}
                      onAcceptPartsList={(id) => { }}
                      onRejectPartsList={(id) => { }}
                      canProposeProjectParts={true}
                    />
                  ))
                )}
              </Box>

              <Box sx={{ padding: 2, borderTop: "1px solid #eee" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                  <ChatInput
                    open={open}
                    setOpen={setOpen}
                    chatCompleted={chatCompleted}
                    handleFileChange={handleFileChange}
                    handleOpenPrice={handleOpenPrice}
                    priceInputOpen={priceInputOpen}
                    handleClosePriceInput={() => { setPriceInputOpen(false); setEditMode(false); }}
                    priceValue={priceValue}
                    setPriceValue={setPriceValue}
                    handleSendPrice={handleSendPrice}
                    editMode={editMode}
                    handleSendEditedDeliverableCount={handleSendEditedDeliverableCount}

                    projectPartsInputOpen={projectPartsInputOpen}
                    handleOpenProjectParts={handleOpenProjectParts}
                    handleCloseProjectParts={() => setProjectPartsInputOpen(false)}
                    projectPartTitle={projectPartTitle}
                    setProjectPartTitle={setProjectPartTitle}
                    projectPartDate={projectPartDate}
                    setProjectPartDate={setProjectPartDate}
                    handleSendProjectPart={handleSendProjectPart}
                    totalDeliverables={(() => {
                      const m = messages.find(msg => msg.status === "NO_OF_DELIVERABLES_ACCEPTED");
                      return m ? parseInt(m.message) : 0;
                    })()}
                    currentPartNumber={(() => {
                      const count = messages.filter(msg =>
                        msg.status === "PROJECT_PART_DETAIL_ACCEPTED" ||
                        msg.status === "PROJECT_PART_DETAIL"
                      ).length;
                      return count + 1;
                    })()}

                    deliverableInputOpen={deliverableInputOpen}
                    handleOpenDeliverable={handleOpenDeliverable}
                    handleCloseDeliverableInput={handleCloseDeliverableInput}
                    deliverableValue={deliverableValue}
                    setDeliverableValue={setDeliverableValue}
                    handleSendDeliverable={handleSendDeliverable}

                    showDeliverableCountIcon={messages.some(m => m.status === "NEGOTIATION_ACCEPTED") && !messages.some(m => m.status === "NO_OF_DELIVERABLES_ACCEPTED")}
                    showProjectPartsIcon={(() => {
                      const m = messages.find(msg => msg.status === "NO_OF_DELIVERABLES_ACCEPTED");
                      const total = m ? parseInt(m.message) : 0;
                      const activeProposals = messages.filter(msg =>
                        msg.status === "PROJECT_PART_DETAIL_ACCEPTED" ||
                        msg.status === "PROJECT_PART_DETAIL"
                      ).length;
                      return total > 0 && activeProposals < total;
                    })()}
                    deliverableCountInputOpen={deliverableCountOpen}
                    handleOpenDeliverableCount={handleOpenDeliverableCount}
                    handleCloseDeliverableCount={() => { setDeliverableCountOpen(false); setEditMode(false); }}
                    deliverableCountValue={deliverableCountValue}
                    setDeliverableCountValue={setDeliverableCountValue}
                    handleSendDeliverableCount={handleSendDeliverableCount}

                    sendMessage={sendMessage}
                    container1Ref={container1}
                    container2Ref={container2}
                    container3Ref={container3}
                    showCalendar={true} // Client can always see/add deliverables/milestones?
                    showPriceIcon={!messages.some(m => m.status === "NEGOTIATION_ACCEPTED")}
                  />
                  <InputBase
                    sx={{ flex: 1, backgroundColor: "#f0f2f5", padding: "10px", borderRadius: "20px" }}
                    placeholder="Type a message..."
                    value={userMessage}
                    onChange={(e) => setuserMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                  />
                  <div className="chat_Profile_send_div">
                    <Button
                      onClick={sendMessage}
                      style={{ cursor: "pointer" }}
                      disabled={chatCompleted}
                    >
                      Send
                    </Button>
                  </div>
                </Box>
              </Box>
              <Toaster />
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>
              <Typography>Select a freelancer to start messaging</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
