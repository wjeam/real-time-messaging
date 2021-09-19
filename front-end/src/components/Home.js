import React, {useState, useEffect, useRef} from "react"
import { Grid, Paper, AppBar, Toolbar, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField, Typography } from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";
import moment from "moment";

const Home = () => {
    const [socket, setSocket] = useState()
    const [message, setMessage] = useState("")
    const [conversations, setConversations] = useState([])
    const [conversation, setConversation] = useState()
    const [messages, setMessages] = useState([])

    const bottom = useRef(null)

    const scrollToBottom = () => {
        bottom.current?.scrollIntoView({ behaviour: "smooth"})
    }

    useEffect(() => {
        getConversations()
    }, [])

    useEffect(() => {
        setSocket(
            io("http://localhost:8172", {
                query: {
                    "user_id" : sessionStorage.getItem("user_id"),
                }
            })
        )
    }, [])

    useEffect(() => {

    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const getConversations = () => {
        axios({
            method: "GET",
            url: "http://localhost:8172/conversations/614733db15281451dbf33826"
        })
        .then((response) => {
            setConversations(response.data)
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const sendMessage = () => {
        if(socket !== undefined){
            socket.emit("message", {user_id: sessionStorage.getItem("user_id"), content: message, conversation_id: conversation._id})
        }
    }

    const changeConversation = (event) => {
        const index = event.currentTarget.getAttribute("index")
        setMessages(conversations[index].messages)
        setConversation(conversations[index])
    }  

    const formatDate = (date) => {
        let formattedDate = moment(new Date(date)).format("YYYY/MM/DD @ HH:mm")
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
                        conversations.map((conversation, index) => { 
                            return (
                                <ListItem onClick={changeConversation} index={index} key={index} button style={{paddingTop: 0, paddingBottom: 0}}>
                                    <ListItemAvatar>
                                        <Avatar style={{backgroundColor: conversation.color}}>A</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={conversation.title}
                                        style={{display: "inline"}}
                                        secondary={conversation.messages.length > 0 ? conversation.messages[conversation.messages.length-1].content : ""}
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
                    {
                        messages.map((message, index) => {
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
                                    <Grid key={index} item xs={12} sm={12} md={8} lg={8} xl={5} sx={{mb: 3, alignSelf: "flex-end", mr: 3, mt: 3}}>
                                        <Paper elevation={3} sx={{backgroundColor: "#95C1EC", padding: "5px 10px 5px 10px",  ml: "auto", mt: "3px", display: "table"}}>
                                            <Typography variant="body1" style={{color: "black", margin: "5px 0 5px 0"}}>{message.content}</Typography>
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