import {
  Divider,
  Typography,
  Container,
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  Button,
} from "@mui/material";

import "dayjs/locale/de";
import { Slide, toast } from "react-toastify";
import { createContext, useRef, useState, useMemo } from "react";

import {
  daysOfWeek,
  daysOfWeekAfterMerge,
  OpeningHours,
  DayState,
  initialDayState,
  validateOpeningHours,
} from "../components/InitSystem/OpeningHours";
import {
  ContactDetails,
  validateContactDetails,
} from "../components/InitSystem/ContactDetails";
import { NameLogo } from "../components/InitSystem/NameLogo";
import { FinishModal } from "../components/InitSystem/FinishModal";
import { DeliveryCosts } from "../components/InitSystem/DeliveryCosts";

export const WizardContext = createContext<any>(null);

export const InitSystem = () => {
  const steps = [
    "Nazwa i logo",
    "Dane kontaktowe",
    "Godziny otwarcia",
    "Koszty dostawy",
  ];

  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantLogo, setRestaurantLogo] = useState<File | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [mergeMonToFri, setMergeMonToFri] = useState<boolean>(true);
  const [openSummary, setOpenSummary] = useState(false); // State for modal open/close
  const [deliveryCosts, setDeliveryCosts] = useState([
    { distance: "", price: "" },
  ]);
  const [daysState, setDaysState] = useState<Record<string, DayState>>(
    daysOfWeek.concat(daysOfWeekAfterMerge).reduce((acc, day) => {
      acc[day] = { ...initialDayState };
      return acc;
    }, {} as Record<string, DayState>)
  );

  const formRef = useRef<HTMLFormElement>(null);

  const handleNext = (e: any) => {
    e.preventDefault();
    if (formRef.current?.checkValidity()) {
      if (activeStep < steps.length - 1) {
        let error = false;
        console.log(activeStep);
        switch (activeStep) {
          case 0:
            break; // handled by internal HTML5 form validation
          case 1:
            error = validateContactDetails(
              postalCode,
              setPostalCodeError,
              phoneNumber,
              setPhoneNumberError
            );
            break;
          case 2:
            error = validateOpeningHours(daysState, mergeMonToFri);
            break;
          default:
            break;
        }
        if (error) {
          toast.warn("Uzupełnij wymagane pola", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          });
        } else {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      } else {
        setOpenSummary(true); // Open summary modal
      }
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const inputs = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <NameLogo />;
      case 1:
        return <ContactDetails />;
      case 2:
        return <OpeningHours />;
      case 3:
        return <DeliveryCosts />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 15 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Wprowadź dane dotyczące restauracji
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
      <Box component={"form"} ref={formRef} onSubmit={(e) => handleNext(e)}>
        <WizardContext.Provider
          value={useMemo(
            () => ({
              restaurantName,
              setRestaurantName,
              restaurantLogo,
              setRestaurantLogo,
              postalCode,
              setPostalCode,
              city,
              setCity,
              street,
              setStreet,
              phoneNumber,
              setPhoneNumber,
              email,
              setEmail,
              activeStep,
              setActiveStep,
              mergeMonToFri,
              setMergeMonToFri,
              openSummary,
              setOpenSummary,
              deliveryCosts,
              setDeliveryCosts,
              daysState,
              setDaysState,
              postalCodeError,
              setPostalCodeError,
              phoneNumberError,
              setPhoneNumberError,
            }),
            [
              restaurantName,
              setRestaurantName,
              restaurantLogo,
              setRestaurantLogo,
              postalCode,
              setPostalCode,
              city,
              setCity,
              street,
              setStreet,
              phoneNumber,
              setPhoneNumber,
              email,
              setEmail,
              activeStep,
              setActiveStep,
              mergeMonToFri,
              setMergeMonToFri,
              openSummary,
              setOpenSummary,
              deliveryCosts,
              setDeliveryCosts,
              daysState,
              setDaysState,
              postalCodeError,
              setPostalCodeError,
              phoneNumberError,
              setPhoneNumberError,
            ]
          )}
        >
          <Box>{inputs(activeStep)}</Box>
          <FinishModal />
        </WizardContext.Provider>
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
            <Button variant="contained" type="submit">
              {activeStep === steps.length - 1 ? "Zakończ" : "Następny"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
