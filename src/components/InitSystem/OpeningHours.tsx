import {
  FormControlLabel,
  Grid,
  Switch,
  Box,
  Typography,
  Checkbox,
} from "@mui/material";

import { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export const daysOfWeek = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
]; // do not change order

export const daysOfWeekAfterMerge = [
  "Poniedziałek - Piątek",
  "Sobota",
  "Niedziela",
]; // do not change order

const changeAllWorkingDays = ({ setDaysState }: { setDaysState: any }) => {
  setDaysState((prevState: { [x: string]: any }) => {
    const updatedState = { ...prevState };
    for (const workDay of daysOfWeek.slice(0, 5)) {
      updatedState[workDay] = { ...prevState[daysOfWeekAfterMerge[0]] };
    }
    return updatedState;
  });
};

const handleCheckboxChange = (day: string, setDaysState: any) => {
  setDaysState((prevState: { [x: string]: any }) => ({
    ...prevState,
    [day]: {
      ...prevState[day],
      open: !prevState[day].open,
    },
  }));
  if (day === daysOfWeekAfterMerge[0]) {
    changeAllWorkingDays({ setDaysState });
  }
};

const handleTimeChange =
  (day: string, type: "startTime" | "endTime", setDaysState: any) =>
  (newValue: Dayjs | null) => {
    setDaysState((prevState: { [x: string]: any }) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [type]: newValue,
      },
    }));
    if (day === daysOfWeekAfterMerge[0]) {
      changeAllWorkingDays({ setDaysState });
    }
  };

const generateHoursForDays = (
  days: string[],
  daysState: any,
  setDaysState: any
) => {
  return days.map((day) => (
    <Grid item xs={12} key={day}>
      <Box>
        <Typography variant="h6">{day}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={daysState[day].open}
              onChange={() => handleCheckboxChange(day, setDaysState)}
            />
          }
          label="Czynne"
          sx={{ ml: 1 }}
        />
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <TimePicker
              label="Od"
              disabled={!daysState[day].open}
              value={daysState[day].startTime}
              onChange={handleTimeChange(day, "startTime", setDaysState)}
              maxTime={daysState[day].endTime ?? undefined}
              sx={{ mr: 1 }}
            />
            <TimePicker
              label="Do"
              disabled={!daysState[day].open}
              value={daysState[day].endTime}
              onChange={handleTimeChange(day, "endTime", setDaysState)}
              minTime={daysState[day].startTime ?? undefined}
              sx={{ ml: 1 }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
    </Grid>
  ));
};

export type DayState = {
  open: boolean;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
};

export const initialDayState: DayState = {
  open: true,
  startTime: null,
  endTime: null,
};

interface OpeningHoursProps {
  mergeMonToFri: boolean;
  setMergeMonToFri: any;
  daysState: any;
  setDaysState: any;
}

export const OpeningHours: React.FC<OpeningHoursProps> = ({
  mergeMonToFri,
  setMergeMonToFri,
  daysState,
  setDaysState,
}) => {
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={mergeMonToFri}
            onChange={() => {
              setMergeMonToFri((prev: boolean) => !prev);
            }}
          />
        }
        label="Scal dni robocze"
      />
      <Grid container spacing={4} sx={{ textAlign: "center" }}>
        {mergeMonToFri
          ? generateHoursForDays(daysOfWeekAfterMerge, daysState, setDaysState)
          : generateHoursForDays(daysOfWeek, daysState, setDaysState)}
      </Grid>
    </>
  );
};
