import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  Grid,
  Paper,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";
import useSound from "use-sound";
import moment from "moment";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import AddUserToConversationDialog from "./AddUserToConversationDialog";
import CreateConversationDialog from "./CreateConversationDialog";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import notificationSoundEffect from "../sounds/notification.mp3";
import ConversationContextDialog from "./ConversationContextDialog";

const Home = () => {
  const [socket, setSocket] = useState();
  const [message, setMessage] = useState("");
  const conversations = useRef([]);
  const [activeConversation, setActiveConversation] = useState(undefined);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [jwtPayload, setJwtPayload] = useState();
  const [dialogs, setDialogs] = useState({
    showAddUserToConversation: false,
    showCreateConversation: false,
    showConversationContextDialog: false,
  });
  const [play] = useSound(notificationSoundEffect);
  const containerRef = useRef(undefined);

  const history = useHistory();

  const bottom = useRef(null);

  const scrollToBottom = () => {
    bottom.current?.scrollIntoView({ behaviour: "smooth" });
  };

  useEffect(() => {
    const verifyToken = (jwtToken) => {
      axios({
        method: "GET",
        url: "http://localhost:8172/auth/verifyToken",
        withCredentials: true,
      })
        .then((isTokenValid) => {
          if (!isTokenValid.data) deleteCookieAndRedirect();
          else
            setJwtPayload(
              JSON.parse(Buffer.from(jwtToken.split(".")[1], "base64"))
            );
        })
        .catch((error) => console.error(error));
    };

    const jwtToken = Cookies.get("access_token");
    if (jwtToken === undefined) history.push("/login");
    else verifyToken(jwtToken);
  }, []);

  useEffect(() => {
    const fetchPayload = async () => {
      if (jwtPayload !== undefined) {
        await getConversations();
        connectSocketIO();
      }
    };
    fetchPayload();
  }, [jwtPayload]);

  useEffect(() => {
    scrollToBottom();
    play();
  }, [conversations.current, activeConversation]);

  const connectSocketIO = () => {
    setSocket(
      io("http://localhost:8172", {
        query: {
          user_id: jwtPayload._id,
        },
      })
        .on("message", onNewMessage)
        .on("add_conversation", onCreateConversation)
        .on("clear_conversation", onClearConversation)
        .on("change_title_conversation", onConversationTitleChange)
    );
  };

  const handleDialogs = (dialogName, state) => {
    setDialogs((dialogs) => ({ ...dialogs, [dialogName]: state }));
  };

  const onNewMessage = (message) => {
    conversations.current.forEach((conversation, index) => {
      if (conversation._id === message.conversation_id) {
        let tempConversations = conversations.current.slice();
        tempConversations[index].messages.push(message);
        conversations.current = tempConversations;
        forceUpdate();
      }
    });
  };

  const logout = () => {
    Cookies.remove("access_token");
    socket.emit("logout", { user_id: jwtPayload._id });
    history.push("/login");
  };

  const deleteCookieAndRedirect = () => {
    Cookies.remove("access_token");
    history.push("/login");
  };

  const sendMessage = () => {
    if (message.replace(/\s/g, "").length === 0) return;
    if (socket !== undefined && activeConversation) {
      socket.emit("message", {
        user_id: jwtPayload._id,
        content: message,
        conversation_id: conversations.current[activeConversation]._id,
      });
    }
    setMessage("");
  };

  const changeConversation = (event) => {
    const index = event.currentTarget.getAttribute("index");
    setActiveConversation(index);
  };

  const formatDate = (date) => {
    const formattedDate = moment(new Date(date)).format("YYYY/MM/DD @ HH:mm");
    return formattedDate;
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onClearConversation = (data) => {
    conversations.current.every((conversation, index) => {
      if (conversation._id === data.conversation_id) {
        conversations.current[index].messages = [];
        forceUpdate();
        return false;
      }
      return true;
    });
  };

  const onConversationTitleChange = (data) => {
    conversations.current.every((conversation) => {
      if (conversation._id === data.conversation_id) {
        conversation.title = data.title;
        return false;
      }
      return true;
    });
    forceUpdate();
  };

  const changeConversationTitle = (title, conversation_id) => {
    socket.emit("change_title_conversation", {
      conversation_id: conversation_id,
      title: title,
    });
  };

  const getConversations = () => {
    const fetchData = async () => {
      await axios({
        method: "GET",
        url: "http://localhost:8172/conversations/" + jwtPayload._id,
      })
        .then((response) => {
          conversations.current = response.data;
          forceUpdate();
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();
  };

  const onCreateConversation = (conversation) => {
    let tempConversations = conversations.current.slice();
    tempConversations.push(conversation);
    conversations.current = tempConversations;
    forceUpdate();
  };

  const onAddUserToConversation = (user_id, conversation_id, identifier) => {
    socket.emit("add_conversation", {
      user_id: user_id,
      conversation_id: conversation_id,
      identifier: identifier,
    });
  };

  const clearConversation = () => {
    const conversation_id = conversations.current[activeConversation]._id;
    axios({
      method: "POST",
      url: "http://localhost:8172/conversation/clear",
      data: { conversation_id: conversation_id },
    })
      .then(() => {
        socket.emit("clear_conversation", { conversation_id: conversation_id });
      })
      .catch((error) => console.error(error));
  };

  const quitConversation = () => {
    const conversation_id = conversations.current[activeConversation]._id;
    axios({
      method: "POST",
      url: "http://localhost:8172/conversation/leave",
      data: {
        user_id: jwtPayload._id,
        conversation_id: conversation_id,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setActiveConversation(undefined);
          getConversations();
          socket.emit("leave_conversation", {
            conversation_id: conversation_id,
            username: jwtPayload.username,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <Tooltip title="Create conversation">
            <IconButton
              onClick={() => {
                handleDialogs("showCreateConversation", true);
              }}
            >
              <AddIcon ml={5} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add user to conversation">
            <IconButton
              onClick={() => {
                handleDialogs("showAddUserToConversation", true);
              }}
            >
              <PersonAddIcon ml={5} />
            </IconButton>
          </Tooltip>
          {jwtPayload && (
            <Typography sx={{ ml: "auto" }} variant="overline">
              @{jwtPayload.username}
            </Typography>
          )}
          <Tooltip title="Log out">
            <IconButton onClick={logout}>
              <ExitToAppIcon ml={5} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid
        container
        justifyContent="flex-start"
        sx={{ backgroundColor: "#F0F2F5" }}
      >
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={2}
          xl={2}
          sx={{ overflow: "hidden" }}
        >
          <List>
            {conversations.current.map((conversation, index) => {
              return (
                <ListItem
                  onClick={changeConversation}
                  index={index}
                  key={index}
                  button
                  sx={{
                    mb: 0.5,
                    mt: 0.5,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {conversation.title.substring(0, 2).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conversation.title}
                    sx={{
                      display: "inline",
                    }}
                    secondary={
                      conversation.messages.length > 0
                        ? conversation.messages[
                            conversation.messages.length - 1
                          ].content.substring(0, 15) + "..."
                        : ""
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid
          item
          xs={6}
          sm={8}
          md={9}
          lg={10}
          xl={10}
          sx={{ overflowY: "scroll", maxHeight: "93vh", minHeight: "93vh" }}
          ref={containerRef}
        >
          <Grid
            container
            pb={5}
            sx={{
              flexDirection: "column",
              mt: 10,
            }}
          >
            {activeConversation &&
              conversations.current[activeConversation].messages.map(
                (message, index) => {
                  if (message.user_id.username === "system") {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={12}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={5}
                        sx={{
                          mb: 3,
                          alignSelf: "center",
                          mr: 3,
                          mt: 3,
                          wordWrap: "break-word",
                          wordBreak: "break-all",
                        }}
                      >
                        <Tooltip title={formatDate(message.creation_date)}>
                          <Paper
                            elevation={3}
                            sx={{
                              backgroundColor: "#dfe6e9",
                              padding: "0px 10px 0px 10px",
                              ml: "auto",
                              mt: "3px",
                              display: "table",
                              wordWrap: "break-word",
                              wordBreak: "break-all",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                textAlign: "left",
                                color: "black",
                                fontSize: "10px",
                                margin: "5px 0 5px 0",
                                wordWrap: "break-word",
                                wordBreak: "break-all",
                              }}
                            >
                              {message.content}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  } else if (message.user_id._id !== jwtPayload._id) {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={12}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={5}
                        sx={{
                          textAlign: "start",
                          mb: 3,
                          alignSelf: "flex-start",
                          ml: 3,
                          mt: 3,
                        }}
                      >
                        <Box>
                          <Tooltip title={message.user_id.username}>
                            <Avatar sx={{ ml: 0, mr: 2, float: "left" }}>
                              {message.user_id.username
                                .toUpperCase()
                                .substring(0, 2)}
                            </Avatar>
                          </Tooltip>
                          <Tooltip
                            title={
                              "Sent on " + formatDate(message.creation_date)
                            }
                          >
                            <Paper
                              elevation={3}
                              sx={{
                                backgroundColor: "#ff7979",
                                padding: "5px 10px 5px 10px",
                                mt: "3px",
                                mr: "10px",
                                float: "none",
                                display: "table",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  textAlign: "left",
                                  color: "black",
                                  margin: "5px 0 5px 0",
                                  wordWrap: "break-word",
                                  wordBreak: "break-all",
                                }}
                              >
                                {message.content}
                              </Typography>
                            </Paper>
                          </Tooltip>
                        </Box>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={12}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={5}
                        sx={{
                          mb: 3,
                          alignSelf: "flex-end",
                          mr: 3,
                          mt: 3,
                          wordWrap: "break-word",
                          wordBreak: "break-all",
                        }}
                      >
                        <Tooltip
                          title={"Sent on " + formatDate(message.creation_date)}
                        >
                          <Paper
                            elevation={3}
                            sx={{
                              backgroundColor: "#95C1EC",
                              padding: "5px 10px 5px 10px",
                              ml: "auto",
                              mt: "3px",
                              display: "table",
                              wordWrap: "break-word",
                              wordBreak: "break-all",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                textAlign: "left",
                                color: "black",
                                margin: "5px 0 5px 0",
                                wordWrap: "break-word",
                                wordBreak: "break-all",
                              }}
                            >
                              {message.content}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  }
                }
              )}
            {activeConversation && (
              <Grid container justifyContent="center">
                <Paper
                  elevation={10}
                  sx={{
                    position: "fixed",
                    bottom: "1%",
                    maxWidth: "90%",
                    width: "80%",
                    backgroundColor: "rgba(220, 222, 224, 0.5)",
                  }}
                >
                  <Grid container>
                    <Grid item lg={9} xs={6} pl={2} pr={2}>
                      <TextField
                        id="standard-basic"
                        multiline
                        fullWidth
                        maxRows={1}
                        onChange={handleMessageChange}
                        sx={{ textAlign: "center" }}
                        value={message}
                        onKeyUp={(e) => {
                          {
                            if (e.key === "Enter") sendMessage();
                          }
                        }}
                        variant="standard"
                      />
                    </Grid>
                    <Grid item lg={3} xs={6} sx={{ m: "0 auto" }}>
                      <Button
                        onClick={sendMessage}
                        fullWidth
                        color="inherit"
                        variant="text"
                        sx={{
                          height: "100%",
                          backgroundColor: "rgba(210, 212, 214, 0.5)",
                        }}
                      >
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
          {activeConversation && (
            <Grid container justifyContent="center">
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: "rgba(220, 222, 224, 0.5)",
                  minWidth: "450px",
                  position: "fixed",
                  top: "10%",
                }}
              >
                <Grid container alignItems="center">
                  <Grid item lg={6} xs={6} sm={6} xl={6}>
                    <Typography variant="h5" sx={{ fontSize: "18px" }}>
                      {conversations.current[activeConversation].title}
                    </Typography>
                  </Grid>
                  <Grid item lg={2} xs={2} sm={2} xl={2}>
                    <Tooltip title="Quit conversation">
                      <IconButton onClick={quitConversation}>
                        <ExitToAppIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item lg={2} xs={2} sm={2} xl={2}>
                    <Tooltip title="Edit conversation title">
                      <IconButton
                        onClick={() => {
                          handleDialogs("showConversationContextDialog", true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item lg={2} xs={2} sm={2} xl={2}>
                    <Tooltip title="Delete messages">
                      <IconButton onClick={clearConversation}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
          {jwtPayload !== undefined && (
            <>
              <AddUserToConversationDialog
                open={dialogs.showAddUserToConversation}
                onAddUserToConversation={onAddUserToConversation}
                close={() => {
                  handleDialogs("showAddUserToConversation", false);
                }}
                conversations={conversations}
              />
              <CreateConversationDialog
                open={dialogs.showCreateConversation}
                onCreateConversation={onCreateConversation}
                close={() => {
                  handleDialogs("showCreateConversation", false);
                }}
                userId={jwtPayload._id}
              />
              {conversations.current[activeConversation] !== undefined && (
                <ConversationContextDialog
                  open={dialogs.showConversationContextDialog}
                  container={containerRef.current}
                  conversation_id={
                    conversations.current[activeConversation]._id
                  }
                  changeConversationTitle={changeConversationTitle}
                  close={() => {
                    handleDialogs("showConversationContextDialog", false);
                  }}
                />
              )}
            </>
          )}
          <div ref={bottom}></div>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
