/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";

import "../../config";
import "../../loader_only";

export const VerifyIdentity = ({ handleNext }) => {
  const [questions, setQuestions] = useState();
  const [answer1, setAnswer1] = useState();
  const [answer2, setAnswer2] = useState();
  const [answer3, setAnswer3] = useState();
  const [answer4, setAnswer4] = useState();
  const [answer5, setAnswer5] = useState();

  useEffect(() => {
    const onPageLoad = () => {
      const data = window.IGLOO.getBlackbox();
      if (data && data.blackbox) {
        localStorage.setItem("blackBox", data.blackbox);
      }
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const setIdentityOption = {
        method: "GET",
        headers: { accept: "application/json" },
      };
      let startingPass = await fetch(
        `${import.meta.env.VITE_APP_SIGNUP_API_URL}/id-verification?clientKey=${
          import.meta.env.VITE_APP_SIGNUP_API_KEY
        }&trackingToken=${localStorage.getItem(
          "trackingToken"
        )}&customerToken=${localStorage.getItem(
          "customerToken"
        )}&transunionDigitalVerificationBlackBox=${localStorage.getItem(
          "blackBox"
        )}`,
        setIdentityOption
      );
      const questionsData = await startingPass.json();
      if (startingPass.status === 200) {
        setQuestions(questionsData);
      } else if (
        startingPass.status === 422 &&
        questionsData.errors[0].code === "ID_ALREADY_VERIFIED"
      ) {
        handleNext(3);
      }
    })();
  }, []);

  const handleSubmit = async () => {
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
        "idVerificationCriteria.referenceNumber":
          questions.idVerificationCriteria["referenceNumber"],
        ...(answer1 && { "idVerificationCriteria.answer1": answer1 }),
        ...(answer2 && { "idVerificationCriteria.answer2": answer2 }),
        ...(answer3 && { "idVerificationCriteria.answer3": answer3 }),
        ...(answer4 && { "idVerificationCriteria.answer4": answer4 }),
        ...(answer5 && { "idVerificationCriteria.answer5": answer5 }),
        "idVerificationCriteria.transunionDigitalVerificationBlackBox":
          localStorage.getItem("blackBox"),
      }),
    };
    let startingPass = await fetch(
      `${import.meta.env.VITE_APP_SIGNUP_API_URL}/id-verification`,
      setIdentityOption
    );
    if (startingPass.status === 200) {
      handleNext(3);
    }
  };

  return (
    <div>
      {/* <input
        type="hidden"
        id="ioBlackBox"
        name="transunionDigitalVerificationBlackBox"
      /> */}
      {questions && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {questions && questions.idVerificationCriteria["question1"] && (
            <FormControl sx={{ marginTop: 5 }}>
              <FormLabel id="demo-radio-buttons-group-label">
                {questions.idVerificationCriteria["question1"]["displayName"]}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(event) => setAnswer1(event.target.value)}
              >
                {questions.idVerificationCriteria["question1"]["choiceList"][
                  "choice"
                ].map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={choice.key}
                    control={<Radio />}
                    label={choice.display}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {questions && questions.idVerificationCriteria["question2"] && (
            <FormControl sx={{ marginTop: 5 }}>
              <FormLabel id="demo-radio-buttons-group-label">
                {questions.idVerificationCriteria["question2"]["displayName"]}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(event) => setAnswer2(event.target.value)}
              >
                {questions.idVerificationCriteria["question2"]["choiceList"][
                  "choice"
                ].map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={choice.key}
                    control={<Radio />}
                    label={choice.display}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {questions && questions.idVerificationCriteria["question3"] && (
            <FormControl sx={{ marginTop: 5 }}>
              <FormLabel id="demo-radio-buttons-group-label">
                {questions.idVerificationCriteria["question3"]["displayName"]}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(event) => setAnswer3(event.target.value)}
              >
                {questions.idVerificationCriteria["question3"]["choiceList"][
                  "choice"
                ].map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={choice.key}
                    control={<Radio />}
                    label={choice.display}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {questions && questions.idVerificationCriteria["question4"] && (
            <FormControl sx={{ marginTop: 5 }}>
              <FormLabel id="demo-radio-buttons-group-label">
                {questions.idVerificationCriteria["question4"]["displayName"]}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(event) => setAnswer4(event.target.value)}
              >
                {questions.idVerificationCriteria["question4"]["choiceList"][
                  "choice"
                ].map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={choice.key}
                    control={<Radio />}
                    label={choice.display}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {questions && questions.idVerificationCriteria["question5"] && (
            <FormControl sx={{ marginTop: 5 }}>
              <FormLabel id="demo-radio-buttons-group-label">
                {questions.idVerificationCriteria["question5"]["displayName"]}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={(event) => setAnswer5(event.target.value)}
              >
                {questions.idVerificationCriteria["question5"]["choiceList"][
                  "choice"
                ].map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={choice.key}
                    control={<Radio />}
                    label={choice.display}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          <Button sx={{ marginTop: 2 }} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};
