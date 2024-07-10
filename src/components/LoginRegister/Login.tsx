import { Grid, TextField, Button, Link, Divider } from "@mui/material";
import { LoginRegisterState } from "../../pages/LoginRegister";

interface LoginProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setLoginRegisterState: (state: LoginRegisterState) => void;
}

export const Login: React.FC<LoginProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  setLoginRegisterState,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Adres e-mail"
          autoComplete="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Hasło"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            setLoginRegisterState(LoginRegisterState.ForgetPassword);
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
            setLoginRegisterState(LoginRegisterState.Register);
          }}
        >
          {"Nie masz konta? Zarejestruj się"}
        </Link>
      </Grid>
    </>
  );
};
