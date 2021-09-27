import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
  DialogActions,
  Link,
} from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Register = () => {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const history = useHistory();

  const handleClose = (_, reason) => {
    if (reason === "backdropClick") {
      setOpen(false);
    }
  };

  const handleFormChange = (event) => {
    setForm((form) => ({
      ...form,
      [event.target.id]: event.target.value,
    }));
  };

  const register = () => {
    axios({
      url: "http://localhost:8172/register",
      withCredentials: true,
      method: "POST",
      data: form,
    })
      .then((response) => {
        setOpen(false);
        history.push("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Typography variant="h4" sx={{ ml: 3, mt: 3 }}>
          Register
        </Typography>
        <DialogContent sx={{ mt: 0, mb: 0, maxWidth: "450px" }}>
          <DialogContentText>
            Fill out this form to have access to our chatting platform.
          </DialogContentText>
          <TextField
            autoFocus
            id="username"
            label="Username"
            type="text"
            onChange={handleFormChange}
            value={form.username}
            fullWidth
            variant="standard"
          />
          <TextField
            id="email"
            label="Email Address"
            type="email"
            onChange={handleFormChange}
            value={form.email}
            fullWidth
            variant="standard"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            onChange={handleFormChange}
            value={form.password}
            fullWidth
            variant="standard"
          />
          <Link underline="hover" href="/login">
            Already have an account? Press here to login.
          </Link>
        </DialogContent>
        <DialogActions sx={{ mt: 0, mb: 0 }}>
          <Button sx={{ mt: 0, mb: 0 }} onClick={register}>
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Register;
