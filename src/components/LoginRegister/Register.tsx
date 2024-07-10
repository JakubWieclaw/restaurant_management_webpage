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

import { LoginRegisterState } from "../../pages/LoginRegister";

interface RegisterProps {
  name: string;
  setName: (name: string) => void;
  surname: string;
  setSurname: (surname: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  passwordRepeat: string;
  setPasswordRepeat: (repeatPassword: string) => void;
  setLoginRegisterState: (state: LoginRegisterState) => void;
}

export const Register: React.FC<RegisterProps> = ({
  name,
  setName,
  surname,
  setSurname,
  email,
  setEmail,
  password,
  setPassword,
  passwordRepeat,
  setPasswordRepeat,
  setLoginRegisterState,
}) => {
  const CustomHelperTextLength = styled(FormHelperText)({
    color: password.length < 8 ? "red" : "green",
  });
  const CustomHelperTextRepeat = styled(FormHelperText)({
    color: password.length < 8 || password !== passwordRepeat ? "red" : "green",
  });
  return (
    <>
      <Grid item xs={6}>
        <TextField
          margin="normal"
          required
          label="Imię"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          margin="normal"
          required
          label="Nazwisko"
          fullWidth
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
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
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
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
            setLoginRegisterState(LoginRegisterState.Login);
          }}
        >
          {"Masz konto? Zaloguj się"}
        </Link>
      </Grid>
    </>
  );
};
