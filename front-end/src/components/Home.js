import React from 'react'
import { makeStyles, Grid, Paper, AppBar, Toolbar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import  {deepOrange, deepPurple, lightBlue, lightGreen, red, blueGrey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        minHeight: "50px"
    },
    toolbarRight: {
        marginLeft: "auto"
    },
    message: {
        textOverflow: "ellipsis",
        whiteSpace: "wrap",
        overflow: "hidden"
    }
}));

const fake = [
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
    const classes = useStyles();

    return (
        <div>
            <AppBar position="fixed" color="inherit">
                <Toolbar className={classes.toolbar}>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Grid container justifyContent="flex-start">
                <Grid item xs={6} sm={4} md={3} lg={2} xl={2}>
                    <Paper square elevation={0}>
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
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;