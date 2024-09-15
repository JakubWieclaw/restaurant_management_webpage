import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Radio,
  Collapse,
  Typography,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";

import { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

import { configApi } from "../../utils/api";
import { DeliveryPricing } from "../../api";
import { AutocompleteDistanceService } from "./AutocompleteDistanceService";

export const DeliverySelection = () => {
  const handleToggle = (value: string) => () => {
    setChecked(value);
  };

  const [checked, setChecked] = useState("");
  const [distanceString, setDistanceString] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPricing[]>([]);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);

  useEffect(() => {
    configApi
      .getDeliveryPrices()
      .then((response: AxiosResponse) => {
        setDeliveryPrices(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const calculateDeliveryPrice = (distance: number) => {
    const deliveryPricesCopy = [...deliveryPrices];
    deliveryPricesCopy.sort((a, b) => b.maximumRange - a.maximumRange);
    let _deliveryCost = -1; // default value for no delivery
    if (deliveryPricesCopy.length === 0) {
      _deliveryCost = 0; // default value for no delivery prices - free delivery
    } else {
      for (const price of deliveryPricesCopy) {
        if (distance <= price.maximumRange) {
          _deliveryCost = price.price;
        }
      }
    }
    setDeliveryCost(_deliveryCost);
  };

  const personalCollection = () => {
    const deliveryType = "personal";

    return (
      <ListItem
        key={deliveryType}
        secondaryAction={
          <Radio
            edge="end"
            onChange={handleToggle(deliveryType)}
            checked={checked === deliveryType}
            inputProps={{ "aria-labelledby": deliveryType }}
            name="radio-button"
          />
        }
        sx={{
          "&:hover": {
            bgcolor: "background.default",
          },
        }}
      >
        <ListItemButton onClick={handleToggle(deliveryType)}>
          <ListItemAvatar>
            <Avatar>
              <StorefrontIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            id={deliveryType}
            primary={"Odbiór osobisty"}
            secondary="Cena: 0 zł"
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const courierDelivery = () => {
    const deliveryType = "courier";

    return (
      <>
        <ListItem
          key={deliveryType}
          secondaryAction={
            <Radio
              edge="end"
              onChange={handleToggle(deliveryType)}
              checked={checked === deliveryType}
              inputProps={{ "aria-labelledby": deliveryType }}
              name="radio-button"
            />
          }
          sx={{
            "&:hover": {
              bgcolor: "background.default",
            },
          }}
        >
          <ListItemButton onClick={handleToggle(deliveryType)}>
            <ListItemAvatar>
              <Avatar>
                <DeliveryDiningIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id={deliveryType}
              primary={"Dostawa kurierem"}
              secondary={
                deliveryCost === null ? (
                  "Wybierz miejsce dostawy"
                ) : deliveryCost < 0 ? (
                  <Typography color="error">
                    Brak dostawy w tej lokalizacji
                  </Typography>
                ) : (
                  "Cena: " + deliveryCost.toFixed(2) + " zł"
                )
              }
            />
          </ListItemButton>
          {checked === deliveryType &&
            distanceString !== "" &&
            distanceString + " od restauracji"}
        </ListItem>
        <Collapse in={checked === deliveryType} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              key="autocomplete"
              sx={{
                display: "flex",
                justifyContent: "center",
                bgcolor: "background.default",
              }}
            >
              <AutocompleteDistanceService
                setDistanceString={(distanceStr: string) => {
                  setDistanceString(distanceStr);
                  if (distanceStr && distanceStr !== "") {
                    const distance = parseFloat(distanceStr.split(" ")[0]);
                    calculateDeliveryPrice(distance);
                  }
                }}
              />
            </ListItem>
          </List>
        </Collapse>
      </>
    );
  };

  const listItems = [personalCollection(), courierDelivery()];

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {listItems.map((item) => (
        <>
          {item}
          {item !== listItems[listItems.length - 1] && (
            <Divider variant="inset" component="li" />
          )}
        </>
      ))}
    </List>
  );
};
