import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  DialogActions,
  Slide,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import axios from "axios";

const ConversationContextDialog = ({
  open,
  close,
  container,
  changeConversationTitle,
  conversation_id,
}) => {
  const [form, setForm] = useState({ title: "" });

  const handleClose = (_, reason) => {
    if (reason === "backdropClick") close();
  };

  const handleFormChange = (event) => {
    setForm((form) => ({
      ...form,
      [event.target.id || event.target.name]: event.target.value,
    }));
  };

  const updateTitle = () => {
    axios({
      method: "POST",
      data: {
        title: form.title,
        conversation_id: conversation_id,
      },
      url: "http://localhost:8172/conversation/update",
    })
      .then((response) => {
        changeConversationTitle(response.data, conversation_id);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Slide direction="up" in={open} container={container}>
        <Dialog
          open={true}
          onClose={handleClose}
          hideBackdrop
          sx={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        >
          <DialogTitle variant="h5" sx={{ mt: 3, ml: 0, pl: 2, pt: 0, pb: 0 }}>
            {"Change conversation title to:"}
            <Divider sx={{ mt: 2 }} />
          </DialogTitle>
          <DialogContent sx={{ mt: 0, mb: 0, pb: 0 }}>
            <TextField
              id="title"
              label="Title"
              type="text"
              onChange={handleFormChange}
              value={form.title}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions sx={{ mt: 0, mb: 0, ml: 0 }}>
            <Button sx={{ mt: 0, mb: 0 }} onClick={updateTitle}>
              YES
            </Button>
            <Button sx={{ mt: 0, mb: 0 }} onClick={close}>
              NO
            </Button>
          </DialogActions>
        </Dialog>
      </Slide>
    </>
  );
};
export default ConversationContextDialog;
