import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export const CompleteEnrollement = () => {
  const [message, setMessage] = useState();
  useEffect(() => {
    (async () => {
      const setIdentityOption = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          trackingToken: localStorage.getItem("trackingToken"),
          customerToken: localStorage.getItem("customerToken"),
          clientKey: import.meta.env.VITE_APP_SIGNUP_API_KEY,
        }),
      };
      let startingPass = await fetch(
        `${import.meta.env.VITE_APP_SIGNUP_API_URL}/complete`,
        setIdentityOption
      );
      const customer = await startingPass.json();
      if (startingPass.status === 200) {
        localStorage.setItem("temPass", JSON.stringify(customer));
        setMessage("Enrollement Completed Successfully");
      }
    })();
  }, []);

  return (
    <div>
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        {message}
      </Alert>
    </div>
  );
};
