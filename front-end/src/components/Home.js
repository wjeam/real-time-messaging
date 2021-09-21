import React, {useState, useEffect, useRef, useReducer} from "react"
import { Grid, Paper, AppBar, Toolbar, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField, Typography } from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";
import moment from "moment";

const Home = () => {
    const [socket, setSocket] = useState()
    const [message, setMessage] = useState("")
    const conversations = useRef([])
    const [activeConversation, setActiveConversation] = useState()
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const bottom = useRef(null)

    const scrollToBottom = () => {
        bottom.current?.scrollIntoView({ behaviour: "smooth"})
    }

    useEffect(() => {
        getConversations()
    }, [])

    const connectSocketIO = () => {
        setSocket(
            io("http://localhost:8172", {
                query: {
                    "user_id" : sessionStorage.getItem("user_id"),
                }
            }).on("message", (message) => {
                updateMessages(message)
            })
        )
    }

    const updateMessages = (message) => {
        conversations.current.forEach((conversation, index) => {
            if(conversation._id === message.conversation_id){
                let tempConversations = conversations.current.slice()
                tempConversations[index].messages.push(message)
                conversations.current = tempConversations
                forceUpdate();
            }
        })
    }

    useEffect(() => {
        scrollToBottom()
    }, [conversations.current, activeConversation])

    const getConversations = () => {
        axios({
            method: "GET",
            url: "http://localhost:8172/conversations/"+sessionStorage.getItem("user_id")
        })
        .then((response) => {
            conversations.current = response.data
            connectSocketIO()
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const sendMessage = () => {
        if(socket !== undefined){
            socket.emit("message", {user_id: sessionStorage.getItem("user_id"), content: message, conversation_id: conversations.current[activeConversation]._id})
        }
    }

    const changeConversation = (event) => {
        const index = event.currentTarget.getAttribute("index")
        setActiveConversation(index)
    }  

    const formatDate = (date) => {
        const formattedDate = moment(new Date(date)).format("YYYY/MM/DD @ HH:mm")
        return formattedDate
    }

    const handleFormChange = (event) => {
        setMessage(event.target.value)
    }

    return (
        <div>
            <AppBar position="fixed" color="inherit">
                <Toolbar>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Grid container justifyContent="flex-start">
                <Grid item xs={6} sm={4} md={3} lg={2} xl={2}>
                    <List>
                        {
                        conversations.current.map((conversation, index) => { 
                            return (
                                <ListItem onClick={changeConversation} index={index} key={index} button style={{paddingTop: 0, paddingBottom: 0}}>
                                    <ListItemAvatar>
                                        <Avatar>A</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={conversation.title}
                                        style={{display: "inline"}}
                                        secondary={conversation.messages.length > 0 ? conversation.messages[conversation.messages.length-1].content.substring(0, 40)+"..." : ""}
                                    />
                                </ListItem>
                            )
                        })
                        }
                    </List>
                    <TextField id="standard-basic" label="MESSAGE" onChange={handleFormChange} defaultValue={message} variant="standard" />
                    <Button variant="contained" onClick={sendMessage}>SEND</Button>
                </Grid>
                <Grid item xs={6} sm={8} md={9} lg={10} xl={10} sx={{maxHeight: "700px", overflow: "auto"}}>
                    <Grid container sx={{flexDirection: "column"}}>
                    {activeConversation &&
                        conversations.current[activeConversation].messages.map((message, index) => {
                            if(message.user_id._id !== sessionStorage.getItem("user_id")) {
                                return (
                                    <Grid key={index} item xs={12} sm={12} md={8} lg={8} xl={5} sx={{textAlign: "start", mb: 3, alignSelf: "flex-start", ml: 3, mt: 3}}>
                                        <Typography variant="body" style={{color: "#CAD3C8", fontStyle: "italic"}}>{message.user_id.username}</Typography>
                                        <Paper elevation={3} sx={{backgroundColor: "#95ECEC", padding: "5px 10px 5px 10px", mt: "3px", mr: "10px", display: "table"}}>
                                            <Typography variant="body1" style={{color: "black", margin: "5px 0 5px 0"}}>{message.content}</Typography>
                                        </Paper>
                                        <Typography variant="body" style={{color: "#CAD3C8", fontStyle: "italic"}}>Sent on {formatDate(message.creation_date)}</Typography>
                                    </Grid>
                                )
                            } else {
                                return (
                                    <Grid key={index} item xs={12} sm={12} md={8} lg={8} xl={5} sx={{mb: 3, alignSelf: "flex-end", mr: 3, mt: 3, wordWrap: "break-word", wordBreak: "break-all"}}>
                                        <Paper elevation={3} sx={{backgroundColor: "#95C1EC", padding: "5px 10px 5px 10px",  ml: "auto", mt: "3px", display: "table", wordWrap: "break-word", wordBreak: "break-all"}}>
                                            <Typography variant="body1" style={{textAlign: "left", color: "black", margin: "5px 0 5px 0", wordWrap: "break-word", wordBreak: "break-all"}}>{message.content}</Typography>
                                        </Paper>
                                        <Typography variant="body" style={{color: "#CAD3C8", fontStyle: "italic", display: "table", width: "100%", textAlign: "right"}}>Sent on {formatDate(message.creation_date)}</Typography>
                                    </Grid>
                                )
                            }
                        })
                        }
                    </Grid>
                    <div ref={bottom}></div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;