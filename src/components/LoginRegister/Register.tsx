import {
  Button,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

import { useContext } from "react";

import { authContext, LoginRegisterState } from "../../pages/LoginRegister";

export const Register = () => {
  const ctx = useContext(authContext);

  const CustomHelperTextLength = styled(FormHelperText)({
    color: ctx.password.length < 8 ? "red" : "green",
  });
  const CustomHelperTextRepeat = styled(FormHelperText)({
    color:
      ctx.password.length < 8 || ctx.password !== ctx.passwordRepeat
        ? "red"
        : "green",
  });
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
        <TextField
          margin="normal"
          required
          label="Hasło"
          type="password"
          autoComplete="current-password"
          fullWidth
          value={ctx.password}
          onChange={(e) => ctx.setPassword(e.target.value)}
          helperText={
            <CustomHelperTextLength>
              Hasło musi mieć co najmniej 8 znaków
            </CustomHelperTextLength>
          }
          inputProps={{
            minLength: 8,
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
          helperText={
            <CustomHelperTextRepeat>
              Hasło musi być takie samo jak powyżej
            </CustomHelperTextRepeat>
          }
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
