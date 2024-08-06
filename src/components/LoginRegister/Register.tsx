import {
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import { useContext, useState } from "react";

import { authContext, LoginRegisterState } from "../../pages/LoginRegister";
import { PhoneNumber } from "../inputs/PhoneNumber";

export const Register = () => {
  const ctx = useContext(authContext);
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const minPasswordLength = 3;

  return (
    <>
      <Grid item xs={6}>
        <TextField
          margin="normal"
          required
          label="Imię"
          fullWidth
          value={ctx.name}
          onChange={(e) => ctx.setName(e.target.value)}
        ></TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          margin="normal"
          required
          label="Nazwisko"
          fullWidth
          value={ctx.surname}
          onChange={(e) => ctx.setSurname(e.target.value)}
        ></TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Adres e-mail"
          autoComplete="email"
          type="email"
          fullWidth
          value={ctx.email}
          onChange={(e) => ctx.setEmail(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <PhoneNumber
          setValue={ctx.setPhoneNumber}
          getValue={ctx.phoneNumber}
          setError={setPhoneNumberError}
          getError={phoneNumberError}
          helperText={"Numer telefonu musi być w formacie 123-456-789"}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Hasło"
          type="password"
          autoComplete="current-password"
          fullWidth
          value={ctx.password}
          onChange={(e) => ctx.setPassword(e.target.value)}
          error={
            ctx.password.length < minPasswordLength && ctx.password.length > 0
          }
          helperText={`Hasło musi mieć co najmniej ${minPasswordLength} znaki`}
          inputProps={{
            minLength: minPasswordLength,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Powtórz hasło"
          type="password"
          autoComplete="current-password"
          fullWidth
          value={ctx.passwordRepeat}
          onChange={(e) => ctx.setPasswordRepeat(e.target.value)}
          error={
            (ctx.password.length < minPasswordLength ||
              ctx.password !== ctx.passwordRepeat) &&
            ctx.passwordRepeat.length > 0
          }
          helperText={"Hasło musi być takie samo jak powyżej"}
        />
      </Grid>
      <Grid item xs={4}>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Zarejestruj się
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="overline"
          sx={{
            fontSize: "0.7rem",
          }}
        >
          Klikając przycisk "Zarejestruj się" zgadzasz się z naszymi warunkami
          korzystania z usługi oraz polityką prywatności.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Link
          href="#"
          variant="body2"
          onClick={() => {
            ctx.setLoginRegisterState(LoginRegisterState.Login);
          }}
        >
          {"Masz konto? Zaloguj się"}
        </Link>
      </Grid>
    </>
  );
};
