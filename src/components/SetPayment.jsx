/* eslint-disable react/prop-types */
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
  TextField as Input,
} from "@mui/material";
import { CalendarToday, CreditCard } from "@mui/icons-material";
import moment from "moment";

export const SetPayment = ({ handleNext }) => {
  const paySchema = Yup.object({
    cardNumber: Yup.string()
      // .matches(/^[0-9]{16}$/, "Invalid card number")
      .required("Card number is required"),
    // expiryDate: yup.string().required("Expiry date is required"),
    expiryDate: Yup.string()
      .required("Expiry date is required")
      .test("valid-month", "Invalid month", function (value) {
        if (!value) {
          return false;
        }

        const [month] = value.split("/").map((item) => parseInt(item, 10));

        return month >= 1 && month <= 12;
      })
      .test(
        "is-future-date",
        "Expiry date must be in the future",
        function (value) {
          if (!value) {
            return false;
          }

          const currentDate = new Date();
          const [month, year] = value
            .split("/")
            .map((item) => parseInt(item, 10));

          // Adding 1 to the month because JavaScript months are zero-indexed
          const expiryDate = new Date(year + 2000, month, 1);

          return expiryDate > currentDate;
        }
      ),
    name: Yup.string().required("Name is required"),
    cvv: Yup.string()
      .matches(/^[0-9]{3,4}$/, "Invalid CVV")
      .required("CVV is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: paySchema,
  });

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Limit to four numeric characters
    const formattedValue = numericValue.slice(0, 4);

    // Add the '/' separator after the first two characters
    if (formattedValue.length > 2) {
      return formattedValue.slice(0, 2) + " / " + formattedValue.slice(2);
    } else {
      return formattedValue;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const setIdentityOption = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        clientKey: import.meta.env.VITE_APP_SIGNUP_API_KEY,
        number: data.get("cardNumber").split(" ").join(""),
        trackingToken: localStorage.getItem("trackingToken"),
      }),
    };
    let startingPass = await fetch(
      `${import.meta.env.VITE_APP_SIGNUP_API_URL}/validate/credit-card-number`,
      setIdentityOption
    );
    const validCard = await startingPass.json();
    if (startingPass.status === 200) {
      localStorage.setItem("creditCardToken", validCard.creditCardToken);
      const setCardOption = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          clientKey: import.meta.env.VITE_APP_SIGNUP_API_KEY,
          trackingToken: localStorage.getItem("trackingToken"),
          customerToken: localStorage.getItem("customerToken"),
          "creditCard.token": localStorage.getItem("creditCardToken"),
          "creditCard.cvv": data.get("cvv"),
          "creditCard.expirationMonth": data.get("expiryDate").split("/")[0],
          "creditCard.expirationYear": moment(
            data.get("expiryDate").split("/")[1].split(" ")[1]
          ).format("YYYY"),
          isConfirmedTerms: true,
          confirmTermsBrowserIpAddress: "192.168.1.123",
        }),
      };
      let startingPass = await fetch(
        `${
          import.meta.env.VITE_APP_SIGNUP_API_URL
        }/customer/update/credit-card`,
        setCardOption
      );
      const customer = await startingPass.json();
      if (startingPass.status === 200) {
        localStorage.setItem("payment", JSON.stringify(customer));
        handleNext(4);
      } else if (
        startingPass.status === 422 &&
        customer.errors[0].code === "CREDIT_CARD_COMPLETED"
      ) {
        handleNext(4);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          background: "var(--light-grey)",
          py: 5,
          px: { xs: 2, md: 7 },
          maxWidth: "32rem",
          margin: "0 auto",
          my: 5,
          borderRadius: "20px",
        }}
      >
        {/* <SharedLayout> */}
        <Box>
          <Typography
            variant="h5"
            className="fw-500 text-center"
            sx={{ pb: 3 }}
          >
            Pay with card
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Box sx={{ pb: 2 }}>
                  <InputLabel sx={{ py: 2, color: "#49454F" }}>
                    Card Number
                  </InputLabel>
                  <Input
                    fullWidth
                    id="cardNumber"
                    name="cardNumber"
                    value={formatCardNumber(formik.values.cardNumber)}
                    onChange={(e) => {
                      e.target.value = formatCardNumber(e.target.value);
                      formik.handleChange(e);
                    }}
                    error={
                      formik.touched.cardNumber &&
                      Boolean(formik.errors.cardNumber)
                    }
                    helperText={
                      formik.touched.cardNumber && formik.errors.cardNumber
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        paddingLeft: "8px",
                      },
                    }}
                    inputProps={{ maxLength: 19 }}
                    placeholder="1234 1234 1234 1234"
                    // placeholder="e.g John Doe"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" sx={{ p: 0, pr: 4 }}>
                            <CreditCard className="main-color" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ py: 0.5, color: "#49454F" }}>
                  Expiry Date
                </InputLabel>
                <Input
                  variant="outlined"
                  fullWidth
                  id="expiryDate"
                  name="expiryDate"
                  value={formik.values.expiryDate}
                  onChange={(e) => {
                    e.target.value = formatExpiryDate(e.target.value);
                    formik.handleChange(e);
                  }}
                  error={
                    formik.touched.expiryDate &&
                    Boolean(formik.errors.expiryDate)
                  }
                  helperText={
                    formik.touched.expiryDate && formik.errors.expiryDate
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarToday
                          sx={{ color: "#ABABAB", width: "1rem" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel sx={{ py: 0.5, color: "#49454F" }}>CVV</InputLabel>
                <Input
                  variant="outlined"
                  fullWidth
                  id="cvv"
                  name="cvv"
                  value={formik.values.cvv}
                  onChange={formik.handleChange}
                  error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                  helperText={formik.touched.cvv && formik.errors.cvv}
                  inputProps={{ maxLength: 4 }}
                  placeholder="e.g 1234"
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              type="submit"
              sx={{
                width: "100%",
                mt: 4,
                py: 1.3,
                fontWeight: "500",
              }}
            >
              Pay Now
            </Button>
          </form>
        </Box>
        {/* </SharedLayout> */}
      </Box>
    </Container>
  );
};
