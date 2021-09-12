import React from 'react'
import { AppBar, Toolbar, Typography, Button, makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    toolbar: {
        minHeight: "42px"
    },
    toolbarRight: {
        marginLeft: "auto"
    },
    toolbarLeft: {
        marginRight: "auto"
    }
}));

const Home = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Box className={classes.toolbarLeft}>
                    <Typography variant="h6">
                        Title
                    </Typography>
                </Box>
                <Box className={classes.toolbarRight}>
                    <Button color="inherit">LOGOUT</Button>
                </Box>
            </Toolbar>
        </AppBar>
        </div>
    );
}

export default Home;