import Grid from "@mui/material/Grid";
import { Container, Box, Typography } from "@mui/material";

import { toast, Slide } from "react-toastify";
import { useDispatch } from "react-redux";
import { useState, useRef, createContext, useMemo } from "react";

import api from "../utils/api";
import { AppDispatch } from "../store";
import { login } from "../utils/userSlice";
import { Login } from "../components/LoginRegister/Login";
import { Register } from "../components/LoginRegister/Register";
import { ForgetPassword } from "../components/LoginRegister/ForgetPassword";
import { validatePhoneNumber } from "../utils/validations";

export enum LoginRegisterState {
  Login,
  Register,
  ForgetPassword,
}

export const authContext = createContext<any>(null);

export const LoginRegister = () => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let response;

    switch (loginRegisterState) {
      case LoginRegisterState.Login:
        try {
          const response = await api.post(`/auth/login`, {
            params: {
              email: email,
              password: password,
            },
          });
          console.log(response.data);
          if (response.status === 200) {
            dispatch(login());
            toast.success("Zalogowano pomyślnie", {
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
            toast.error("Błąd logowania", {
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
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
        break;
      case LoginRegisterState.Register:
        if (password !== passwordRepeat) {
          toast.error("Hasła nie są takie same", {
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
          return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
          toast.error("Numer telefonu w niepoprawnym formacie", {
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
          return;
        }
        try {
          response = await api.post(`/auth/register`, {
            email: email,
            name: name,
            surname: surname,
            phone: phoneNumber,
            password: password,
          });
          if (response.status === 200) {
            toast.success("Zarejestrowano pomyślnie", {
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
            setLoginRegisterState(LoginRegisterState.Login);
          } else {
            toast.error("Błąd rejestracji", {
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
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }

        setPassword("");
        break;
      case LoginRegisterState.ForgetPassword:
        console.log("ForgetPassword");
        setPassword("");
        break;
      default:
        break;
    }
  };
  const [loginRegisterState, setLoginRegisterState] =
    useState<LoginRegisterState>(LoginRegisterState.Login);
  const formRef = useRef(null);

  const returnProperComponent = (formRef: React.MutableRefObject<null>) => {
    switch (loginRegisterState) {
      case LoginRegisterState.Login:
        return <Login />;
      case LoginRegisterState.Register:
        return <Register />;
      case LoginRegisterState.ForgetPassword:
        return <ForgetPassword formRef={formRef} />;

      default:
        break;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 15 }}>
      <Box component={"form"} onSubmit={handleSubmit} ref={formRef}>
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
          <authContext.Provider
            value={useMemo(
              () => ({
                email,
                setEmail,
                phoneNumber,
                setPhoneNumber,
                password,
                setPassword,
                passwordRepeat,
                setPasswordRepeat,
                name,
                setName,
                surname,
                setSurname,
                setLoginRegisterState,
                loading,
              }),
              [
                email,
                setEmail,
                phoneNumber,
                setPhoneNumber,
                password,
                setPassword,
                passwordRepeat,
                setPasswordRepeat,
                name,
                setName,
                surname,
                setSurname,
                setLoginRegisterState,
                loading,
              ]
            )}
          >
            {returnProperComponent(formRef)}
          </authContext.Provider>
        </Grid>
      </Box>
    </Container>
  );
};
