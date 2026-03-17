import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { MdAddPhotoAlternate, MdOutlineSlowMotionVideo } from "react-icons/md";
import { BsCurrencyDollar, BsPlusLg, BsListUl } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";

const ChatInput = ({
  open,
  setOpen,
  chatCompleted,
  handleFileChange,
  handleOpenPrice,
  priceInputOpen,
  handleClosePriceInput,
  priceValue,
  setPriceValue,
  editMode,
  handleSendPrice,
  handleEditedSendPrice,
  deliverableInputOpen,
  handleOpenDeliverable,
  handleCloseDeliverableInput,
  deliverableValue,
  setDeliverableValue,
  handleSendDeliverable,
  handleSendEditedDeliverable,
  sendMessage,
  fileInputRef,
  videoInputRef,
  container1Ref,
  container2Ref,
  container3Ref,
  showCalendar,
  showPriceIcon = true,
  priceIconDisabled = false,
  showDeliverableCountIcon = false,
  deliverableCountInputOpen = false,
  handleOpenDeliverableCount = () => { },
  handleCloseDeliverableCount = () => { },
  deliverableCountValue = "",
  setDeliverableCountValue = () => { },
  handleSendDeliverableCount = () => { },
  handleSendEditedDeliverableCount = () => { },
  projectPartsInputOpen = false,
  handleOpenProjectParts = () => { },
  handleCloseProjectParts = () => { },
  projectPartTitle = "",
  setProjectPartTitle = () => { },
  projectPartDate = "",
  setProjectPartDate = () => { },
  handleSendProjectPart = () => { },
  totalDeliverables = 0,
  currentPartNumber = 1,
  showProjectPartsIcon = false
}) => {
  return (
    <div className="chat_Profile_send">
      <div className="chat_Profile_send1">
        <Box sx={{ position: "relative" }} ref={container1Ref}>
          <i
            className="fa-solid fa-paperclip"
            onClick={() => setOpen(!open)}
            style={{ cursor: "pointer" }}
          ></i>
          <Box
            sx={{
              position: "absolute",
              display: open ? "flex" : "none",
              top: "-70px",
              left: "-20px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 0px 4px 1px #00000040",
              borderRadius: "16px",
              padding: "10px",
              gap: "10px"
            }}
          >
            <Button component="label" htmlFor="ImageInput">
              <MdAddPhotoAlternate
                style={{ fontSize: "20px", color: "#B27EE3" }}
              />
            </Button>
            <input
              id="ImageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={chatCompleted}
              ref={fileInputRef}
            />
            <Button component="label" htmlFor="videoInput">
              <MdOutlineSlowMotionVideo
                style={{ fontSize: "20px", color: "#B27EE3" }}
              />
            </Button>
            <input
              id="videoInput"
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={chatCompleted}
              ref={videoInputRef}
            />
          </Box>
        </Box>

        {showPriceIcon && (
          <Box sx={{ position: "relative" }} ref={container3Ref}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: priceIconDisabled ? "not-allowed" : "pointer",
                opacity: priceIconDisabled ? 0.5 : 1
              }}
              onClick={priceIconDisabled ? null : handleOpenPrice}
            >
              <BsCurrencyDollar style={{ fontSize: "20px" }} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                display: priceInputOpen ? "flex" : "none",
                top: "-100px",
                left: "-20px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 0px 4px 1px #00000040",
                borderRadius: "16px",
                padding: "15px",
                flexDirection: "column",
                gap: "10px",
                zIndex: 10
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Enter Price :</Typography>
                <RxCrossCircled
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={handleClosePriceInput}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  autoFocus
                  type="text"
                  value={priceValue}
                  placeholder="Price"
                  onChange={(e) => setPriceValue(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    boxShadow: "0px 0px 4px 1px #00000040",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    width: "120px",
                  }}
                />
                <IoSend
                  style={{
                    fontSize: "20px",
                    cursor: chatCompleted ? "not-allowed" : "pointer",
                    color: "#B27EE3",
                  }}
                  onClick={
                    chatCompleted
                      ? null
                      : editMode
                        ? handleEditedSendPrice
                        : handleSendPrice
                  }
                />
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ position: "relative" }} ref={container2Ref}>
          {showCalendar && (
            <i
              className="fa-regular fa-calendar"
              onClick={handleOpenDeliverable}
              style={{ cursor: "pointer" }}
            ></i>
          )}

          {showDeliverableCountIcon && (
            <BsPlusLg
              onClick={handleOpenDeliverableCount}
              style={{ cursor: "pointer", marginLeft: "10px", color: "#888", fontSize: "18px" }}
              title="Set Project Parts"
            />
          )}

          {showProjectPartsIcon && (
            <BsListUl
              onClick={handleOpenProjectParts}
              style={{ cursor: "pointer", marginLeft: "10px", color: "#B27EE3", fontSize: "20px" }}
              title="Define Project Part"
            />
          )}

          <Box
            sx={{
              position: "absolute",
              display: deliverableInputOpen ? "flex" : "none",
              top: "-138px",
              left: "-20px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 0px 4px 1px #00000040",
              borderRadius: "16px",
              padding: "15px",
              flexDirection: "column",
              gap: "10px",
              zIndex: 10
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Typography> Post a Milestone :</Typography>
              <RxCrossCircled
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={handleCloseDeliverableInput}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                placeholder="Link here"
                autoFocus
                type="text"
                value={deliverableValue}
                onChange={(e) => setDeliverableValue(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "0px 0px 4px 1px #00000040",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  width: "200px",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "#B27EE3",
                  cursor: chatCompleted ? "not-allowed" : "pointer",
                  width: "100%",
                  borderRadius: "8px",
                  textAlign: "center",
                  padding: "2px 0",
                }}
                onClick={
                  chatCompleted
                    ? null
                    : editMode
                      ? handleSendEditedDeliverable
                      : handleSendDeliverable
                }
              >
                <IoSend style={{ fontSize: "18px", color: "#fff" }} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              display: deliverableCountInputOpen ? "flex" : "none",
              top: "-138px",
              left: "-20px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 0px 4px 1px #00000040",
              borderRadius: "16px",
              padding: "15px",
              flexDirection: "column",
              gap: "10px",
              zIndex: 10,
              minWidth: "200px"
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Typography>Project Parts (Deliverables) :</Typography>
              <RxCrossCircled
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={handleCloseDeliverableCount}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                placeholder="Number of parts (e.g. 3)"
                autoFocus
                type="number"
                value={deliverableCountValue}
                onChange={(e) => setDeliverableCountValue(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "0px 0px 4px 1px #00000040",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  width: "100%",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "#ED8335",
                  cursor: chatCompleted ? "not-allowed" : "pointer",
                  width: "100%",
                  borderRadius: "8px",
                  textAlign: "center",
                  padding: "5px 0",
                }}
                onClick={
                  chatCompleted
                    ? null
                    : editMode
                      ? handleSendEditedDeliverableCount
                      : handleSendDeliverableCount
                }
              >
                <Typography sx={{ color: "#fff", fontWeight: "600" }}>
                  {editMode ? "Update Count" : "Propose Count"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              display: projectPartsInputOpen ? "flex" : "none",
              bottom: "calc(100% + 10px)",
              left: { xs: "50%", sm: "0" },
              transform: { xs: "translateX(-50%)", sm: "none" },
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
              borderRadius: "16px",
              padding: "20px",
              flexDirection: "column",
              gap: "10px",
              zIndex: 10,
              width: { xs: "90vw", sm: "320px" },
              maxWidth: "400px"
            }}
          >
            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", pb: 1 }}>
              <Typography sx={{ fontWeight: "700", color: "#333", fontSize: "16px" }}>Part {currentPartNumber} of {totalDeliverables}</Typography>
              <RxCrossCircled
                style={{ fontSize: "24px", cursor: "pointer", color: "#888" }}
                onClick={handleCloseProjectParts}
              />
            </Box>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px", mt: 1 }}>
              <Box sx={{ width: "100%" }}>
                <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5, fontWeight: "500" }}>Topic</Typography>
                <input
                  placeholder="e.g. Auth Module"
                  autoFocus
                  type="text"
                  value={projectPartTitle}
                  onChange={(e) => setProjectPartTitle(e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    outline: "none",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    width: "100%",
                    fontSize: "14px",
                    marginBottom: "12px"
                  }}
                />
                <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5, fontWeight: "500" }}>Deadline</Typography>
                <input
                  type="date"
                  value={projectPartDate}
                  onChange={(e) => setProjectPartDate(e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    outline: "none",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    width: "100%",
                    fontSize: "14px"
                  }}
                />
              </Box>

              <Box
                sx={{
                  backgroundColor: "#B27EE3",
                  cursor: chatCompleted ? "not-allowed" : "pointer",
                  width: "100%",
                  borderRadius: "12px",
                  textAlign: "center",
                  padding: "12px 0",
                  marginTop: "5px",
                  transition: "all 0.2s",
                  "&:hover": { opacity: 0.9, transform: "translateY(-1px)" }
                }}
                onClick={chatCompleted ? null : handleSendProjectPart}
              >
                <Typography sx={{ color: "#fff", fontWeight: "700", letterSpacing: "0.5px" }}>
                  Propose Part {currentPartNumber}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ChatInput;
