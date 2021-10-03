import React, { useEffect, useState } from "react";
import {
  Dialog,
  Button,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
  Link,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errorMessage, setErrorMessage] = useState();
  const history = useHistory();

  useEffect(() => {
    if (Cookies.get("access_token")) history.push("/home");
  }, [history]);

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

  const login = () => {
    axios({
      url: "http://localhost:8172/login",
      withCredentials: true,
      method: "POST",
      data: form,
    })
      .then((_) => {
        setOpen(false);
        history.push("/home");
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 401)
          setErrorMessage("The password you've provided is invalid.");
        if (status === 404)
          setErrorMessage("The e-mail/username provided does not exists.");
      });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Typography variant="h4" sx={{ ml: 3, mt: 3 }}>
          Login
        </Typography>
        <DialogContent sx={{ mt: 0, mb: 0, maxWidth: "450px" }}>
          <DialogContentText>
            Enter your e-mail/username and password to login
          </DialogContentText>
          <Typography variant="subtitle1" color="red">
            {errorMessage}
          </Typography>
          <TextField
            autoFocus
            id="identifier"
            label="Username or e-mail"
            type="text"
            onChange={handleFormChange}
            value={form.identifier}
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
          <Link href="/register" underline="hover" fontStyle="italic">
            New here? Click here to register
          </Link>
        </DialogContent>
        <DialogActions sx={{ mt: 0, mb: 0 }}>
          <Button sx={{ mt: 0, mb: 0 }} onClick={login}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
