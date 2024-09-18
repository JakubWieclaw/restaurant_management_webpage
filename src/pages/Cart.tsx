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

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../store";
import { CartContent } from "../components/Cart/CartContent";
import { ContentSummary } from "../components/Cart/OrderSummary";
import { DeliverySelection } from "../components/Cart/DeliverySelection";
import { PlaceType } from "../components/Cart/AutocompleteDistanceService";

export const Cart = () => {
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [value, setValue] = useState<PlaceType | null>(null);
  const [options, setOptions] = useState<readonly PlaceType[]>([]);

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
        return (
          <DeliverySelection
            setAddress={setAddress}
            checked={checked}
            setChecked={setChecked}
            deliveryCost={deliveryCost}
            setDeliveryCost={setDeliveryCost}
            inputValue={inputValue}
            setInputValue={setInputValue}
            value={value}
            setValue={setValue}
            options={options}
            setOptions={setOptions}
          />
        );
      case 2:
        return <ContentSummary shippingCost={deliveryCost ?? 0} />;
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
            disabled={
              cart.items.length === 0 || (activeStep === 1 && address === "")
            }
          >
            {activeStep === steps.length - 1
              ? "Przejdź do płatności"
              : "Następny"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
