import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Select,
  MenuItem,
  Button,
  DialogActions,
  Typography,
} from "@mui/material";

const AddUserToConversationDialog = ({
  conversations,
  open,
  close,
  onAddUserToConversation,
}) => {
  const [form, setForm] = useState({
    identifier: "",
    conversation_id: "",
  });

  const handleFormChange = (event) => {
    setForm((form) => ({
      ...form,
      [event.target.id || event.target.name]: event.target.value,
    }));
  };

  const handleClose = (_, reason) => {
    if (reason === "backdropClick") close();
  };

  const addUserToConversation = async () => {
    await axios({
      method: "POST",
      url: "http://localhost:8172/conversation/user",
      data: {
        conversation_id: form.conversation_id,
        identifier: form.identifier,
      },
    })
      .then((response) => {
        const user_id = response.data;
        close();
        onAddUserToConversation(user_id, form.conversation_id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Typography variant="h4" sx={{ ml: 3, mr: 2, mt: 3 }}>
          Add another user to the conversation
        </Typography>
        <DialogContent sx={{ mt: 0, mb: 0, minWidth: "480px", pb: 0 }}>
          <DialogContentText>User email or username</DialogContentText>
          <TextField
            autoFocus
            id="identifier"
            onChange={handleFormChange}
            label=""
            value={form.identifier}
            type="text"
            fullWidth
            variant="standard"
          />
          <Select
            label="Conversation"
            variant="standard"
            name="conversation_id"
            value={form.conversation_id}
            onChange={handleFormChange}
            fullWidth
            sx={{
              mb: 0,
              mt: 2,
              textAlign: "center",
              minWidth: "200px",
            }}
          >
            {conversations.current.map((conversation, index) => {
              return (
                <MenuItem key={index} value={conversation._id}>
                  {conversation.title}
                </MenuItem>
              );
            })}
          </Select>
        </DialogContent>
        <DialogActions sx={{ mt: 0, mb: 0 }}>
          <Button
            sx={{ mt: 0, mb: 0 }}
            onClick={() => {
              addUserToConversation();
              close();
            }}
          >
            ADD
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddUserToConversationDialog;
