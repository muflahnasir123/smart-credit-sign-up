import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { CreateCustomer, SetIdentity, VerifyIdentity } from "./components";
import { SetPayment } from "./components/SetPayment";
import { CompleteEnrollement } from "./components/CompleteEnrollement";

const steps = [
  "Start Enrollment",
  "Set Identity",
  "Verify Identity",
  "Set Payment Method",
  "CompleteEnrollement"
];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = (value) => {
    setActiveStep(value);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <React.Fragment>
        {activeStep === 0 && <CreateCustomer handleNext={handleNext} />}
        {activeStep === 1 && <SetIdentity handleNext={handleNext} />}
        {activeStep === 2 && <VerifyIdentity handleNext={handleNext} />}
        {activeStep === 3 && <SetPayment handleNext={handleNext} />}
        {activeStep === 4 && <CompleteEnrollement />}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
        </Box>
      </React.Fragment>
    </Box>
  );
}
