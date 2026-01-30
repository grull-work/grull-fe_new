// src/customHooks/useChatSocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getSocketIOUrl } from '../common';
import toast from 'react-hot-toast';

export const useChatSocket = (selectedChat, user) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});

  useEffect(() => {
    const url = getSocketIOUrl();
    const newSocket = io(url, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      // Logic for connection (if needed)
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && selectedChat && user) {
        socket.emit("join_chat", {
            chat_id: selectedChat,
            user_id: user.id,
        });
    }
  }, [socket, selectedChat, user]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (data) => {
      if (data.chat_id === selectedChat) {
         if (data.data && data.data.message) {
            setMessages((prev) => {
                // Prevent duplicates logic here
                 const messageExists = prev.some(
                    (msg) => msg.id === data.data.id ||
                    (msg.message === data.data.message && 
                     msg.sent_by === data.data.sent_by && 
                     Math.abs(new Date(msg.created_at) - new Date(data.data.created_at)) < 1000)
                 );
                 if (messageExists) return prev;
                 return [...prev.slice(-99), data.data];
            });
         }
      }
    });
    
    // Add other socket listeners here (message_update etc.)

    return () => {
        socket.off("new_message");
        // Remove other listeners
    };
  }, [socket, selectedChat]);

  const sendMessageSocket = (chatId) => {
      if (socket && socket.connected) {
          socket.emit("message_sent", { type: "message_sent", chat_id: chatId });
      }
  };

  return { socket, messages, setMessages, sendMessageSocket };
};
