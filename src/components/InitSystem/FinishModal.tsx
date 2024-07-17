import {
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useContext } from "react";

import { Transition } from "../Transision";
import { WizardContext } from "../../pages/InitSystem";
import { daysOfWeek, daysOfWeekAfterMerge } from "./OpeningHours";

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

export const FinishModal = () => {
  const ctx = useContext(WizardContext);

  const summaryContent = (
    <span>
      <Typography variant="h6">Nazwa i logo:</Typography>
      <Typography>Nazwa restauracji: {ctx.restaurantName}</Typography>
      <Typography>
        Logo: {ctx.restaurantLogo ? ctx.restaurantLogo.name : "Nie wybrano"}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Dane kontaktowe:</Typography>

      <Typography>Kod pocztowy: {ctx.postalCode}</Typography>
      <Typography>Miasto: {ctx.city}</Typography>
      <Typography>Ulica: {ctx.street}</Typography>
      <Typography>Nr telefonu: {ctx.phoneNumber}</Typography>
      <Typography>Adres e-mail: {ctx.email}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Godziny otwarcia:</Typography>
      {ctx.mergeMonToFri
        ? Object.entries(ctx.daysState)
            .filter(([day]) => daysOfWeekAfterMerge.includes(day))
            .map(([day, state]: [string, any]) => (
              <Typography key={day}>
                {day}:{" "}
                {state.open
                  ? `${state.startTime?.format(
                      "HH:mm"
                    )} - ${state.endTime?.format("HH:mm")}`
                  : "Zamknięte"}
              </Typography>
            ))
        : Object.entries(ctx.daysState)
            .filter(([day]) => daysOfWeek.includes(day))
            .map(([day, state]: [string, any]) => (
              <Typography key={day}>
                {day}:{" "}
                {state.open
                  ? `${state.startTime?.format(
                      "HH:mm"
                    )} - ${state.endTime?.format("HH:mm")}`
                  : "Zamknięte"}
              </Typography>
            ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Koszty dostawy:</Typography>
      {ctx.deliveryCosts.map(
        (cost: { distance: number; price: number }, index: number) => (
          <Typography key={`deliveryCost-${index}`}>
            Max. odległość: {cost.distance} km, Cena: {cost.price} zł
          </Typography>
        )
      )}
      {ctx.deliveryCosts.length === 0 && (
        <Typography>Brak kosztów dostawy</Typography>
      )}
    </span>
  );
  return (
    <Dialog
      open={ctx.openSummary}
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
            handleCloseSummary(e, modalActions, ctx.setOpenSummary);
          }}
        >
          {modalActions[0]}
        </Button>
        <Button
          onClick={(e) => {
            handleCloseSummary(e, modalActions, ctx.setOpenSummary);
          }}
          autoFocus
        >
          {modalActions[1]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
