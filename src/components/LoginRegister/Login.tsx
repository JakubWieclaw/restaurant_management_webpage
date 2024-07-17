import { Grid, TextField, Button, Link, Divider } from "@mui/material";

import { useContext } from "react";

import { authContext, LoginRegisterState } from "../../pages/LoginRegister";

export const Login = () => {
  const ctx = useContext(authContext);

  return (
    <>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Adres e-mail"
          autoComplete="email"
          type="email"
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
          value={ctx.password}
          onChange={(e) => ctx.setPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={4}>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Zaloguj się
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Link
          href="#"
          variant="body2"
          onClick={() => {
            ctx.setLoginRegisterState(LoginRegisterState.ForgetPassword);
          }}
        >
          {"Nie pamiętasz hasła?"}
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Link
          href="#"
          variant="body2"
          onClick={() => {
            ctx.setLoginRegisterState(LoginRegisterState.Register);
          }}
        >
          {"Nie masz konta? Zarejestruj się"}
        </Link>
      </Grid>
    </>
  );
};
