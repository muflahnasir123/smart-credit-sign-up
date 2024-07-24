/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import moment from "moment";

export const SetIdentity = ({ handleNext }) => {
  useEffect(() => {
    const customer = localStorage.getItem("customerUpdated");
    if (customer) {
      handleNext(2);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const validSSNOption = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        clientKey: import.meta.env.VITE_APP_SIGNUP_API_KEY,
        trackingToken: localStorage.getItem("trackingToken"),
        ssn: data.get("ssn"),
      }),
    };

    let validPass = await fetch(
      `${import.meta.env.VITE_APP_SIGNUP_API_URL}/validate/ssn`,
      validSSNOption
    );

    if (validPass?.status === 200) {
      const setIdentityOption = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          clientKey: import.meta.env.VITE_APP_SIGNUP_API_KEY,
          trackingToken: localStorage.getItem("trackingToken"),
          customerToken: localStorage.getItem("customerToken"),
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          homePhone: data.get("phone"),
          "homeAddress.street": data.get("address"),
          "homeAddress.city": data.get("city"),
          "homeAddress.state": data.get("state"),
          "homeAddress.zip": data.get("zip"),
          "identity.birthDate": moment(data.get("dob")).format("MM/DD/YYYY"),
          "identity.ssnPartial": data.get("ssn").split("-")[2],
          "identity.ssn": data.get("ssn"),
          isConfirmedTerms: false,
          isBrowserConnection: false,
        }),
      };
      let startingPass = await fetch(
        `${import.meta.env.VITE_APP_SIGNUP_API_URL}/customer/update/identity`,
        setIdentityOption
      );
      const customer = await startingPass.json();
      if (startingPass.status === 200) {
        localStorage.setItem("customerUpdated", JSON.stringify(customer));
        handleNext(2);
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="city"
                label="City"
                name="city"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="state"
                label="State"
                id="state"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="zip"
                label="Zip Code"
                id="zip"
                type={"number"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="phone"
                label="Phone #"
                id="phone"
                type={"tel"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="dob"
                label="DOB"
                id="dob"
                type={"date"}
                InputProps={{ inputProps: { max: 10 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="ssn"
                label="Social Security (9 Digits)"
                id="ssn"
                placeholder="xxx-xx-xxxx"
                InputProps={{ inputProps: { max: 11 } }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
