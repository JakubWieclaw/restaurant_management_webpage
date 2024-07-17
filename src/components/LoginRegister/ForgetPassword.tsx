import {
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Link,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import { useContext, useState } from "react";

import { Transition } from "../../utils/Transision";
import { authContext, LoginRegisterState } from "../../pages/LoginRegister";

interface ForgetPasswordProps {
  formRef: any;
}

export const ForgetPassword: React.FC<ForgetPasswordProps> = ({ formRef }) => {
  const ctx = useContext(authContext);

  const [openDialog, setOpenDialog] = useState(false);
  const handleSubmit = () => {
    if (formRef.current.checkValidity()) {
      setOpenDialog(true);
    }
  };
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
      <Grid item xs={4}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            handleSubmit();
          }}
        >
          Resetuj hasło
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
            ctx.setLoginRegisterState(LoginRegisterState.Login);
          }}
        >
          {"Wróć do logowania"}
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
              ctx.setLoginRegisterState(LoginRegisterState.Login);
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
