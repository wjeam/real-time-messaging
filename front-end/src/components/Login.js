
import React, { useEffect } from 'react'
import { FormControl, Input, InputLabel, Paper, Grid, Button, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';

const Login = () => {
    useEffect(() => {
        //const socket = io("ws://localhost:3030")
    }, [])

    return (
        <div>
            <Grid container direction="row" justifyContent="center">
                <Grid item md={4} sm={8} xs={8} lg={4}>
                    <Paper elevation={3} style={{paddingBottom: "25px", paddingTop: "25px"}}>
                        <Stack spacing={3} alignItems="center" >
                            <Typography variant="h2" component="div" align="center">Login</Typography>
                            <FormControl sx={{maxWidth: "100%", width: "300px"}}>
                                <InputLabel htmlFor="identifier">Username or E-mail</InputLabel>
                                <Input type="email" id="identifier"/>
                            </FormControl>
                            <FormControl sx={{maxWidth: "100%", width: "300px"}}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input type="password" id="password"/>
                            </FormControl>
                            <Box>
                                <Button color="primary" variant="contained" sx={{marginRight: "5px"}}>LOGIN</Button>
                                <Button color="success" variant="contained" sx={{marginLeft: "5px"}}>REGISTER</Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login;
