import { TextField } from "@mui/material";

import { InputProps } from "./Interface";
import { validatePhoneNumber } from "../../utils/validations";

export const PhoneNumber: React.FC<InputProps> = ({
  getValue,
  setValue,
  getError,
  setError,
  helperText,
}) => {
  return (
    <TextField
      margin="normal"
      required
      label="Nr telefonu"
      placeholder="123-456-789"
      type="tel"
      fullWidth
      value={getValue}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          e.preventDefault();
          setValue(getValue.slice(0, -1));
        }
      }}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 9);
        let formattedValue = "";
        if (value.length > 5) {
          formattedValue =
            value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
        } else if (value.length > 2) {
          formattedValue = value.slice(0, 3) + "-" + value.slice(3);
        } else if (value.length > 0) {
          formattedValue = value;
        }
        setValue(formattedValue);
        if (validatePhoneNumber(formattedValue)) {
          setError("");
        }
      }}
      error={getError !== ""}
      helperText={getError || helperText}
    />
  );
};
