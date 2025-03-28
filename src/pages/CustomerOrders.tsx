import {
  CircularProgress,
  Container,
  Divider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button,
  Box,
  Grid,
  List,
  ListItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import { Order, OrderTypeEnum } from "../api";
import { RootState } from "../store";
import { AxiosResponse } from "axios";
import { auth, orderApi } from "../utils/api";

export const CustomerOrdersList = ({ orders }: { orders: Order[] }) => {
  const navigate = useNavigate();

  return (
    <>
      {orders.map((order: Order) => (
        <Accordion key={order.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Grid container>
              <Grid item xs={4}>
                <Typography>Zamówienie #{order.id}</Typography>
              </Grid>

              <Grid item xs={3}>
                <Typography align="left">
                  {order.status.replaceAll("_", " ")}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography align="right">
                  {order.dateTime.slice(0, 10)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <List>
                <ListItem>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Cena: {order?.orderPrice} zł{" "}
                    {order?.type === OrderTypeEnum.Dostawa
                      ? `+ dostawa ${order?.deliveryPrice} zł`
                      : ""}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Status: {order.status.replaceAll("_", " ")}
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </AccordionDetails>
          <AccordionActions>
            <Button
              onClick={() => {
                navigate(`/order-details/${order.id}`);
              }}
              variant="contained"
            >
              Szczegóły
            </Button>
          </AccordionActions>
        </Accordion>
      ))}
    </>
  );
};

export const CustomerOrders = () => {
  const [loading, setLoading] = useState(true);
  const [customerOrders, setCustomerOrders] = useState([]);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    orderApi
      .getAllOrdersOfCustomer(user.loginResponse?.customerId!, auth(user?.loginResponse?.token))
      .then((response: AxiosResponse) => {
        setCustomerOrders(response.data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 15 }} maxWidth="md">
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Historia twoich zamówień
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Historia twoich zamówień
      </Typography>
      <Divider
        sx={{
          mb: 2,
        }}
      />
      <CustomerOrdersList orders={customerOrders} />
    </Container>
  );
};
