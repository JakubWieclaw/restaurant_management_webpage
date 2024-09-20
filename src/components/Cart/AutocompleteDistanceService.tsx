import {
  debounce,
  Box,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef } from "react";

import { RootState } from "../../store";

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
export interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

interface AutocompleteDistanceServiceProps {
  setDistanceString: (value: string) => void;
  setAddress: (value: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  value: PlaceType | null;
  setValue: (value: PlaceType | null) => void;
  options: readonly PlaceType[];
  setOptions: (value: readonly PlaceType[]) => void;
}

export const AutocompleteDistanceService: React.FC<
  AutocompleteDistanceServiceProps
> = ({
  setDistanceString,
  setAddress,
  inputValue,
  setInputValue,
  value,
  setValue,
  options,
  setOptions,
}) => {
  const loaded = useRef(false);
  const config = useSelector((state: RootState) => state.config);

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
          origins: [
            config?.config.street +
              ", " +
              config?.config.postalCode +
              " " +
              config?.config.city,
          ],
          destinations: [value?.description],
          travelMode: "DRIVING",
        };

        (distanceMatrixService.current as any).getDistanceMatrix(
          distanceRequest,
          (response: any) => {
            if (response.rows[0].elements[0].status === "OK") {
              console.log(response);
              setAddress(value?.description ?? "");
              setDistanceString(
                response.rows[0].elements[0].distance.text.replace(",", "")
              );
            }
          }
        );
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_API_KEY
        }&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  return (
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
      noOptionsText="Brak wyników"
      onChange={(_: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        console.log(newInputValue);
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Gdzie dostarczyć zamówienie?" fullWidth />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};
