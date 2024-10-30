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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";

import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { RootState } from "../store";
import { Transition } from "../utils/Transision";
import { tableApi, tableReservationApi } from "../utils/api";
import { Table, TableAddCommand, TableReservation } from "../api";
import { TableReservationModal } from "../components/Reservation/TablereservationModal";

export const TablesManagement = () => {
  const [tableID, setTableID] = useState("");
  const [tableSeats, setTableSeats] = useState(1);
  const [tablesList, setTablesList] = useState([]);
  const [refreshLists, setRefreshLists] = useState(false);
  const [reservationsList, setReservationsList] = useState([]);
  const [openNewTableModal, setOpenNewTableModal] = useState(false);
  const [tableAddingLoading, setTableAddingLoading] = useState(false);
  const [onlyTodayReservations, setOnlyTodayReservations] = useState(false);
  const [openNewReservationModal, setOpenNewReservationModal] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    tableApi.getAllTables().then((response: AxiosResponse) => {
      setTablesList(response.data);
    });
    if (user.loginResponse?.isAdmin) {
      if (onlyTodayReservations) {
        tableReservationApi
          .getReservationsForDay(new Date().toISOString().split("T")[0])
          .then((response: AxiosResponse) => {
            setReservationsList(response.data);
          });
      } else {
        tableReservationApi
          .getAllReservations()
          .then((response: AxiosResponse) => {
            setReservationsList(response.data);
          });
      }
    } else {
      tableReservationApi
        .getReservationsForCustomer(user.loginResponse?.customerId!)
        .then((response: AxiosResponse) => {
          setReservationsList(response.data);
        });
    }
  }, [refreshLists, onlyTodayReservations]);

  return (
    <Container sx={{ mt: 15 }} maxWidth="lg">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Stoliki i rezerwacje
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
              justifyContent: "space-around",
            }}
          >
            {user.loginResponse?.isAdmin ? (
              <>
                <Box sx={{ width: 180, height: 20 }}></Box>
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
              </>
            ) : (
              <Box sx={{ width: 180, height: 30 }}></Box>
            )}
          </Box>
          <Grid container>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <List
                  sx={{
                    width: "75%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "background.paper",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    boxShadow: 4,
                    borderRadius: 1,
                    p: 1,
                    m: 2,
                    flexDirection: "column",
                  }}
                >
                  {tablesList.length === 0 ? (
                    <Typography
                      variant="overline"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Brak stolików
                    </Typography>
                  ) : (
                    tablesList.map((table: Table) => (
                      <ListItem
                        key={table.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              tableApi
                                .deleteTable(table.id!)
                                .then(() => {
                                  setRefreshLists(!refreshLists);
                                  toast.success("Usunięto stolik", {
                                    position: "bottom-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                })
                                .catch((_) => {
                                  toast.error("Nie można usunąć stolika", {
                                    position: "bottom-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                });
                            }}
                          >
                            {user.loginResponse?.isAdmin && <DeleteIcon />}
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <TableRestaurantIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={table.id}
                          secondary={`Ilość miejsc: ${table.capacity}`}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            </Grid>
          </Grid>
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
            {user.loginResponse?.isAdmin ? "Rezerwacje" : "Moje rezerwacje"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {user.loginResponse?.isAdmin && (
              <Box sx={{ width: 180, height: 20 }}>
                <Checkbox
                  onClick={() =>
                    setOnlyTodayReservations(!onlyTodayReservations)
                  }
                  size="small"
                  checked={onlyTodayReservations}
                />
                Tylko dzisiejsze
              </Box>
            )}

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
          <Grid container>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <List
                  sx={{
                    width: "75%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "background.paper",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    boxShadow: 4,
                    borderRadius: 1,
                    p: 1,
                    m: 2,
                    flexDirection: "column",
                  }}
                >
                  {reservationsList.length === 0 ? (
                    <Typography
                      variant="overline"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Brak rezerwacji
                    </Typography>
                  ) : (
                    reservationsList.map((reservation: TableReservation) => (
                      <ListItem
                        key={reservation.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              tableReservationApi
                                .deleteReservationById(reservation.id!)
                                .then(() => {
                                  setRefreshLists(!refreshLists);
                                  toast.success("Usunięto rezerwację", {
                                    position: "bottom-center",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                });
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <AccessTimeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${reservation.day} | ${reservation.startTime
                            .toString()
                            .slice(0, 5)}
                          -
                          ${reservation.endTime.toString().slice(0, 5)}`}
                          secondary={`Stolik: ${reservation.tableId} | Osób: ${reservation.people}`}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            </Grid>
          </Grid>
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
              tableApi.save(requestData).then(() => {
                setRefreshLists(!refreshLists);
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
        setOpen={(open) => {
          setOpenNewReservationModal(open);
          if (!open) setRefreshLists(!refreshLists);
        }}
      />
    </Container>
  );
};
