import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { MdAddPhotoAlternate, MdOutlineSlowMotionVideo } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
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
  showCalendar
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

        <Box sx={{ position: "relative" }} ref={container3Ref}>
          <BsCurrencyDollar
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={handleOpenPrice}
          />
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

        <Box sx={{ position: "relative" }} ref={container2Ref}>
          {showCalendar && (
            <i
                className="fa-regular fa-calendar"
                onClick={handleOpenDeliverable}
                style={{ cursor: "pointer" }}
            ></i>
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
        </Box>
      </div>
      <div className="chat_Profile_send_div">
        <Button
          onClick={sendMessage}
          style={{ cursor: "pointer" }}
          disabled={chatCompleted}
        >
          Send
        </Button>
        <div className="" style={{ marginRight: "20px" }}>
          {/* <i class="fa-solid fa-ellipsis" style={{ fontSize: '25px' }}></i> */}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
