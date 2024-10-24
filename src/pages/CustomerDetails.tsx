import {
  Box,
  CircularProgress,
  Container,
  Divider,
  FormGroup,
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
} from "@mui/material";

import { useEffect, useState } from "react";
import { toast, Slide } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import { AxiosResponse } from "axios";
import { Customer, Order } from "../api";
import { customersApi, orderApi } from "../utils/api";
import { CustomerOrdersList } from "./CustomerOrders";

export const CustomerDetails = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [loadingDataForm, setLoadingDataForm] = useState<boolean>(false);
  const [customerOrders, setCustomerOrders] = useState<Order[] | null>(null);
  const [confirmaionModalOpen, setConfirmaionModalOpen] =
    useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    setCustomerId(id ? parseInt(id, 10) : null);
  }, [id]);

  useEffect(() => {
    if (customerId === null) {
      return;
    }
    customersApi.getCustomerById(customerId).then((res: AxiosResponse) => {
      setCustomer(res.data);
    });
    orderApi.getAllOrdersOfCustomer(customerId).then((res: AxiosResponse) => {
      setCustomerOrders(res.data);
    });
  }, [customerId]);

  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Szczegóły klienta
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="error"
          sx={{
            width: "15%",
          }}
          size="small"
          onClick={() => {
            if (customerId === null) {
              return;
            }
            setLoadingDataForm(true);
            setConfirmaionModalOpen(true);
          }}
        >
          {loadingDataForm ? <CircularProgress /> : "Usuń klienta"}
        </Button>
      </Box>
      <Box
        sx={{
          p: 3,
          mt: 5,
        }}
      >
        {customer ? (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              setLoadingDataForm(true);
              customersApi
                .updateCustomer(customerId!, customer)
                .then(() => {
                  toast.success("Dane klienta zostały zapisane", {
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
                  console.error(error);
                  if (typeof error.response.data === "string") {
                    toast.error(error.response.data, {
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
                  } else if (typeof error.response.data === "object") {
                    for (const key in error.response.data) {
                      toast.error(error.response.data[key], {
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
                  } else {
                    toast.error(
                      "Wystąpił problem z modyfikacją danych klienta.",
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
                })
                .finally(() => {
                  setLoadingDataForm(false);
                });
            }}
          >
            <FormGroup>
              <Grid
                container
                sx={{
                  display: "flex",
                }}
                spacing={2}
              >
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <TextField
                    id="name"
                    label="Imię"
                    value={customer.name}
                    onChange={(event) =>
                      setCustomer({ ...customer, name: event.target.value })
                    }
                    required
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-begin",
                  }}
                >
                  <TextField
                    id="surname"
                    label="Nazwisko"
                    value={customer.surname}
                    onChange={(event) =>
                      setCustomer({
                        ...customer,
                        surname: event.target.value,
                      })
                    }
                    required
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <TextField
                    id="email"
                    label="Email"
                    value={customer.email}
                    onChange={(event) =>
                      setCustomer({ ...customer, email: event.target.value })
                    }
                    sx={{
                      display: "flex",
                      justifyContent: "flex-begin",
                    }}
                    required
                    inputMode="email"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="phone"
                    label="Telefon"
                    value={customer.phone}
                    onChange={(event) =>
                      setCustomer({ ...customer, phone: event.target.value })
                    }
                    required
                    inputMode="tel"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      width: "20%",
                    }}
                    type="submit"
                  >
                    {loadingDataForm ? <CircularProgress /> : "Zapisz"}
                  </Button>
                </Grid>
              </Grid>
            </FormGroup>
          </Box>
        ) : (
          <CircularProgress />
        )}
        <Divider sx={{ my: 4 }} />
        {customerOrders ? (
          <>
            <Typography variant="h5" align="center" gutterBottom>
              Historia zamówień klienta
            </Typography>
            <CustomerOrdersList orders={customerOrders} />
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
      {/* delete customer confirmaion modal */}
      <Dialog
        open={confirmaionModalOpen}
        onClose={() => {
          setConfirmaionModalOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 5,
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Czy na pewno chcesz usunąć klienta?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              color="error"
              sx={{
                width: "40%",
                mx: 1,
              }}
              size="small"
              onClick={() => {
                customersApi
                  .deleteCustomerById(customerId!)
                  .then(() => {
                    navigate("/admin-panel");
                    toast.success("Klient został usunięty", {
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
                    console.error(error);
                    if (typeof error.response.data === "string") {
                      toast.error(error.response.data, {
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
                    } else if (typeof error.response.data === "object") {
                      for (const key in error.response.data) {
                        toast.error(error.response.data[key], {
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
                    } else {
                      toast.error("Wystąpił problem z usunięciem klienta.", {
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
                  })
                  .finally(() => {
                    setLoadingDataForm(false);
                  });
              }}
            >
              Tak
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: "40%",
                mx: 1,
              }}
              size="small"
              onClick={() => {
                setConfirmaionModalOpen(false);
                setLoadingDataForm(false);
              }}
            >
              Nie
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};
