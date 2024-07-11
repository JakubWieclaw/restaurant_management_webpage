import { Container, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

import { useState, useRef } from "react";
import { Login } from "../components/LoginRegister/Login";
import { Register } from "../components/LoginRegister/Register";
import { ForgetPassword } from "../components/LoginRegister/ForgetPassword";

export enum LoginRegisterState {
  Login,
  Register,
  ForgetPassword,
}

export function LoginRegister() {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (loginRegisterState) {
      case LoginRegisterState.Login:
        alert("Login");
        break;
      case LoginRegisterState.Register:
        if (password === passwordRepeat) {
          alert("Register");
          setPassword("");
        }
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
        return (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            setLoginRegisterState={setLoginRegisterState}
          />
        );
      case LoginRegisterState.Register:
        return (
          <Register
            name={name}
            setName={setName}
            surname={surname}
            setSurname={setSurname}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            passwordRepeat={passwordRepeat}
            setPasswordRepeat={setPasswordRepeat}
            setLoginRegisterState={setLoginRegisterState}
          />
        );
      case LoginRegisterState.ForgetPassword:
        return (
          <ForgetPassword
            email={email}
            setEmail={setEmail}
            setLoginRegisterState={setLoginRegisterState}
            formRef={formRef}
          />
        );

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
          {returnProperComponent(formRef)}
        </Grid>
      </Box>
    </Container>
  );
}
