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
  onAcceptDeliverableCount,
  onRejectDeliverableCount,
  onAcceptPartsList,
  onRejectPartsList,
  onCancel,
  handleConvertDate,
  showDate,
  canProposeProjectParts = false,
}) => {
  const isFinalizedSystemStatus = [
    "NEGOTIATION_ACCEPTED",
    "NEGOTIATION_REJECTED",
    "NO_OF_DELIVERABLES_ACCEPTED",
    "NO_OF_DELIVERABLES_REJECTED",
    "PROJECT_PART_DETAIL_ACCEPTED",
    "PROJECT_PART_DETAIL_REJECTED",
    "DELIVERABLE_IMAGE_ACCEPTED",
    "DELIVERABLE_IMAGE_REJECTED"
  ].includes(message.status);

  const renderSystemStatus = () => {
    if (!isFinalizedSystemStatus) return null;

    let text = "";
    let bgColor = "#f6ffed";
    let borderColor = "#b7eb8f";
    let textColor = "#389e0d";

    if (message.status === "NEGOTIATION_ACCEPTED") {
      // isSender = Proposer (Freelancer usually)
      // !isSender = Accepter (Client usually)
      text = isSender ? "Client accepted your bid" : "You accepted the bid";

      // Only show the setup guidance for the client (the accepter)
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "10px", margin: "10px 0" }}>
          <Box sx={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: "20px", padding: "6px 20px" }}>
            <Typography sx={{ color: textColor, fontWeight: "700", fontSize: { md: "14px", xs: "12px" } }}>
              {text}
            </Typography>
          </Box>
          {canProposeProjectParts && !isSender && (
            <Box sx={{ backgroundColor: "#fff7e6", border: "1px solid #ffe7ba", borderRadius: "10px", padding: "8px 15px", textAlign: "center", maxWidth: "80%" }}>
              <Typography sx={{ color: "#d46b08", fontSize: "13px", fontWeight: "600" }}>
                Next Step: Please use the (+) icon in the input bar to set the number of project parts.
              </Typography>
            </Box>
          )}
        </Box>
      );
    } else if (message.status === "NEGOTIATION_REJECTED") {
      text = isSender ? "Client rejected your bid" : "You rejected the bid";
      bgColor = "#fff1f0"; borderColor = "#ffa39e"; textColor = "#cf1322";
    } else if (message.status === "NO_OF_DELIVERABLES_ACCEPTED") {
      text = isSender ? "Other party accepted project parts" : "You accepted project parts";
    } else if (message.status === "NO_OF_DELIVERABLES_REJECTED") {
      text = isSender ? "Other party rejected project parts" : "You rejected project parts";
      bgColor = "#fff1f0"; borderColor = "#ffa39e"; textColor = "#cf1322";
    } else if (message.status === "PROJECT_PART_DETAIL_ACCEPTED") {
      text = isSender ? "Other party accepted the part detail" : "You accepted the part detail";
    } else if (message.status === "PROJECT_PART_DETAIL_REJECTED") {
      text = isSender ? "Other party rejected the part detail" : "You rejected the part detail";
      bgColor = "#fff1f0"; borderColor = "#ffa39e"; textColor = "#cf1322";
    } else if (message.status === "DELIVERABLE_IMAGE_ACCEPTED") {
      text = isSender ? "Employer accepted your submission" : "You accepted the submission";
    } else if (message.status === "DELIVERABLE_IMAGE_REJECTED") {
      text = isSender ? "Employer rejected your submission" : "You rejected the submission";
      bgColor = "#fff1f0"; borderColor = "#ffa39e"; textColor = "#cf1322";
    }

    return (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", margin: "10px 0" }}>
        <Box sx={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: "20px", padding: "6px 20px" }}>
          <Typography sx={{ color: textColor, fontWeight: "700", fontSize: { md: "14px", xs: "12px" } }}>
            {text}
          </Typography>
        </Box>
      </Box>
    );
  };

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
          width: "100%",
          justifyContent: isSender ? "flex-end" : "flex-start"
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

        <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "70%" }}>
          {/* Message Content Logic */}
          {(message.status === "DELIVERABLE_IMAGE" ||
            message.status === "DELIVERABLE_IMAGE_ACCEPTED" ||
            message.status === "DELIVERABLE_IMAGE_REJECTED") && (
              <Box
                sx={{
                  display: "flex",
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
                {message.deadline && (
                  <Typography variant="caption" sx={{ color: "#888", textAlign: "center", mt: 0.5, fontStyle: "italic" }}>
                    Topic: {message.deadline}
                  </Typography>
                )}

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
                            sx={{ backgroundColor: "#4caf50", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#45a049" } }}
                          >Accept</Button>
                        }
                        {onRejectDeliverable &&
                          <Button
                            onClick={() => onRejectDeliverable(message.id)}
                            sx={{ backgroundColor: "#f44336", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#d32f2f" } }}
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

          {(message.status === "NEGOTIATION_PENDING" ||
            message.status === "NEGOTIATION_ACCEPTED" ||
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
                    color: (message.status === "NEGOTIATION_REJECTED") ? "#000000" : "#ffffff",
                    padding: "10px 15px 10px 15px",
                    minWidth: "130px",
                    backgroundColor: (message.status === "NEGOTIATION_REJECTED") ? "#EAEAEA" : "#ED8335",
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

                {message.status === "NEGOTIATION_PENDING" && (
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
                          sx={{ backgroundColor: "#4caf50", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#45a049" } }}
                        >Accept</Button>
                      }
                      {onNegotiatePrice &&
                        <Button
                          onClick={() => onNegotiatePrice(message.id)}
                          sx={{ backgroundColor: "#f44336", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#d32f2f" } }}
                        >Reject</Button>
                      }
                    </Box>
                  )
                )}
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

          {message.status === "NORMAL" && (
            <Box className={isSender ? "text-message-send" : "text-message-receive"}>
              <Typography>{message.message}</Typography>
            </Box>
          )}

          {(message.status === "NO_OF_DELIVERABLES" ||
            message.status === "NO_OF_DELIVERABLES_ACCEPTED" ||
            message.status === "NO_OF_DELIVERABLES_REJECTED") && (
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
                    color: (message.status === "NO_OF_DELIVERABLES_REJECTED") ? "#000000" : "#ffffff",
                    padding: "10px 15px 10px 15px",
                    minWidth: { md: "150px" },
                    backgroundColor: (message.status === "NO_OF_DELIVERABLES_REJECTED") ? "#EAEAEA" : "#ED8335",
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
                    Project Parts
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
                    {message.message} Deliverable(s)
                  </Typography>
                </Box>

                {message.status === "NO_OF_DELIVERABLES" && (
                  !isSender ? (
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
                        onClick={() => onAcceptDeliverableCount(message.id)}
                        sx={{ backgroundColor: "#4caf50", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#45a049" }, padding: "5px 15px" }}
                      >Accept</Button>
                      <Button
                        onClick={() => onRejectDeliverableCount(message.id)}
                        sx={{ backgroundColor: "#f44336", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#d32f2f" }, padding: "5px 15px" }}
                      >Reject</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                      <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", width: "100%" }}>
                        <Button
                          sx={{
                            backgroundColor: "#B27EE3",
                            color: "#fff",
                            padding: "5px 15px",
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
                            padding: "5px 15px",
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
                      <Typography sx={{ fontSize: "12px", color: "#888", textAlign: "center" }}>
                        Waiting for confirmation...
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            )}

          {(message.status === "PROJECT_PART_DETAIL" ||
            message.status === "PROJECT_PART_DETAIL_ACCEPTED" ||
            message.status === "PROJECT_PART_DETAIL_REJECTED") && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "10px",
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: (message.status === "PROJECT_PART_DETAIL_REJECTED") ? "#f5f5f5" : "#f9f0ff",
                    border: `1px solid ${(message.status === "PROJECT_PART_DETAIL_REJECTED") ? "#d9d9d9" : "#d3adf7"}`,
                    borderRadius: "16px",
                    padding: "15px",
                    minWidth: "200px"
                  }}
                >
                  <Typography sx={{ fontSize: "15px", fontWeight: "700", color: "#722ed1", mb: 0.5 }}>
                      Proposed Part: {message.message}
                    </Typography>
                  {message.deadline && (
                    <Typography sx={{ fontSize: "12px", color: "#666", display: "flex", alignItems: "center" }}>
                      Deadline: {message.deadline}
                    </Typography>
                  )}
                </Box>

                {message.status === "PROJECT_PART_DETAIL" && (
                  !isSender ? (
                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <Button
                        onClick={() => onAcceptPartsList(message.id)}
                        sx={{ backgroundColor: "#4caf50", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#45a049" }, px: 3, textTransform: "none" }}
                      >Accept</Button>
                      <Button
                        onClick={() => onRejectPartsList(message.id)}
                        sx={{ backgroundColor: "#f44336", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#d32f2f" }, px: 3, textTransform: "none" }}
                      >Reject</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", width: "100%" }}>
                        <Button
                          onClick={() => onCancel(message.id)}
                          sx={{ backgroundColor: "#B27EE3", color: "#fff", borderRadius: "16px", "&:hover": { backgroundColor: "#B27EE3" }, px: 3, py: 0.5, fontSize: "14px", textTransform: "none" }}
                        >Cancel</Button>
                        <Button
                          onClick={() => onEdit(message)}
                          sx={{ backgroundColor: "#fff", color: "#B27EE3", border: "1px solid #B27EE3", borderRadius: "16px", "&:hover": { backgroundColor: "#fff" }, px: 3, py: 0.5, fontSize: "14px", textTransform: "none" }}
                        >Edit</Button>
                      </Box>
                      <Typography sx={{ fontSize: "12px", color: "#888", textAlign: "center" }}>
                        Waiting for approval...
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            )}
        </Box>

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
      {renderSystemStatus()}
    </>
  );
};

export default MessageBubble;
