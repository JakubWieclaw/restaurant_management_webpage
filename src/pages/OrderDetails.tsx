// TODO: Accordion/Card for orders of specific user

import {
  Container,
  Divider,
  Typography,
  CircularProgress,
  Paper,
  Box,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Order, OrderStatusEnum, OrderTypeEnum } from "../api";
import { orderApi } from "../utils/api";

export const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const fetchOrder = () => {
      orderApi
        .getOrderById(orderId as unknown as number)
        .then((response) => {
          setOrder(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchOrder(); // Initial fetch

    const intervalId = setInterval(fetchOrder, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [orderId, navigate]);
  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Zamówienie #{order?.id}
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 1,
          flexDirection: "column",
        }}
      >
        {order === null ? (
          <CircularProgress />
        ) : (
          <>
            <Typography
              variant="caption"
              color="secondary"
              sx={{
                mt: 2,
              }}
            >
              Status odświeża się automatycznie
            </Typography>
            <Paper
              sx={{
                p: 2,
                width: "100%",
                minHeight: "500px",
                maxWidth: 400,
                fontFamily: "Teko",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              Status: {order?.status}{" "}
              {order.status !== OrderStatusEnum.Gotowe &&
                order.status !== OrderStatusEnum.Dostarczone && (
                  <CircularProgress size={"1rem"} />
                )}
              <br />
              Sposób odbioru: {order.type.replaceAll("_", " ")}
              <br />
              {order.type === OrderTypeEnum.Dostawa &&
                `Adres: ${order.deliveryAddress}`}
              <br />
              {order.mealIds.map((meal, idx) => (
                <>
                  {meal} (Bez: {order.unwantedIngredients![idx].join(", ")}){" "}
                  <br />
                </>
              ))}
              Suma: {order?.totalPrice} PLN
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};
