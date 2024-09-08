import Grid from "@mui/material/Grid";
import { Container, Box, Typography } from "@mui/material";

import { useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useRef, createContext, useMemo } from "react";

import { authApi, configApi } from "../utils/api";
import { AppDispatch } from "../store";
import { login } from "../reducers/slices/userSlice";
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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let registerAsAdmin = false;

    switch (loginRegisterState) {
      case LoginRegisterState.Login:
        await authApi
          .login({ email: email, password: password })
          .then((response) => {
            if (response.status === 200) {
              dispatch(
                login({ response: response.data } as {
                  response: { token: string; isAdmin: boolean };
                })
              );
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
              navigate("/");
            }
          })
          .catch((error: any) => {
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
          })
          .finally(() => {
            setLoading(false);
          });
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

        await configApi
          .getConfig()
          .then((_) => {})
          .catch((_) => {
            registerAsAdmin = true;
          });
        await authApi
          .registerUser({
            email: email,
            name: name,
            surname: surname,
            phone: phoneNumber,
            password: password,
            admin: registerAsAdmin,
          })
          .then((response) => {
            if (response.status === 200) {
              toast.success(response.data, {
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
              if (registerAsAdmin) {
                navigate("/initialize-system");
                toast.info(
                  "Zarejestrowano administratora. Przejdź do inicjalizacji systemu.",
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
              }
            }
          })
          .catch((error: any) => {
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
          })
          .finally(() => {
            setLoading(false);
          });

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
