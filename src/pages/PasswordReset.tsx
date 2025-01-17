import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";

import { useState } from "react";
import { useSelector } from "react-redux";
import { toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { RootState } from "../store";
import { authApi, photoDownloadUrl } from "../utils/api";

export const PasswordReset = () => {
  const minPasswordLength = 8;
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");

  const config = useSelector((state: RootState) => state.config);

  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      // change password - password wasn't forgotten
    } else {
      // reset password
      authApi
        .resetPassword(token, password)
        .then((_) => {
          navigate("/auth");
          toast.success("Zmiana hasła przebiegła pomyślnie.", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          });
        })
        .catch((error) => {
          toast.error(
            error?.response?.data
              ? error.response.data
              : "Błąd połączenia z serwerem",
            {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Slide,
            }
          );
        });
    }
  };

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
              src={photoDownloadUrl + config.config.logoUrl}
              sx={{
                width: "20%",
              }}
            ></Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Zmiana hasła</Typography>
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
              error={password.length < minPasswordLength && password.length > 0}
              helperText={`Hasło musi mieć co najmniej ${minPasswordLength} znaków`}
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
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              error={
                (password.length < minPasswordLength ||
                  password !== passwordRepeat) &&
                passwordRepeat.length > 0
              }
              helperText={"Hasło musi być takie samo jak powyżej"}
            />
          </Grid>
          <Grid item xs={4}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Zmień hasło
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
