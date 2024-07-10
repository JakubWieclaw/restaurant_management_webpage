import {
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import { Transition } from "../Transision";
import { LoginRegisterState } from "../../pages/LoginRegister";

import { useState } from "react";

interface ForgetPasswordProps {
  email: string;
  setEmail: (email: string) => void;
  setLoginRegisterState: (state: LoginRegisterState) => void;
  formRef: any;
}

export const ForgetPassword: React.FC<ForgetPasswordProps> = ({
  email,
  setEmail,
  setLoginRegisterState,
  formRef,
}) => {
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
              setLoginRegisterState(LoginRegisterState.Login);
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
