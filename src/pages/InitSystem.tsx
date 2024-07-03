import { FormControlLabel, Grid, Switch } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ImageIcon from "@mui/icons-material/Image";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { useState, Fragment } from "react";
import { MuiFileInput } from "mui-file-input";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { CheckBox } from "@mui/icons-material";

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
  ];

  const [activeStep, setActiveStep] = useState<number>(0);
  const [mergeMonToFir, setMergeMonToFir] = useState<boolean>(true);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
              {/* <MuiFileInput
                id="file-upload"
                label="Wybierz logo"
                clearIconButtonProps={{
                  title: "Remove",
                  children: <ImageIcon />,
                }}
                InputProps={{
                  inputProps: {
                    accept: "image/*",
                  },
                }}
              /> */}
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
              onChange={() => setMergeMonToFir((prev) => !prev)}
            />
            <Grid container spacing={4} sx={{ textAlign: "center" }}>
              {!mergeMonToFir ? (
                daysOfWeek.map((day) => (
                  <Grid item xs={12} key={day}>
                    <Box sx={{ marginY: 1 }}>
                      <Typography variant="h6">{day}</Typography>
                      <FormControlLabel
                        control={<CheckBox />}
                        label="Czynne"
                        sx={{ marginLeft: 1 }}
                      />
                      <Box sx={{ marginY: 1 }}></Box>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="de"
                      >
                        <TimePicker label="Od" />
                        <TimePicker label="Do" />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                ))
              ) : (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6">Poniedziałek - Piątek</Typography>
                    <FormControlLabel
                      control={<CheckBox />}
                      label="Czynne"
                      sx={{ marginLeft: 1 }}
                    />
                    <Box sx={{ marginY: 1 }}></Box>

                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="de"
                    >
                      <TimePicker label="Od" />
                      <TimePicker label="Do" />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">Sobota</Typography>
                    <FormControlLabel
                      control={<CheckBox />}
                      label="Czynne"
                      sx={{ marginLeft: 1 }}
                    />
                    <Box sx={{ marginY: 1 }}></Box>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="de"
                    >
                      <TimePicker label="Od" />
                      <TimePicker label="Do" />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">Niedziela</Typography>
                    <FormControlLabel
                      control={<CheckBox />}
                      label="Czynne"
                      sx={{ marginLeft: 1 }}
                    />
                    <Box sx={{ marginY: 1 }}></Box>

                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="de"
                    >
                      <TimePicker label="Od" />
                      <TimePicker label="Do" />
                    </LocalizationProvider>
                  </Grid>
                </>
              )}
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
        {steps.map((label, index) => {
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
