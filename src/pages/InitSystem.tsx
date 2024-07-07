import {
  Container,
  FormControlLabel,
  Grid,
  Switch,
  Box,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import {
  validatePostalCode,
  validatePhoneNumber,
  validateEmail,
} from "../utils/validations";
import "dayjs/locale/de";
import { Dayjs } from "dayjs";
import { forwardRef, ReactElement, Ref, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TransitionProps } from "@mui/material/transitions";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function InitSystem() {
  const steps = [
    "Nazwa i logo",
    "Dane kontaktowe",
    "Godziny otwarcia",
    "Koszty dostawy",
  ];

  const daysOfWeek = [
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
    "Niedziela",
  ]; // do not change order

  const daysOfWeekAfterMerge = ["Poniedziałek - Piątek", "Sobota", "Niedziela"]; // do not change order

  const modalActions = ["Chcę je poprawić", "Wszystko OK!"];

  type DayState = {
    open: boolean;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
  };

  const initialDayState: DayState = {
    open: true,
    startTime: null,
    endTime: null,
  };

  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantNameError, setRestaurantNameError] = useState<string>("");
  const [restaurantLogo, setRestaurantLogo] = useState<File | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [streetError, setStreetError] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [mergeMonToFri, setMergeMonToFri] = useState<boolean>(true);
  const [daysState, setDaysState] = useState<Record<string, DayState>>(
    daysOfWeek.concat(daysOfWeekAfterMerge).reduce((acc, day) => {
      acc[day] = { ...initialDayState };
      return acc;
    }, {} as Record<string, DayState>)
  );
  const [openSummary, setOpenSummary] = useState(false); // State for modal open/close
  const handleOpenSummary = () => setOpenSummary(true); // Function to open modal
  const handleCloseSummary = (e: { target: any }) => {
    setOpenSummary(false);
    if (e.target.textContent === modalActions[1]) {
      // if user confirms
      alert("Dane zostały wysłane na serwer");
    }
  }; // Function to close modal

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      handleOpenSummary(); // Open summary modal
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const changeAllWorkingDays = () => {
    setDaysState((prevState) => {
      const updatedState = { ...prevState };
      for (const workDay of daysOfWeek.slice(0, 5)) {
        updatedState[workDay] = { ...prevState[daysOfWeekAfterMerge[0]] };
      }
      return updatedState;
    });
  };

  const handleCheckboxChange = (day: string) => {
    setDaysState((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        open: !prevState[day].open,
      },
    }));
    if (day === daysOfWeekAfterMerge[0]) {
      changeAllWorkingDays();
    }
  };

  const handleTimeChange =
    (day: string, type: "startTime" | "endTime") =>
    (newValue: Dayjs | null) => {
      setDaysState((prevState) => ({
        ...prevState,
        [day]: {
          ...prevState[day],
          [type]: newValue,
        },
      }));
      if (day === daysOfWeekAfterMerge[0]) {
        changeAllWorkingDays();
      }
    };

  const generateHoursForDays = (days: string[]) => {
    return days.map((day) => (
      <Grid item xs={12} key={day}>
        <Box>
          <Typography variant="h6">{day}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={daysState[day].open}
                onChange={() => handleCheckboxChange(day)}
              />
            }
            label="Czynne"
            sx={{ ml: 1 }}
          />
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <TimePicker
                label="Od"
                disabled={daysState[day].open}
                value={daysState[day].startTime}
                onChange={handleTimeChange(day, "startTime")}
                maxTime={daysState[day].endTime ?? undefined}
                sx={{ mr: 1 }}
              />
              <TimePicker
                label="Do"
                disabled={daysState[day].open}
                value={daysState[day].endTime}
                onChange={handleTimeChange(day, "endTime")}
                minTime={daysState[day].startTime ?? undefined}
                sx={{ ml: 1 }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Grid>
    ));
  };

  const [deliveryCosts, setDeliveryCosts] = useState([
    { distance: "", price: "" },
  ]);
  const [deliveryCostsError, setDeliveryCostsError] = useState<string>("");

  const handleAddDeliveryCost = () => {
    setDeliveryCosts([...deliveryCosts, { distance: "", price: "" }]);
  };

  const howManyDeliveryCostsFieldsEmpty = () => {
    let count = 0;
    deliveryCosts.forEach((field) => {
      if (field.distance === "") {
        count++;
      }
      if (field.price === "") {
        count++;
      }
    });
    return count;
  };

  const handleDeliveryCostChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newDeliveryCosts = deliveryCosts.slice();
    newDeliveryCosts[index] = { ...newDeliveryCosts[index], [field]: value };
    setDeliveryCosts(newDeliveryCosts);
  };

  const renderDeliveryCostInputs = () => {
    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography align="center" color="error">
            {deliveryCostsError}&nbsp;
          </Typography>
        </Grid>
        {deliveryCosts.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" variant={"h5"}>
              Brak kosztów dostawy
            </Typography>
          </Grid>
        ) : (
          deliveryCosts.map((cost, index) => (
            <>
              <Grid item xs={5}>
                <TextField
                  label="Max. odległość od restauracji (km)"
                  value={cost.distance}
                  onChange={(e) => {
                    if (
                      howManyDeliveryCostsFieldsEmpty() === 1 &&
                      cost.distance === ""
                    ) {
                      setDeliveryCostsError("");
                    } // just one previously empty field is now filled
                    handleDeliveryCostChange(index, "distance", e.target.value);
                  }}
                  fullWidth
                  sx={{ my: 1 }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setDeliveryCostsError("Wszystkie pola są wymagane");
                    }
                  }}
                  type="number"
                  inputProps={{ min: 1, step: 1 }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Cena"
                  value={cost.price}
                  onChange={(e) => {
                    if (
                      howManyDeliveryCostsFieldsEmpty() === 1 &&
                      cost.price === ""
                    ) {
                      setDeliveryCostsError("");
                    } // just one previously empty field is now filled
                    handleDeliveryCostChange(index, "price", e.target.value);
                  }}
                  fullWidth
                  sx={{ my: 1, textAlign: "center" }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setDeliveryCostsError("Wszystkie pola są wymagane");
                    }
                  }}
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
              <Grid item xs={2} textAlign={"end"}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveDeliveryCost(index)}
                >
                  Usuń
                </Button>
              </Grid>
            </>
          ))
        )}
      </Grid>
    );
  };

  const handleRemoveDeliveryCost = (index: number) => {
    let emptyFieldsInCostIndex = 0;
    if (deliveryCosts[index].distance === "") {
      emptyFieldsInCostIndex++;
    }
    if (deliveryCosts[index].price === "") {
      emptyFieldsInCostIndex++;
    }
    setDeliveryCosts(deliveryCosts.filter((_, i) => i !== index));
    if (howManyDeliveryCostsFieldsEmpty() === emptyFieldsInCostIndex) {
      setDeliveryCostsError("");
    } // just deleted fields was empty
  };

  const summaryContent = (
    <Box sx={{ p: 4 }}>
      <Typography>Nazwa restauracji: {restaurantName}</Typography>
      <Typography>
        Logo: {restaurantLogo ? restaurantLogo.name : "Nie wybrano"}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography>Kod pocztowy: {postalCode}</Typography>
      <Typography>Miasto: {city}</Typography>
      <Typography>Ulica: {street}</Typography>
      <Typography>Nr telefonu: {phoneNumber}</Typography>
      <Typography>Adres e-mail: {email}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography>Godziny otwarcia:</Typography>
      {Object.entries(daysState).map(([day, state]) => (
        <Typography key={day}>
          {day}:{" "}
          {state.open
            ? `${state.startTime?.format("HH:mm")} - ${state.endTime?.format(
                "HH:mm"
              )}`
            : "Zamknięte"}
        </Typography>
      ))}
      <Divider sx={{ my: 2 }} />

      <Typography>Koszty dostawy:</Typography>
      {deliveryCosts.map((cost, index) => (
        <Typography key={`deliveryCost-${index}`}>
          Max. odległość: {cost.distance} km, Cena: {cost.price} zł
        </Typography>
      ))}
    </Box>
  );

  const inputs = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container sx={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                label="Nazwa restauracji"
                fullWidth
                value={restaurantName}
                onChange={(e) => {
                  setRestaurantName(e.target.value);
                  if (e.target.value !== "") {
                    setRestaurantNameError("");
                  }
                }}
                onBlur={() => {
                  setRestaurantNameError(
                    restaurantName === ""
                      ? "Nazwa restauracji jest wymagana"
                      : ""
                  );
                }}
                error={restaurantNameError !== ""}
                helperText={restaurantNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="file-upload"
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    setRestaurantLogo(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="file-upload">
                <Button
                  startIcon={<ImageIcon />}
                  variant="contained"
                  component="span"
                  sx={{ my: 2, py: 1 }}
                >
                  Wybierz logo
                </Button>
                <br />
                <Typography variant="caption" color={"GrayText"}>
                  ({restaurantLogo ? restaurantLogo.name : "Nie wybrano"})
                </Typography>
              </label>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid
            container
            spacing={2}
            sx={{ textAlign: "center" }}
            justifyContent="center"
          >
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                required
                label="Kod pocztowy"
                placeholder="00-000"
                fullWidth
                value={postalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                  let formattedValue = value;
                  if (value.length > 1) {
                    formattedValue = value.slice(0, 2) + "-" + value.slice(2);
                    setPostalCode(formattedValue);
                  } else {
                    setPostalCode(value);
                  }

                  if (validatePostalCode(formattedValue)) {
                    setPostalCodeError("");
                  }
                }}
                onBlur={() => {
                  setPostalCodeError(
                    !validatePostalCode(postalCode)
                      ? "Nieprawidłowy kod pocztowy"
                      : ""
                  );
                }}
                error={postalCodeError !== ""}
                helperText={postalCodeError}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                required
                label="Miasto"
                placeholder="Poznań"
                fullWidth
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (e.target.value !== "") {
                    setCityError("");
                  }
                }}
                onBlur={() => {
                  setCityError(city === "" ? "Miasto jest wymagane" : "");
                }}
                error={cityError !== ""}
                helperText={cityError}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                required
                label="Ulica"
                placeholder="ul. Piotrowo 2"
                fullWidth
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value);
                  if (e.target.value !== "") {
                    setStreetError("");
                  }
                }}
                onBlur={() => {
                  setStreetError(street === "" ? "Ulica jest wymagana" : "");
                }}
                error={streetError !== ""}
                helperText={streetError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                label="Nr telefonu"
                placeholder="123-456-789"
                type="tel"
                fullWidth
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                  let formattedValue = "";
                  if (value.length > 5) {
                    formattedValue =
                      value.slice(0, 3) +
                      "-" +
                      value.slice(3, 6) +
                      "-" +
                      value.slice(6);
                  } else if (value.length > 2) {
                    formattedValue = value.slice(0, 3) + "-" + value.slice(3);
                  } else if (value.length > 0) {
                    formattedValue = value;
                  }
                  setPhoneNumber(formattedValue);
                  if (validatePhoneNumber(formattedValue)) {
                    setPhoneNumberError("");
                  }
                }}
                onBlur={() => {
                  setPhoneNumberError(
                    !validatePhoneNumber(phoneNumber)
                      ? "Nieprawidłowy numer telefonu"
                      : ""
                  );
                }}
                error={phoneNumberError !== ""}
                helperText={phoneNumberError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                label="Adres e-mail"
                placeholder="example@domain.com"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validateEmail(e.target.value)) {
                    setEmailError("");
                  }
                }}
                onBlur={() => {
                  setEmailError(
                    !validateEmail(email) ? "Nieprawidłowy adres email" : ""
                  );
                }}
                error={emailError !== ""}
                helperText={emailError}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={mergeMonToFri}
                  onChange={() => setMergeMonToFri((prev) => !prev)}
                />
              }
              label="Scal dni robocze"
            />
            <Grid container spacing={4} sx={{ textAlign: "center" }}>
              {mergeMonToFri
                ? generateHoursForDays(daysOfWeekAfterMerge)
                : generateHoursForDays(daysOfWeek)}
            </Grid>
          </>
        );
      case 3:
        return (
          <>
            <Grid container>{renderDeliveryCostInputs()}</Grid>
            <Box sx={{ textAlign: "center", my: 2 }}>
              <Button variant="contained" onClick={handleAddDeliveryCost}>
                Dodaj przedział
              </Button>
            </Box>
          </>
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
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Zakończ" : "Następny"}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={openSummary}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Czy chcesz zatwierdzić podane dane?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {summaryContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSummary}>{modalActions[0]}</Button>
          <Button onClick={handleCloseSummary} autoFocus>
            {modalActions[1]}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
