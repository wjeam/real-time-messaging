import { Typography, Grid } from "@mui/material";
import React from "react";

const Error = () => {
  return (
    <>
      <Grid
        container
        sx={{
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Grid item>
          <Typography variant="h1" color="error">
            Error
          </Typography>
          <Typography variant="h4" color="black">
            You are not allowed to access this content.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Error;
