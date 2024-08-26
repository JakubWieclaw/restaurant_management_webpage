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
import { AxiosResponse } from "axios";
import { toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  ConfigAddCommand,
  DeliveryPricing,
  LocalTime,
  OpeningHour,
} from "../../api";
import { configApi } from "../../utils/api";
import { Transition } from "../../utils/Transision";
import { WizardContext } from "../../pages/InitSystem";
import { dayToEnum } from "../../utils/dayEnumTranslate";
import { daysOfWeek, daysOfWeekAfterMerge, DayState } from "./OpeningHours";

const modalActions = ["Chcę je poprawić", "Wszystko OK!"];

const handleCloseSummary = (
  e: { target: any },
  modalActions: string[],
  ctx: any,
  navigate: (url: string) => void
) => {
  ctx.setOpenSummary(false);
  if (e.target.textContent === modalActions[1]) {
    let deliveryPricings: DeliveryPricing[] = [];
    ctx.deliveryCosts.forEach((info: DeliveryPricing) => {
      deliveryPricings.push({
        maximumRange: info.maximumRange,
        price: info.price,
      });
    });

    let openingHours: OpeningHour[] = [];
    Object.entries(ctx.daysState as Record<string, DayState>).forEach(
      ([day, state]: [string, DayState]) => {
        if (day !== daysOfWeekAfterMerge[0] && state.open) {
          openingHours.push({
            day: dayToEnum(day),
            openingTime: state.startTime?.format("HH:mm") as LocalTime,
            closingTime: state.endTime?.format("HH:mm") as LocalTime,
          });
        }
      }
    );

    const initData: ConfigAddCommand = {
      restaurantName: ctx.restaurantName,
      logoUrl: ctx.restaurantLogo?.name,
      postalCode: ctx.postalCode,
      city: ctx.city,
      street: ctx.street,
      phoneNumber: ctx.phoneNumber,
      email: ctx.email,
      deliveryPricings: deliveryPricings,
      openingHours: openingHours,
    };

    configApi
      .initializeSystem(initData)
      .then((response: AxiosResponse) => {
        toast.success(response.data, {
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
        navigate("/");
      })
      .catch((error) => {
        // if type of error is string then just show it
        // if type of error is object then iterate over it and show each error
        if (typeof error.response.data === "string") {
          toast.error(error.response.data, {
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
          Object.entries(error.response.data).forEach(([key, value]) => {
            toast.error(key + " - " + value, {
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
          });
        }
      });
  }
}; // Function to close modal

export const FinishModal = () => {
  const navigate = useNavigate();
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
      {ctx.deliveryCosts.length > 0 ? (
        ctx.deliveryCosts.map((cost: DeliveryPricing) => (
          <Typography key={`deliveryCost-${cost.maximumRange}-${cost.price}`}>
            Max. odległość: {cost.maximumRange} km, Cena: {cost.price} zł
          </Typography>
        ))
      ) : (
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
            handleCloseSummary(e, modalActions, ctx, navigate);
          }}
        >
          {modalActions[0]}
        </Button>
        <Button
          onClick={(e) => {
            handleCloseSummary(e, modalActions, ctx, navigate);
          }}
          autoFocus
        >
          {modalActions[1]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
