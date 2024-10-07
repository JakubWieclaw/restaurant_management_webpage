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

import { Order } from "../api";
import { RootState } from "../store";
import { AxiosResponse } from "axios";
import { orderApi } from "../utils/api";

export const CustomerOrders = () => {
  const [loading, setLoading] = useState(true);
  const [customerOrders, setCustomerOrders] = useState([]);
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    orderApi
      .getAllOrdersOfCustomer(user.loginResponse?.customerId!)
      .then((response: AxiosResponse) => {
        setCustomerOrders(response.data);
        setLoading(false);
        console.log(response.data);
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
      {customerOrders.map((order: Order) => (
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

              <Grid item xs={1}>
                <Typography align="right">{order.status}</Typography>
              </Grid>
              <Grid item xs={7}>
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
                    Cena: {order.totalPrice} zł
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Status: {order.status}
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
    </Container>
  );
};
