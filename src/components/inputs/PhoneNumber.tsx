import { TextField } from "@mui/material";
import { validatePhoneNumber } from "../../utils/validations";
import { InputProps } from "./Interface";

export const PhoneNumber: React.FC<InputProps> = ({
  getValue,
  setValue,
  getError,
  setError,
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
      onBlur={() => {
        setError(
          !validatePhoneNumber(getValue) ? "Nieprawidłowy numer telefonu" : ""
        );
      }}
      error={getError !== ""}
      helperText={getError}
    />
  );
};
