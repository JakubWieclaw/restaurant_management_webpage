import {
  Container,
  Divider,
  Typography,
  Grid,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";

import { Transition } from "../utils/Transision";
import { tableApi } from "../utils/api";
import { TableAddCommand } from "../api";
import { toast } from "react-toastify";
import { TableReservationModal } from "../components/Reservation/TablereservationModal";

export const TablesManagement = () => {
  const [tableID, setTableID] = useState("");
  const [tableSeats, setTableSeats] = useState(1);
  const [openNewTableModal, setOpenNewTableModal] = useState(false);
  const [tableAddingLoading, setTableAddingLoading] = useState(false);
  const [openNewReservationModal, setOpenNewReservationModal] = useState(false);

  return (
    <Container sx={{ mt: 15 }} maxWidth="lg">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Zarządzanie stolikami i rezerwacjami
      </Typography>
      <Divider />
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
        }}
      >
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            Stoliki
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenNewTableModal(true)}
              sx={{
                fontSize: "0.65rem",
              }}
            >
              Dodaj stolik
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            Rezerwacje
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenNewReservationModal(true)}
              sx={{
                fontSize: "0.65rem",
              }}
            >
              Dodaj rezerwację
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={openNewTableModal}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-slide-description"
        onClose={() => setOpenNewTableModal(false)}
      >
        <DialogTitle id="alert-dialog-title">{"Dodaj nowy stolik"}</DialogTitle>
        <DialogContent id="alert-dialog-description">
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Identyfikator"
            type="text"
            fullWidth
            value={tableID}
            onChange={(e) => {
              setTableID(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="name"
            label="Ilość miejsc"
            type="number"
            fullWidth
            value={tableSeats}
            onChange={(e) => {
              setTableSeats(parseInt(e.target.value));
            }}
            inputProps={{
              min: -1,
              step: 1,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenNewTableModal(false);
            }}
            color="warning"
          >
            Anuluj
          </Button>
          <Button
            onClick={() => {
              setTableAddingLoading(true);
              const requestData: TableAddCommand = {
                id: tableID,
                capacity: tableSeats,
              };
              tableApi.save(requestData).then((response) => {
                console.log(response);
                toast.success("Dodano nowy stolik", {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                setTableAddingLoading(false);
              });
              setOpenNewTableModal(false);
            }}
            color="primary"
          >
            {tableAddingLoading ? <CircularProgress size={24} /> : "Dodaj"}
          </Button>
        </DialogActions>
      </Dialog>
      <TableReservationModal
        open={openNewReservationModal}
        setOpen={setOpenNewReservationModal}
      />
    </Container>
  );
};
