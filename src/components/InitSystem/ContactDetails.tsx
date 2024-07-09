import {
  validateEmail,
  validatePhoneNumber,
  validatePostalCode,
} from "../../utils/validations";
import { Grid, TextField } from "@mui/material";

interface ContactDetailsProps {
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
  postalCodeError: string;
  setPostalCodeError: (error: string) => void;
  city: string;
  setCity: (city: string) => void;
  cityError: string;
  setCityError: (error: string) => void;
  street: string;
  setStreet: (street: string) => void;
  streetError: string;
  setStreetError: (error: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  phoneNumberError: string;
  setPhoneNumberError: (error: string) => void;
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  setEmailError: (error: string) => void;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  postalCode,
  setPostalCode,
  postalCodeError,
  setPostalCodeError,
  city,
  setCity,
  cityError,
  setCityError,
  street,
  setStreet,
  streetError,
  setStreetError,
  phoneNumber,
  setPhoneNumber,
  phoneNumberError,
  setPhoneNumberError,
  email,
  setEmail,
  emailError,
  setEmailError,
}) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{ textAlign: "center" }}
      justifyContent="center"
    >
      <Grid item xs={12} sm={4}>
        <TextField
          margin="normal"
          required
          label="Kod pocztowy"
          placeholder="00-000"
          fullWidth
          value={postalCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 5);
            let formattedValue = value;
            if (value.length > 1) {
              formattedValue = value.slice(0, 2) + "-" + value.slice(2);
              setPostalCode(formattedValue);
            } else {
              setPostalCode(value);
            }

            if (validatePostalCode(formattedValue)) {
              setPostalCodeError("");
            }
          }}
          onBlur={() => {
            setPostalCodeError(
              !validatePostalCode(postalCode)
                ? "Nieprawidłowy kod pocztowy"
                : ""
            );
          }}
          error={postalCodeError !== ""}
          helperText={postalCodeError}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="normal"
          required
          label="Miasto"
          placeholder="Poznań"
          fullWidth
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (e.target.value !== "") {
              setCityError("");
            }
          }}
          onBlur={() => {
            setCityError(city === "" ? "Miasto jest wymagane" : "");
          }}
          error={cityError !== ""}
          helperText={cityError}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="normal"
          required
          label="Ulica"
          placeholder="ul. Piotrowo 2"
          fullWidth
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
            if (e.target.value !== "") {
              setStreetError("");
            }
          }}
          onBlur={() => {
            setStreetError(street === "" ? "Ulica jest wymagana" : "");
          }}
          error={streetError !== ""}
          helperText={streetError}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Nr telefonu"
          placeholder="123-456-789"
          type="tel"
          fullWidth
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 9);
            let formattedValue = "";
            if (value.length > 5) {
              formattedValue =
                value.slice(0, 3) +
                "-" +
                value.slice(3, 6) +
                "-" +
                value.slice(6);
            } else if (value.length > 2) {
              formattedValue = value.slice(0, 3) + "-" + value.slice(3);
            } else if (value.length > 0) {
              formattedValue = value;
            }
            setPhoneNumber(formattedValue);
            if (validatePhoneNumber(formattedValue)) {
              setPhoneNumberError("");
            }
          }}
          onBlur={() => {
            setPhoneNumberError(
              !validatePhoneNumber(phoneNumber)
                ? "Nieprawidłowy numer telefonu"
                : ""
            );
          }}
          error={phoneNumberError !== ""}
          helperText={phoneNumberError}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Adres e-mail"
          placeholder="example@domain.com"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validateEmail(e.target.value)) {
              setEmailError("");
            }
          }}
          onBlur={() => {
            setEmailError(
              !validateEmail(email) ? "Nieprawidłowy adres email" : ""
            );
          }}
          error={emailError !== ""}
          helperText={emailError}
        />
      </Grid>
    </Grid>
  );
};
