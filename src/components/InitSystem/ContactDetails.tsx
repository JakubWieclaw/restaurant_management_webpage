import { validateEmail } from "../../utils/validations";
import { Grid, TextField } from "@mui/material";
import { PhoneNumber } from "../inputs/PhoneNumber";
import { PostalCode } from "../inputs/PostalCode";

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
        <PostalCode
          getValue={postalCode}
          setValue={setPostalCode}
          getError={postalCodeError}
          setError={setPostalCodeError}
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
        <PhoneNumber
          getValue={phoneNumber}
          setValue={setPhoneNumber}
          getError={phoneNumberError}
          setError={setPhoneNumberError}
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
