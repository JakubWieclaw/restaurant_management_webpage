import { TextField } from "@mui/material";
import { InputProps } from "./Interface";
import { validatePostalCode } from "../../utils/validations";

export const PostalCode: React.FC<InputProps> = ({
  getValue,
  setValue,
  getError,
  setError,
}) => {
  return (
    <TextField
      margin="normal"
      required
      label="Kod pocztowy"
      placeholder="00-000"
      fullWidth
      value={getValue}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 5);
        let formattedValue = value;
        if (value.length > 1) {
          formattedValue = value.slice(0, 2) + "-" + value.slice(2);
          setValue(formattedValue);
        } else {
          setValue(value);
        }

        if (validatePostalCode(formattedValue)) {
          setError("");
        }
      }}
      error={getError !== ""}
      helperText={getError}
    />
  );
};
