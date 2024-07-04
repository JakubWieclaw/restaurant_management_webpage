import { FormControlLabel, Grid, Switch } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ImageIcon from "@mui/icons-material/Image";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import Checkbox from "@mui/material/Checkbox";
import { Dayjs } from "dayjs";

export function InitSystem() {
  const steps = [
    "Nazwa i logo",
    "Dane kontaktowe",
    "Godziny otwarcia",
    "Koszty dostawy",
    "Podsumowanie (modal?)",
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

  const [activeStep, setActiveStep] = useState<number>(0);
  const [mergeMonToFri, setMergeMonToFri] = useState<boolean>(true);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [daysState, setDaysState] = useState<Record<string, DayState>>(
    daysOfWeek.concat(daysOfWeekAfterMerge).reduce((acc, day) => {
      acc[day] = { ...initialDayState };
      return acc;
    }, {} as Record<string, DayState>)
  );

  const changeAllWorkingDays = () => {
    for (const workDay of daysOfWeek.slice(0, 5)) {
      setDaysState((prevState) => ({
        ...prevState,
        [workDay]: {
          ...prevState[daysOfWeekAfterMerge[0]],
        },
      }));
    }
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
      // if Monday - Friday was changed then change all these days too
      changeAllWorkingDays();
    }
  };

  const handleTimeChange = (day: string, type: "startTime" | "endTime") => {
    return (newValue: Dayjs | null) => {
      setDaysState((prevState) => ({
        ...prevState,
        [day]: {
          ...prevState[day],
          [type]: newValue,
        },
      }));
      if (day === daysOfWeekAfterMerge[0]) {
        // if Monday - Friday was changed then change all these days too
        changeAllWorkingDays();
      }
    };
  };

  const generateHoursForDays = (days: string[]) => {
    return days.map((day) => (
      <Grid item xs={12} key={day}>
        <Box sx={{ marginY: 1 }}>
          <Typography variant="h6">{day}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={daysState[day].open}
                onChange={() => {
                  handleCheckboxChange(day);
                }}
              />
            }
            label="Czynne"
            sx={{ marginLeft: 1 }}
          />
          <Box sx={{ marginY: 1 }}></Box>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            {daysState[day].open ? (
              <>
                <TimePicker
                  label="Od"
                  value={daysState[day].startTime}
                  onChange={handleTimeChange(day, "startTime")}
                  maxTime={daysState[day].endTime ?? undefined}
                />
                <TimePicker
                  label="Do"
                  value={daysState[day].endTime}
                  onChange={handleTimeChange(day, "endTime")}
                  minTime={daysState[day].startTime ?? undefined}
                />
              </>
            ) : (
              <>
                <TimePicker
                  disabled
                  label="Od"
                  value={daysState[day].startTime}
                  onChange={handleTimeChange(day, "startTime")}
                />
                <TimePicker
                  disabled
                  label="Do"
                  value={daysState[day].endTime}
                  onChange={handleTimeChange(day, "endTime")}
                  minTime={daysState[day].startTime ?? undefined}
                />
              </>
            )}
          </LocalizationProvider>
        </Box>
      </Grid>
    ));
  };

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
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <input accept="image/*" id="file-upload" type="file" hidden />
              <label htmlFor="file-upload">
                <Button
                  startIcon={<ImageIcon />}
                  variant="contained"
                  component="span"
                  sx={{ marginY: 2, paddingY: 1 }}
                >
                  Wybierz logo *
                </Button>
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
            justifyContent={"center"}
          >
            <Grid item xs={3}>
              <TextField
                margin="normal"
                required
                label="Kod pocztowy"
                placeholder="00-000"
                autoFocus
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="normal"
                required
                label="Miasto"
                placeholder="Poznań"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                margin="normal"
                required
                label="Ulica"
                placeholder="ul. Piotrowo 2"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                label="Nr telefonu"
                placeholder="+48 123-456-789"
                type="tel"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                label="Adres e-mail"
                placeholder="restauracja@example.com"
                type="email"
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Scal dni robocze"
              onChange={() => setMergeMonToFri((prev) => !prev)}
            />
            <Grid container spacing={4} sx={{ textAlign: "center" }}>
              {mergeMonToFri
                ? generateHoursForDays(daysOfWeekAfterMerge)
                : generateHoursForDays(daysOfWeek)}
            </Grid>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      <Box component="h1">Wprowadź dane dotyczące restauracji</Box>
      <Divider orientation="horizontal" flexItem />
      <Stepper activeStep={activeStep} sx={{ paddingY: 5 }}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box>{inputs(activeStep)}</Box>
      <Box sx={{ textAlign: "center" }}>
        <Grid container sx={{ paddingY: 5 }}>
          <Grid item xs={6}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Poprzedni
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Zakończ" : "Następny"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
