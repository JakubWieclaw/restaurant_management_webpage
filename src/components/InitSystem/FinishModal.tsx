import {
  Container,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref } from "react";
import Slide from "@mui/material/Slide";
import { DayState } from "./OpeningHours";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const modalActions = ["Chcę je poprawić", "Wszystko OK!"];

const handleCloseSummary = (
  e: { target: any },
  modalActions: string[],
  setOpenSummary: (open: boolean) => void
) => {
  setOpenSummary(false);
  if (e.target.textContent === modalActions[1]) {
    // if user confirms
    alert("Dane zostały wysłane na serwer");
  }
}; // Function to close modal

interface FinishModalProps {
  openSummary: boolean;
  setOpenSummary: (open: boolean) => void;
  restaurantName: string;
  restaurantLogo: File | null;
  postalCode: string;
  city: string;
  street: string;
  phoneNumber: string;
  email: string;
  daysState: Record<string, DayState>;
  deliveryCosts: { distance: string; price: string }[];
}

export const FinishModal: React.FC<FinishModalProps> = ({
  openSummary,
  setOpenSummary,
  restaurantName,
  restaurantLogo,
  postalCode,
  city,
  street,
  phoneNumber,
  email,
  daysState,
  deliveryCosts,
}) => {
  const summaryContent = (
    <span>
      <Typography variant="h6">Nazwa i logo:</Typography>
      <Typography>Nazwa restauracji: {restaurantName}</Typography>
      <Typography>
        Logo: {restaurantLogo ? restaurantLogo.name : "Nie wybrano"}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Dane kontaktowe:</Typography>

      <Typography>Kod pocztowy: {postalCode}</Typography>
      <Typography>Miasto: {city}</Typography>
      <Typography>Ulica: {street}</Typography>
      <Typography>Nr telefonu: {phoneNumber}</Typography>
      <Typography>Adres e-mail: {email}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Godziny otwarcia:</Typography>
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

      <Typography variant="h6">Koszty dostawy:</Typography>
      {deliveryCosts.map((cost, index) => (
        <Typography key={`deliveryCost-${index}`}>
          Max. odległość: {cost.distance} km, Cena: {cost.price} zł
        </Typography>
      ))}
    </span>
  );
  return (
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
      <DialogContent id="alert-dialog-description">
        {summaryContent}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            handleCloseSummary(e, modalActions, setOpenSummary);
          }}
        >
          {modalActions[0]}
        </Button>
        <Button
          onClick={(e) => {
            handleCloseSummary(e, modalActions, setOpenSummary);
          }}
          autoFocus
        >
          {modalActions[1]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
