import { Grid, TextField } from "@mui/material";
import { PhoneNumber } from "../inputs/PhoneNumber";
import { PostalCode } from "../inputs/PostalCode";
import { useContext } from "react";
import { WizardContext } from "../../pages/InitSystem";
import {
  validatePhoneNumber,
  validatePostalCode,
} from "../../utils/validations";

export const validateContactDetails = (
  postalCode: string,
  setPostalCodeError: (err: string) => void,
  phoneNumber: string,
  setPhoneNumberError: (err: string) => void
) => {
  if (!validatePostalCode(postalCode)) {
    setPostalCodeError("Nieprawidłowy kod pocztowy");
    return true;
  } else {
    setPostalCodeError("");
  }

  if (!validatePhoneNumber(phoneNumber)) {
    setPhoneNumberError("Nieprawidłowy numer telefonu");
    return true;
  } else {
    setPhoneNumberError("");
  }
  return false;
};

export const ContactDetails = () => {
  const ctx = useContext(WizardContext);

  return (
    <Grid
      container
      spacing={2}
      sx={{ textAlign: "center" }}
      justifyContent="center"
    >
      <Grid item xs={12} sm={4}>
        <PostalCode
          getValue={ctx.postalCode}
          setValue={ctx.setPostalCode}
          getError={ctx.postalCodeError}
          setError={ctx.setPostalCodeError}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="normal"
          required
          label="Miasto"
          placeholder="Poznań"
          fullWidth
          value={ctx.city}
          onChange={(e) => {
            ctx.setCity(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="normal"
          required
          label="Ulica"
          placeholder="ul. Piotrowo 2"
          fullWidth
          value={ctx.street}
          onChange={(e) => {
            ctx.setStreet(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <PhoneNumber
          getValue={ctx.phoneNumber}
          setValue={ctx.setPhoneNumber}
          getError={ctx.phoneNumberError}
          setError={ctx.setPhoneNumberError}
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
          value={ctx.email}
          onChange={(e) => {
            ctx.setEmail(e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
};
