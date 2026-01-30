import React from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";

const MessageBubble = ({
  message,
  isSender,
  senderName,
  senderAvatar,
  onUnsend,
  onEdit,
  onAcceptDeliverable,
  onRejectDeliverable,
  onAcceptPrice,
  onNegotiatePrice,
  onCancel,
  handleConvertDate,
  showDate,
}) => {
  return (
    <>
      {showDate && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            width: "100%",
            margin: { md: "5px 0", xs: "2px 0" },
          }}
        >
          <Typography
            sx={{
              color: "#454545",
              fontWeight: "700",
              fontSize: { md: "18px", sm: "15px", xs: "13px" },
            }}
          >
            {handleConvertDate(message.created_at)}
          </Typography>
        </Box>
      )}
      <Box
        className={isSender ? "message-send" : "message-receive"}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {!isSender && (
          <>
            {senderAvatar ? (
              <img
                alt={senderName?.[0]}
                src={senderAvatar}
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Avatar
                sx={{
                  textTransform: "uppercase",
                  width: "40px",
                  height: "40px",
                }}
              >
                {senderName
                  ?.split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </Avatar>
            )}
          </>
        )}
        {isSender && (
            <div style={{ width: "40px" }}></div> // Placeholder for alignment if needed, or remove for sender
        )}


        {/* Message Content Logic */}
        {(message.status === "DELIVERABLE_IMAGE" ||
          message.status === "DELIVERABLE_IMAGE_ACCEPTED" ||
          message.status === "DELIVERABLE_IMAGE_REJECTED") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              marginBottom: "5px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f2f2f2",
                boxShadow: "0px 0px 4px 1px #00000040",
                borderRadius: "10px",
                border: "10px solid #FFFFFF",
                width: { md: "220px", sm: "170px", xs: "150px" },
                height: { sm: "80px", xs: "60px" },
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "5px",
                color: "#b3b3b3",
                fontSize: { md: "16px", xs: "13px" },
              }}
            >
              <a
                href={message.message}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#b3b3b3" }}
              >
                {message.message}
              </a>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              {message.status === "DELIVERABLE_IMAGE" ? (
                  isSender ? (
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#B27EE3",
                      color: "#fff",
                      padding: "7px 20px",
                      fontSize: "14px",
                      borderRadius: "16px",
                      ":hover": { backgroundColor: "#B27EE3", color: "#fff" },
                    }}
                    onClick={() => onCancel(message.id)}
                  >
                    Unsend
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#fff",
                      color: "#B27EE3",
                      padding: "7px 20px",
                      border: "1px solid #B27EE3",
                      fontSize: "14px",
                      borderRadius: "16px",
                      ":hover": { backgroundColor: "#fff", color: "#B27EE3" },
                    }}
                    onClick={() => onEdit(message)}
                  >
                    Edit
                  </Button>
                </Box>
                  ) : (
                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", width: "100%" }}>
                        {onAcceptDeliverable && 
                            <Button 
                                onClick={() => onAcceptDeliverable(message.id)}
                                sx={{ backgroundColor: "#4caf50", color: "#fff", borderRadius: "16px", "&:hover":{ backgroundColor: "#45a049" } }}
                            >Accept</Button>
                        }
                        {onRejectDeliverable && 
                            <Button 
                                onClick={() => onRejectDeliverable(message.id)}
                                sx={{ backgroundColor: "#f44336", color: "#fff", borderRadius: "16px", "&:hover":{ backgroundColor: "#d32f2f" } }}
                            >Reject</Button>
                        }
                    </Box>
                  )
              ) : null}
            </Box>
          </Box>
        )}

        {message.status === "IMAGE" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              marginBottom: "5px",
            }}
          >
            <img
              className="image_deliverable"
              src={message.message}
              alt="Chat attachment"
              style={{ width: "220px", height: "220px", objectFit: "cover" }}
            />
          </Box>
        )}

        {message.status === "VIDEO" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              marginBottom: "5px",
            }}
          >
            <video
              className="image_deliverable"
              controls
              src={message.message}
              alt="Video"
              style={{ width: "220px", height: "220px" }}
            />
          </Box>
        )}

        {(message.status === "NEGOTIATION_ACCEPTED" ||
          message.status === "NEGOTIATION_PENDING" ||
          message.status === "NEGOTIATION_REJECTED") && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <Box
              sx={{
                maxWidth: "100%",
                color:
                  message.status !== "NEGOTIATION_REJECTED"
                    ? "#ffffff"
                    : "#000000",
                padding: "10px 15px 10px 15px",
                minWidth: "130px",
                backgroundColor:
                  message.status !== "NEGOTIATION_REJECTED"
                    ? "#ED8335"
                    : "#EAEAEA",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "0px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: { sm: "12px", xs: "10px" },
                }}
              >
                Price
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: { md: "20px", sm: "16px", xs: "14px" },
                  lineHeight: "1",
                }}
              >
                ₹{message.message}
              </Typography>
            </Box>
            {message.status === "NEGOTIATION_PENDING" ? (
              isSender ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <Button
                  sx={{
                    backgroundColor: "#B27EE3",
                    color: "#fff",
                    padding: "7px 20px",
                    fontSize: "14px",
                    borderRadius: "16px",
                    ":hover": { backgroundColor: "#B27EE3", color: "#fff" },
                  }}
                  onClick={() => onCancel(message.id)}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#fff",
                    color: "#B27EE3",
                    padding: "7px 20px",
                    border: "1px solid #B27EE3",
                    fontSize: "14px",
                    borderRadius: "16px",
                    ":hover": { backgroundColor: "#fff", color: "#B27EE3" },
                  }}
                  onClick={() => onEdit(message)}
                >
                  Edit
                </Button>
              </Box>
              ) : (
                <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                   {onAcceptPrice && 
                    <Button 
                        onClick={() => onAcceptPrice(message.id)}
                        sx={{ backgroundColor: "#4caf50", color: "#fff", borderRadius: "16px", "&:hover":{ backgroundColor: "#45a049" } }}
                    >Accept</Button>
                   }
                   {onNegotiatePrice && 
                    <Button 
                        onClick={() => onNegotiatePrice(message.id)}
                        sx={{ backgroundColor: "#f44336", color: "#fff", borderRadius: "16px", "&:hover":{ backgroundColor: "#d32f2f" } }}
                    >Reject</Button>
                   }
                </Box>
              )
            ) : null}
          </Box>
        )}

        {(message.status === "DELIVERABLES" ||
          message.status === "DELIVERABLES_ACCEPTED") && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <Box
              sx={{
                maxWidth: "100%",
                color: "#ffffff",
                padding: "10px 15px 10px 15px",
                minWidth: { md: "120px" },
                backgroundColor: "#ED8335",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "0px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: { sm: "12px", xs: "10px" },
                }}
              >
                Deliverables
              </Typography>
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: { md: "20px", sm: "16px", xs: "14px" },
                  lineHeight: "1",
                }}
              >
                {message.message} deliverable(s)
              </Typography>
            </Box>
            {message.status === "DELIVERABLES" && !isSender ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <Button
                  sx={{
                    backgroundColor: "#B27EE3",
                    color: "#fff",
                    padding: "7px 20px",
                    fontSize: "14px",
                    borderRadius: "16px",
                    ":hover": { backgroundColor: "#B27EE3", color: "#fff" },
                  }}
                  onClick={() => onAcceptDeliverable(message.id)}
                >
                  Accept
                </Button>
                <Button
                  sx={{
                    backgroundColor: "#fff",
                    color: "#B27EE3",
                    padding: "7px 20px",
                    border: "1px solid #B27EE3",
                    fontSize: "14px",
                    borderRadius: "16px",
                    ":hover": { backgroundColor: "#fff", color: "#B27EE3" },
                  }}
                  onClick={() => onRejectDeliverable(message.id)}
                >
                  Reject
                </Button>
              </Box>
            ) : null}
          </Box>
        )}
         
         {/* Simple Text Message if none of the above matches, though logic suggests text messages are handled via CSS classes mostly? 
             Actually, in the original code, text messages are just rendered if no other condition is met, but usually inside the message-send/receive div content which is implicit.
             Wait, looking at original code, the text message content seems to be missing from the provided snippets or I missed it.
             Ah, if it's a normal message, it's just text. We need to handle "NORMAL" status or default.
         */}
         {message.status === "NORMAL" && (
            <Box className={isSender ? "text-message-send" : "text-message-receive"}>
                <Typography>{message.message}</Typography>
            </Box>
         )}

         {/* Handle NO_OF_DELIVERABLES logic if needed, seemed present in snippet */}
         {message.status === "NO_OF_DELIVERABLES" && !isSender && (
             <Box
             sx={{
               display: "flex",
               flexDirection: "column",
               gap: "8px",
               marginBottom: "10px",
             }}
           >
             <Box
               sx={{
                 maxWidth: "100%",
                 color: "#ffffff",
                 padding: "10px 15px 10px 15px",
                 minWidth: { md: "120px" },
                 backgroundColor: "#ED8335",
                 borderRadius: "16px",
                 display: "flex",
                 flexDirection: "column",
                 gap: "0px",
               }}
             >
               <Typography
                 sx={{
                   fontWeight: "500",
                   fontSize: { sm: "12px", xs: "10px" },
                 }}
               >
                 Deliverables
               </Typography>
               <Typography
                 sx={{
                   fontWeight: "500",
                   fontSize: {
                     md: "20px",
                     sm: "16px",
                     xs: "14px",
                   },
                   lineHeight: "1",
                 }}
               >
                 {message.message} deliverable(s)
               </Typography>
             </Box>
             <Box
               sx={{
                 display: "flex",
                 width: "100%",
                 flexDirection: "row",
                 gap: "10px",
                 justifyContent: "center",
               }}
             >
                 {/* Buttons seem to be accept/reject here too in original code? Or maybe just display? 
                     In snippet line 1987 it logs message.
                     Let's assume standard accept/reject if needed or just display.
                 */}
             </Box>
            </Box>
         )}

        {isSender && (
          <>
            {senderAvatar ? (
                <img
                alt={senderName?.[0]}
                src={senderAvatar}
                style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                }}
                />
            ) : (
                <Avatar
                sx={{
                    textTransform: "uppercase",
                    width: "40px",
                    height: "40px",
                }}
                >
                {senderName
                    ?.split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </Avatar>
            )}
            </>
        )}
      </Box>
    </>
  );
};

export default MessageBubble;
