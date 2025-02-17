/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export const CreateCustomer = ({ handleNext }) => {
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("trackingToken");
      const key = localStorage.getItem("customerToken");
      if (key) {
        handleNext(1);
        return;
      }
      if (!token) {
        let startingPass = await fetch(
          `${import.meta.env.VITE_APP_SIGNUP_API_URL}/start?clientKey=` +
            import.meta.env.VITE_APP_SIGNUP_API_KEY,
          {
            headers: { accept: "application/json" },
          }
        );
        const data = await startingPass.json();
        if (startingPass.status === 200) {
          localStorage.setItem("trackingToken", data.trackingToken);
          localStorage.setItem("anonymousId", data.anonymousId);
        }
      }
    })();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const validOption = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        clientKey: import.meta.env.VITE_APP_SIGNUP_API_KEY,
        trackingToken: localStorage.getItem("trackingToken"),
        email: data.get("email"),
      }),
    };

    let validPass = await fetch(
      `${import.meta.env.VITE_APP_SIGNUP_API_URL}/validate/email`,
      validOption
    );

    if (validPass.status === 200) {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          clientKey: import.meta.env.VITE_APP_SIGNUP_API_KEY,
          trackingToken: localStorage.getItem("trackingToken"),
          email: data.get("email"),
          password: data.get("password"),
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
        }),
      };

      let startingPass = await fetch(
        `${import.meta.env.VITE_APP_SIGNUP_API_URL}/customer/create`,
        options
      );
      const customer = await startingPass.json();
      if (startingPass.status === 201) {
        localStorage.setItem("customerToken", customer.customerToken);
        handleNext(1);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
