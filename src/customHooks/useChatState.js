// src/customHooks/useChatState.js
import { useState, useRef } from 'react';

export const useChatState = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedChatInfo, setSelectedChatInfo] = useState(null);
    const [freelancers, setFreelancers] = useState([]);
    const [search, setSearch] = useState("");
    const [openMobile, setOpenMobile] = useState(false); // Renamed from openm
    
    // ...other common state

    return {
        selectedChat,
        setSelectedChat,
        selectedChatInfo,
        setSelectedChatInfo,
        freelancers,
        setFreelancers,
        search,
        setSearch,
        openMobile,
        setOpenMobile
    };
};
