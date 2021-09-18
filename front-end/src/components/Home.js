import React, {useState, useEffect} from 'react'
import { Grid, Paper, AppBar, Toolbar, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, TextField, Box, Card, CardActions, CardText, CardContent, Typography, CardHeader} from '@mui/material';
import  { deepOrange, deepPurple, lightBlue, lightGreen, red, blueGrey } from '@mui/material/colors';
import { io } from 'socket.io-client';

const conversations = [
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
        content: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evo"
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
    const [message, setMessage] = useState('')

    const onMessageChange = e => {
        setMessage(e.target.value)
    }

    useEffect(() => {
        setSocket(io('http://localhost:3030', {query: 'user_id=12345'}))
        return () => {
            
        }
    }, [])

    function ping() {
        socket.emit('message', {user_id: '12345', conversation_id: '54321', content: message})
        console.log('asdf')
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
                    <Typography variant="body"aper square elevation={3}>
                        <List>
                            {
                            conversations.map((conversation) => { 
                                return (
                                    <ListItem button style={{paddingTop: 0, paddingBottom: 0}}>
                                        <ListItemAvatar>
                                            <Avatar style={{backgroundColor: conversation.color}}>{conversation.initial}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={conversation.title}
                                            style={{display: "inline"}}
                                            secondary={conversation.content.substr(0, 50)+'...'}
                                            className={conversation.message}
                                        />
                                    </ListItem>
                                )
                            })
                            }
                        </List>
                    </Typography>
                </Grid>
                <Grid item xs={6} sm={8} md={9} lg={10} xl={10}>
                    <Grid container sx={{flexDirection: "column"}}>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={5} sx={{textAlign: "start", marginBottom: "10px", alignSelf: "flex-start", ml: 3, mt: 3}}>
                            <Paper elevation={3} sx={{padding: "5px 10px 5px 10px", mt: "3px", mr: "10px", display: "table"}}>
                                <Typography variant="body1" style={{color: "black", margin: "5px 0 5px 0"}}>asasdasd aasdsdssasassaddasadsdasdsadsdasadsaddddddds sad asada sdadsadsa ass das dasddsdad</Typography>
                            </Paper>
                            <Typography variant="body" style={{color: "black", fontStyle: "italic"}}>Sent @ 11:02</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={5} sx={{textAlign: "end", marginBottom: "10px", alignSelf: "flex-end", mr: 3, mt: 3}}>
                            <Paper elevation={3} sx={{padding: "5px 10px 5px 10px", mt: "3px", ml: 8, display: "table"}}>
                                <Typography variant="body1" style={{color: "black", margin: "5px 0 5px 0"}}>dsadsasdadsde</Typography>
                            </Paper>
                            <Typography variant="body" style={{color: "black", fontStyle: "italic"}}>Sent @ 11:02</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={5} sx={{textAlign: "end", marginBottom: "10px", alignSelf: "flex-end", mr: 3, mt: 3}}>
                            <Paper elevation={3} sx={{padding: "5px 10px 5px 10px", mt: "3px", ml: 8, display: "table"}}>
                                <Typography variant="body1" style={{color: "black", margin: "5px 0 5px 0"}}>aasadsl;lkads; klldasklkl;dsakl;kl;sakl; kl;askl;kl;daslk;kl;daslk;kl;daskl;  klkl  ;dklsk;lasdkl; kl;dkl;kl;</Typography>
                            </Paper>
                            <Typography variant="body" style={{color: "black", fontStyle: "italic"}}>Sent @ 11:02</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={5} sx={{textAlign: "end", marginBottom: "10px", alignSelf: "flex-end", mr: 3, mt: 3}}>
                            <Paper elevation={3} sx={{padding: "5px 10px 5px 10px", mt: "3px", ml: 8, display: "table"}}>
                                <Typography variant="body1" style={{color: "black", margin: "5px 0 5px 0"}}>allo?</Typography>
                            </Paper>
                            <Typography variant="body" style={{color: "black", fontStyle: "italic"}}>Sent @ 11:02</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={5} sx={{textAlign: "start", marginBottom: "10px", alignSelf: "flex-start", ml: 3, mt: 3}}>
                            <Paper elevation={3} sx={{padding: "5px 10px 5px 10px", mt: "3px", mr: "10px", display: "table"}}>
                                <Typography variant="body1" style={{color: "black", margin: "5px 0 5px 0"}}>quoi?</Typography>
                            </Paper>
                            <Typography variant="body" style={{color: "black", fontStyle: "italic"}}>Sent @ 11:02</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;