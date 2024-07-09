import {
  Container,
  Box,
  Typography,
  TextField,
  FormHelperText,
  Divider,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { Transition } from "../components/Transision";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import { useState } from "react";

// It's terribly disugsting solution
// It was late night
// I'm not proud of it
// I'm sorry for that
// To fix

export function LoginRegister() {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const [forgetPassword, setForgetPassword] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (forgetPassword) {
      // Reset password
    }
  };

  const CustomHelperTextLength = styled(FormHelperText)({
    color: password.length < 8 ? "red" : "green",
  });
  const CustomHelperTextRepeat = styled(FormHelperText)({
    color: password.length < 8 || password !== passwordRepeat ? "red" : "green",
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 15 }}>
      <Box component={"form"} onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          sx={{ textAlign: "center" }}
          justifyContent="center"
        >
          <Grid item xs={12}>
            <Box
              component={"img"}
              src="/icons8-restaurant.svg"
              sx={{
                width: "20%",
              }}
            ></Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">System Zarządzania Restauracją</Typography>
          </Grid>
          {isRegister && (
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
            </>
          )}

          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              label="Adres e-mail"
              autoComplete="email"
              type="email"
              fullWidth={isRegister}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
          </Grid>
          {!forgetPassword && (
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                label="Hasło"
                type="password"
                autoComplete="current-password"
                fullWidth={isRegister}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText={
                  isRegister ? (
                    <CustomHelperTextLength>
                      Hasło musi mieć co najmniej 8 znaków
                    </CustomHelperTextLength>
                  ) : (
                    ""
                  )
                }
                inputProps={{
                  minLength: 8,
                }}
              />
            </Grid>
          )}

          {isRegister && (
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
                  isRegister ? (
                    <CustomHelperTextRepeat>
                      Hasło musi być takie samo jak powyżej
                    </CustomHelperTextRepeat>
                  ) : (
                    ""
                  )
                }
              />
            </Grid>
          )}
          <Grid item xs={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                if (forgetPassword) {
                  setOpenDialog(true);
                }
              }}
            >
              {forgetPassword
                ? "Resetuj hasło"
                : isRegister
                ? "Zarejestruj się"
                : "Zaloguj się"}
            </Button>
          </Grid>
          {isRegister && (
            <Grid item xs={12}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: "0.7rem",
                }}
              >
                Klikając przycisk "Zarejestruj się" zgadzasz się z naszymi
                warunkami korzystania z usługi oraz polityką prywatności.
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>
          {forgetPassword ? (
            <>
              <Grid item xs={12}>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    setIsRegister(false);
                    setForgetPassword(false);
                  }}
                >
                  {"Masz już konto? Zaloguj się"}
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    setIsRegister(true);
                    setForgetPassword(false);
                  }}
                >
                  {"Nie masz konta? Zarejestruj się"}
                </Link>
              </Grid>
            </>
          ) : isRegister ? (
            <Grid item xs={12}>
              <Link
                href="#"
                variant="body2"
                onClick={() => {
                  setIsRegister(false);
                  setForgetPassword(false);
                }}
              >
                {"Masz już konto? Zaloguj się"}
              </Link>
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    setForgetPassword(true);
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
                    setIsRegister(true);
                    setForgetPassword(false);
                  }}
                >
                  {"Nie masz konta? Zarejestruj się"}
                </Link>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-title">
          <MarkEmailReadIcon />
        </DialogTitle>
        <DialogContent id="alert-dialog-description">
          Jeżeli podany adres e-mail istnieje w naszej bazie, to wysłane
          zostanie na niego link do resetowania hasła.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEmail("");
              setForgetPassword(false);
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
