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
  street: string;
  setStreet: (street: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  phoneNumberError: string;
  setPhoneNumberError: (error: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  postalCode,
  setPostalCode,
  postalCodeError,
  setPostalCodeError,
  city,
  setCity,
  street,
  setStreet,
  phoneNumber,
  setPhoneNumber,
  phoneNumberError,
  setPhoneNumberError,
  email,
  setEmail,
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
          value={street}
          onChange={(e) => {
            setStreet(e.target.value);
          }}
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
          }}
        />
      </Grid>
    </Grid>
  );
};
