import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  Slider,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { tableReservationApi } from "../../utils/api";
import { LocalTime } from "../../api";

interface TableReservationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const TableReservationModal = ({
  open,
  setOpen,
}: TableReservationModalProps) => {
  const [duration, setDuration] = useState<number>(1);
  const [chosenHour, setChosenHour] = useState<string>("");
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [chosenDate, setChosenDate] = useState<Dayjs | null>();
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [tableReservationLoading, setTableReservationLoading] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!chosenDate) return;
    tableReservationApi
      .getPossibleHoursForDay(
        chosenDate.format("YYYY-MM-DD"),
        duration * 60,
        60,
        peopleCount
      )
      .then((hours) => {
        setAvailableHours(hours.data as string[]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [chosenDate, duration, peopleCount]);

  const getHourSelectLabel = () => {
    if (!chosenDate) {
      return "Wybierz datę rezerwacji";
    } else if (availableHours.length === 0) {
      return "Brak dostępnych godzin";
    } else {
      return "Godzina";
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Nowa rezerwacja</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Dzień rezerwacji"
              value={chosenDate}
              onChange={(newValue: any) => setChosenDate(newValue)}
              sx={{
                mt: 1,
                width: "100%",
              }}
            />
          </LocalizationProvider>
          <br />
          <TextField
            label="Liczba osób"
            type="number"
            value={peopleCount}
            onChange={(e) => setPeopleCount(parseInt(e.target.value))}
            inputProps={{
              min: 1,
              step: 1,
              max: 10,
            }}
          />
          <Typography
            id="duration-slider"
            gutterBottom
            variant="caption"
            sx={{
              mt: 2,
            }}
          >
            Czas trwania rezerwacji
          </Typography>
          <Slider
            value={duration}
            onChange={(_, newValue) => setDuration(newValue as number)}
            aria-labelledby="duration-slider"
            valueLabelDisplay="auto"
            marks={[
              { value: 1, label: "1h" },
              { value: 2, label: "2h" },
              { value: 3, label: "3h" },
            ]}
            min={1}
            max={3}
            step={0.5}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="hour-select-label">
              {getHourSelectLabel()}
            </InputLabel>
            <Select
              labelId="hour-select-label"
              value={chosenHour}
              onChange={(e) => setChosenHour(e.target.value)}
              label={getHourSelectLabel()}
            >
              {availableHours.map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Anuluj</Button>
        <Button
          onClick={() => {
            setTableReservationLoading(true);
            tableReservationApi
              .createReservation({
                day: chosenDate!.format("YYYY-MM-DD"),
                startTime: chosenHour as LocalTime,
                endTime: dayjs(chosenHour, "HH:mm")
                  .add(duration * 60 - 1, "minute")
                  .format("HH:mm:ss") as LocalTime,
                numberOfPeople: peopleCount,
                customerId: user.loginResponse!.customerId,
              })
              .then(() => {
                setTableReservationLoading(false);
                setAvailableHours([]);
                setChosenDate(null);
                setDuration(1);
                setPeopleCount(1);
                setChosenHour("");

                toast.success("Rezerwacja złożona pomyślnie", {
                  position: "bottom-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                setOpen(false);
              })
              .catch((error) => {
                if (typeof error.response.data === "string") {
                  toast.error(error.response.data, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                } else if (typeof error.response.data === "object") {
                  for (const [_, value] of Object.entries(
                    error.response.data
                  )) {
                    toast.error(`${value}`, {
                      position: "bottom-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  }
                }
                setTableReservationLoading(false);
              });
          }}
          color="primary"
          disabled={tableReservationLoading}
        >
          {tableReservationLoading ? <CircularProgress size={24} /> : "Dodaj"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
