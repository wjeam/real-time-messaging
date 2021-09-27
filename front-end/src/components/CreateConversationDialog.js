import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  Typography,
  Button,
  DialogActions,
  DialogContentText,
  TextField,
  DialogContent,
} from "@mui/material";

const CreateConversationDialog = ({
  userId,
  open,
  close,
  onAddNewConversation,
}) => {
  const [form, setForm] = useState({ title: "" });
  const handleFormChange = (event) => {
    setForm((form) => ({
      ...form,
      [event.target.id || event.target.name]: event.target.value,
    }));
  };

  const handleClose = (_, reason) => {
    if (reason === "backdropClick") close();
  };

  const createConversation = async () => {
    await axios({
      method: "POST",
      url: "http://localhost:8172/conversation",
      data: { title: form.title, users: [userId] },
    })
      .then((response) => {
        onAddNewConversation(response.data);
        close();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Typography variant="h4" sx={{ ml: 3, mt: 3 }}>
          Create new conversation
        </Typography>
        <DialogContent sx={{ mt: 0, mb: 0, minWidth: "380px" }}>
          <DialogContentText>
            Enter the title of the conversation
          </DialogContentText>
          <TextField
            autoFocus
            id="title"
            onChange={handleFormChange}
            label=""
            value={form.title}
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions sx={{ mt: 0, mb: 0 }}>
          <Button
            sx={{ mt: 0, mb: 0 }}
            onClick={() => {
              createConversation();
              close();
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateConversationDialog;
