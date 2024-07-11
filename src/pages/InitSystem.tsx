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

import {
  daysOfWeek,
  daysOfWeekAfterMerge,
  OpeningHours,
  DayState,
  initialDayState,
} from "../components/InitSystem/OpeningHours";
import { useRef, useState } from "react";
import { NameLogo } from "../components/InitSystem/NameLogo";
import { FinishModal } from "../components/InitSystem/FinishModal";
import { DeliveryCosts } from "../components/InitSystem/DeliveryCosts";
import { ContactDetails } from "../components/InitSystem/ContactDetails";
import { validatePhoneNumber, validatePostalCode } from "../utils/validations";

export function InitSystem() {
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
        // setActiveStep((prevActiveStep) => prevActiveStep + 1);
        // check if all fields are filled and valid
        let error = false;
        switch (activeStep) {
          case 0:
            break;
          case 1:
            if (!validatePostalCode(postalCode)) {
              error = true;
              setPostalCodeError("Nieprawidłowy kod pocztowy");
            } else {
              setPostalCodeError("");
            }

            if (!validatePhoneNumber(phoneNumber)) {
              error = true;
              setPhoneNumberError("Nieprawidłowy numer telefonu");
            } else {
              setPhoneNumberError("");
            }
            break;
          case 2:
            if (mergeMonToFri) {
              daysOfWeekAfterMerge.forEach((day) => {
                if (
                  daysState[day].open &&
                  (daysState[day].startTime === null ||
                    daysState[day].endTime === null)
                ) {
                  error = true;
                }
              });
            } else {
              daysOfWeek.forEach((day) => {
                if (
                  daysState[day].open &&
                  (daysState[day].startTime === null ||
                    daysState[day].endTime === null)
                ) {
                  error = true;
                }
              });
            }
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
        return (
          <NameLogo
            restaurantName={restaurantName}
            setRestaurantName={setRestaurantName}
            restaurantLogo={restaurantLogo}
            setRestaurantLogo={setRestaurantLogo}
          />
        );

      case 1:
        return (
          <ContactDetails
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            postalCodeError={postalCodeError}
            setPostalCodeError={setPostalCodeError}
            city={city}
            setCity={setCity}
            street={street}
            setStreet={setStreet}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            phoneNumberError={phoneNumberError}
            setPhoneNumberError={setPhoneNumberError}
            email={email}
            setEmail={setEmail}
          />
        );
      case 2:
        return (
          <OpeningHours
            mergeMonToFri={mergeMonToFri}
            setMergeMonToFri={setMergeMonToFri}
            daysState={daysState}
            setDaysState={setDaysState}
          />
        );
      case 3:
        return (
          <DeliveryCosts
            deliveryCosts={deliveryCosts}
            setDeliveryCosts={setDeliveryCosts}
          />
        );
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
      <Stepper activeStep={activeStep} sx={{ py: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box component={"form"} ref={formRef} onSubmit={(e) => handleNext(e)}>
        <Box>{inputs(activeStep)}</Box>
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

      <FinishModal
        mergeMonToFri={mergeMonToFri}
        openSummary={openSummary}
        setOpenSummary={setOpenSummary}
        restaurantName={restaurantName}
        restaurantLogo={restaurantLogo}
        postalCode={postalCode}
        city={city}
        street={street}
        phoneNumber={phoneNumber}
        email={email}
        daysState={daysState}
        deliveryCosts={deliveryCosts}
      />
    </Container>
  );
}
