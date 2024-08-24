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
  ctx: any
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
          let openingTime: LocalTime;
          openingTime = {
            hour: state.startTime?.hour() ?? 0,
            minute: state.startTime?.minute() ?? 0,
          };

          let closingTime: LocalTime;
          closingTime = {
            hour: state.endTime?.hour() ?? 0,
            minute: state.endTime?.minute() ?? 0,
            second: 0,
            nano: 0,
          };

          openingHours.push({
            day: dayToEnum(day),
            openingTime,
            closingTime,
          });
        }
      }
    );

    const initData: ConfigAddCommand = {
      restaurantName: ctx.restaurantName,
      // logo: ctx.restaurantLogo,
      // postalCode: ctx.postalCode,
      postalCode: ctx.postalCode.replace(/-/g, ""),
      city: ctx.city,
      street: ctx.street,
      //  remove - from ctx.phoneNumber,
      phoneNumber: ctx.phoneNumber.replace(/-/g, ""),
      email: ctx.email,
      deliveryPricings: deliveryPricings,
      openingHours: openingHours,
    };

    console.log(initData);

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
      })
      .catch((error) => {
        console.log(error);
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
      });
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
            handleCloseSummary(e, modalActions, ctx);
          }}
        >
          {modalActions[0]}
        </Button>
        <Button
          onClick={(e) => {
            handleCloseSummary(e, modalActions, ctx);
          }}
          autoFocus
        >
          {modalActions[1]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
