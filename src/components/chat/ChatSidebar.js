import React from "react";
import { Box, Typography, Divider, InputBase, IconButton, Avatar, CircularProgress } from "@mui/material";
import { CiSearch } from "react-icons/ci";

const ChatSidebar = ({
  filteredChats,
  search,
  setSearch,
  handleChatSelect,
  handleConvertDate,
  selectedChatId,
  isFreelancer, // Boolean to determine if we are showing freelancer view or client view (names display)
  isLoading
}) => {
  return (
    <Box
      sx={{
        boxShadow: { sm: "0px 0px 4px 1px #00000040", xs: "0" },
        borderRadius: { lg: "16px 0 0 16px", sm: "16px", xs: "0" },
        flex: 1,
        position: { lg: "relative", xs: "absolute" },
        backgroundColor: "#ffffff",
        width: { xs: "100%", lg: "auto" },
      }}
    >
      <Box
        sx={{
          padding: "24px 20px 12px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "600",
            fontSize: "28px",
            marginRight: "auto",
          }}
        >
          Messaging
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ padding: "24px 20px 12px" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 4px 0.5px #00000040",
            borderRadius: "16px",
            padding: "1px 15px 1px 15px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
          }}
        >
          <CiSearch style={{ fontSize: "20px" }} />
          <InputBase
            sx={{ ml: 1.4, flex: 1 }}
            placeholder="Search Message"
            style={{ color: "#000000" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="filter">
            {/* <CiFilter /> */}
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ overflowY: "auto", height: "auto" }}>
        {isLoading ? (
          <Box sx={{ padding: "40px", textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredChats !== null && filteredChats?.length !== 0 ? (
          filteredChats?.map((chatStr, indx) => {
            const chat = typeof chatStr === 'string' ? JSON.parse(chatStr) : chatStr;
            const firstName = chat.first_name && chat.first_name !== "undefined" ? chat.first_name : "User";
            const lastName = chat.last_name && chat.last_name !== "undefined" && chat.last_name !== "Account" ? chat.last_name : "";
            const displayName = `${firstName} ${lastName}`.trim();
            const profileName = displayName;

            const location = chat.location;

            return (
              <React.Fragment key={indx}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "22px 20px 13px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "40px",
                    cursor: "pointer",
                    backgroundColor: selectedChatId === chat.id ? '#f5f5f5' : 'transparent'
                  }}
                  onClick={() => handleChatSelect(chat, chat.job_title)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Avatar
                      sx={{
                        textTransform: "uppercase",
                        width: "50px",
                        height: "50px",
                      }}
                    >
                      {profileName
                        ?.split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          color: "#353535",
                          fontWeight: "500",
                          fontSize: "18px",
                        }}
                      >
                        {profileName}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#353535",
                          fontWeight: "400",
                          fontSize: "12px",
                        }}
                      >
                        {/* Company or other info */}
                        {chat.company && <span style={{ fontWeight: "bold" }}>{chat.company}</span>}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#353535",
                          fontWeight: "400",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>Job Profile : </span>
                        {chat.job_title}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ minWidth: "50px" }}>
                    <Typography sx={{ color: "#74767E", fontSize: "13px" }}>
                      {handleConvertDate(chat?.created_at)}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
              </React.Fragment>
            )
          })
        ) : (
          <Box sx={{ padding: "22px 20px 13px", textAlign: "center" }}>
            No chats available
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatSidebar;
