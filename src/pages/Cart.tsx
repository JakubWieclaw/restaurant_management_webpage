import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../store";
import { CartContent } from "../components/Cart/CartContent";
import { DeliverySelection } from "../components/Cart/DeliverySelection";

export const Cart = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Koszyk", "Wybór dostawy", "Podsumowanie"];

  const handleNext = (e: any) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const cart = useSelector((state: RootState) => state.cart);

  const inputs = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <CartContent />;
      case 1:
        return <DeliverySelection />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 15 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Twój koszyk
      </Typography>
      <Divider />
      <Box
        sx={{
          justifyContent: "center",
          display: { sm: "block", xs: "none" },
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            py: 5,
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box
        sx={{
          justifyContent: "center",
          display: { sm: "none", xs: "flex" },
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            py: 5,
          }}
          orientation="vertical"
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {inputs(activeStep)}

      <Grid container sx={{ py: 5 }} justifyContent="space-between">
        <Grid item>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Poprzedni
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={cart.items.length === 0}
          >
            {activeStep === steps.length - 1 ? "Zakończ" : "Następny"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
