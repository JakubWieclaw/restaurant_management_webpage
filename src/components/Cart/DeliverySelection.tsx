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
  TextField,
  Autocomplete,
  Grid,
  Typography,
  Box,
  debounce,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";

import { useState, useEffect, useRef, useMemo } from "react";
import parse from "autosuggest-highlight/parse";

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };
const distanceMatrixService = { current: null };

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

export const DeliverySelection = () => {
  const [checked, setChecked] = useState("");
  const GOOGLE_MAPS_API_KEY = "AIzaSyBG7OWAdoQa2okgLIYoA4V1QM23lOSak5I";

  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const distance = useRef(0);
  const [distanceString, setDistanceString] = useState("");
  const loaded = useRef(false);

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          );
        },
        400
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
    }

    if (!distanceMatrixService.current && (window as any).google) {
      distanceMatrixService.current = new (
        window as any
      ).google.maps.DistanceMatrixService();
    }

    if (!autocompleteService.current || !distanceMatrixService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);

        const distanceRequest = {
          origins: ["ul. Harcerska 41a/1, 63-000 Środa Wielkopolska"],
          destinations: [value?.description],
          travelMode: "DRIVING",
        };

        (distanceMatrixService.current as any).getDistanceMatrix(
          distanceRequest,
          (response: any) => {
            if (response.rows[0].elements[0].status === "OK") {
              distance.current =
                response.rows[0].elements[0].distance.value / 1000;
              setDistanceString(response.rows[0].elements[0].distance.text);
            }
          }
        );
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleToggle = (value: string) => () => {
    setChecked(value);
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
            secondary="Cena: 0.00 zł"
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const courierDelivery = () => {
    const deliveryType = "courier";

    if (typeof window !== "undefined" && !loaded.current) {
      if (!document.querySelector("#google-maps")) {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
          document.querySelector("head"),
          "google-maps"
        );
      }

      loaded.current = true;
    }

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
              secondary="Cena: Zależna od odległości"
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
              <Autocomplete
                sx={{ width: 400 }}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.description
                }
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                noOptionsText="No locations"
                onChange={(_: any, newValue: PlaceType | null) => {
                  setOptions(newValue ? [newValue, ...options] : options);
                  setValue(newValue);
                }}
                onInputChange={(_, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gdzie dostarczyć zamówienie?"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const matches =
                    option.structured_formatting.main_text_matched_substrings ||
                    [];

                  const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match: any) => [
                      match.offset,
                      match.offset + match.length,
                    ])
                  );
                  return (
                    <li key={key + "1"} {...optionProps}>
                      <Grid container sx={{ alignItems: "center" }}>
                        <Grid item sx={{ display: "flex", width: 44 }}>
                          <LocationOnIcon sx={{ color: "text.secondary" }} />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: "calc(100% - 44px)",
                            wordWrap: "break-word",
                          }}
                        >
                          {parts.map((part, index) => (
                            <Box
                              key={index}
                              component="span"
                              sx={{
                                fontWeight: part.highlight ? "bold" : "regular",
                              }}
                            >
                              {part.text}
                            </Box>
                          ))}
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {option.structured_formatting.secondary_text}
                          </Typography>
                        </Grid>
                      </Grid>
                    </li>
                  );
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
