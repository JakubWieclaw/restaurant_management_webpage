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
import {
  AutocompleteDistanceService,
  PlaceType,
} from "./AutocompleteDistanceService";
import { changeDeliveryType } from "../../reducers/slices/cartSlice";

interface DeliverySelectionProps {
  setAddress: (address: string) => void;
  checked: string;
  setChecked: (value: string) => void;
  deliveryCost: number | null;
  setDeliveryCost: (value: number) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  value: PlaceType | null;
  setValue: (value: PlaceType | null) => void;
  options: readonly PlaceType[];
  setOptions: (value: readonly PlaceType[]) => void;
}

export enum DeliveryOption {
  Personal = "personal",
  Courier = "courier",
}

export const DeliverySelection: React.FC<DeliverySelectionProps> = ({
  setAddress,
  checked,
  setChecked,
  deliveryCost,
  setDeliveryCost,
  inputValue,
  setInputValue,
  value,
  setValue,
  options,
  setOptions,
}) => {
  const handleToggle = (value: DeliveryOption) => () => {
    if (value === DeliveryOption.Personal) {
      setDeliveryCost(0);
      setAddress(DeliveryOption.Personal);
    } else {
      setAddress("");
    }
    setChecked(value);
    changeDeliveryType(value);
  };

  const [distanceString, setDistanceString] = useState("");
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPricing[]>([]);

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
    if (
      deliveryCost !== null &&
      deliveryCost > 0 &&
      checked === DeliveryOption.Courier &&
      _deliveryCost >= 0
    ) {
      _deliveryCost = deliveryCost;
    }
    setDeliveryCost(_deliveryCost);
    if (_deliveryCost < 0) {
      setAddress("");
    }
  };

  const personalCollection = () => {
    return (
      <ListItem
        key={DeliveryOption.Personal}
        secondaryAction={
          <Radio
            edge="end"
            onChange={handleToggle(DeliveryOption.Personal)}
            checked={checked === DeliveryOption.Personal}
            inputProps={{ "aria-labelledby": DeliveryOption.Personal }}
            name="radio-button"
          />
        }
        sx={{
          "&:hover": {
            bgcolor: "background.default",
          },
        }}
      >
        <ListItemButton onClick={handleToggle(DeliveryOption.Personal)}>
          <ListItemAvatar>
            <Avatar>
              <StorefrontIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            id={DeliveryOption.Personal}
            primary={"Odbiór osobisty"}
            secondary="Cena: 0 zł"
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const courierDelivery = () => {
    return (
      <>
        <ListItem
          key={DeliveryOption.Courier}
          secondaryAction={
            <Radio
              edge="end"
              onChange={handleToggle(DeliveryOption.Courier)}
              checked={checked === DeliveryOption.Courier}
              inputProps={{ "aria-labelledby": DeliveryOption.Courier }}
              name="radio-button"
            />
          }
          sx={{
            "&:hover": {
              bgcolor: "background.default",
            },
          }}
        >
          <ListItemButton onClick={handleToggle(DeliveryOption.Courier)}>
            <ListItemAvatar>
              <Avatar>
                <DeliveryDiningIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id={DeliveryOption.Courier}
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
          {checked === DeliveryOption.Courier &&
            distanceString !== "" &&
            distanceString + " od restauracji"}
        </ListItem>
        <Collapse
          in={checked === DeliveryOption.Courier}
          timeout="auto"
          unmountOnExit
        >
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
                setAddress={setAddress}
                inputValue={inputValue}
                setInputValue={setInputValue}
                value={value}
                setValue={setValue}
                options={options}
                setOptions={setOptions}
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
