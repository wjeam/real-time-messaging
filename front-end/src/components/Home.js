import React, {useState, useEffect, useRef} from "react"
import { Grid, Paper, AppBar, Toolbar, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField, Typography } from "@mui/material";
import  { deepOrange, deepPurple, lightBlue, lightGreen, red, blueGrey } from "@mui/material/colors";
import { io } from "socket.io-client";
import axios from "axios";
import moment from "moment";

const _conversations = [
    {
        initial: "AZ",
        title: "Conversation 1",
        color: deepOrange[500],
        content: "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from" 
    },
    {
        initial: "CD",
        title: "Conversation 2",
        color: lightBlue[500],
        content: "Words which don't look even slightly believable. If you are going to use you need to be sure there isn't anything embarrassing hidden in the"
    },
    {
        initial: "ET",
        title: "Conversation 3",
        color: deepPurple[500],
        content: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evo"
    },
    {
        initial: "OT",
        title: "Conversation 4",
        color: lightGreen[500],
        content: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing"
    },
    {
        initial: "MQ",
        title: "Conversation 5",
        color: red[500],
        content: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they"
    },
    {
        initial: "HD",
        title: "Conversation 6",
        color: blueGrey[500],
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati"
    },
    {
        initial: "VA",
        title: "Conversation 7",
        color: lightGreen[500],
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati"
    },
]

const Home = () => {
    const [socket, setSocket] = useState()
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [conversations, setConversations] = useState([])

    const bottom = useRef(null)

    const scrollToBottom = () => {
        bottom.current?.scrollIntoView({ behaviour: "smooth"})
    }

    useEffect(() => {
        setSocket(
            io("http://localhost:3030", {
                query: {
                    "user_id" : sessionStorage.getItem("user_id"),
                }
            })
        )

        getMessages("614696b413a529fdbebba68e")
        return () => {
            
        }
    }, [])

    useEffect(() => {
        if (socket !== undefined)
            socket.on("message", (newMessage) => {
                setMessages(messages => [...messages, newMessage])
            })
        return () => {
            
        }
    }, [socket])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function ping(message) {
        socket.emit("message", {content: message, user_id: sessionStorage.getItem("user_id"), conversation_id: "614696b413a529fdbebba68e"})
    }

    const getMessages = (conversation_id) => {
        axios({
            method: "GET",
            url: "http://localhost:3030/messages/"+conversation_id
        })
        .then((data) => {
            setMessages(data.data)
        })
        .catch((error) => {
            console.error(error);
            setMessages([]);
        });
    }

    const getConversations = () => {
        // TBI
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
                        _conversations.map((conversation, index) => { 
                            return (
                                <ListItem key={index} button style={{paddingTop: 0, paddingBottom: 0}}>
                                    <ListItemAvatar>
                                        <Avatar style={{backgroundColor: conversation.color}}>{conversation.initial}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={conversation.title}
                                        style={{display: "inline"}}
                                        secondary={conversation.content.substr(0, 50)+"..."}
                                        className={conversation.message}
                                        onClick={ping}
                                    />
                                </ListItem>
                            )
                        })
                        }
                    </List>
                    <TextField id="standard-basic" label="MESSAGE" onChange={handleFormChange} defaultValue={message} variant="standard" />
                    <Button variant="contained" onClick={() => {ping(message)}}>SEND</Button>
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