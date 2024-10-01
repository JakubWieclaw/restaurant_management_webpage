import { Container, Divider, Typography } from "@mui/material";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

import { RootState } from "../../store";
import { orderApi } from "../../utils/api";
import {
  OrderAddCommand,
  OrderAddCommandStatusEnum,
  OrderAddCommandTypeEnum,
} from "../../api";
import { DeliveryOption } from "./DeliverySelection";
import { toast } from "react-toastify";
import { clearCart } from "../../reducers/slices/cartSlice";

function Completion() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    stripePromise.then(async (stripe: any) => {
      const url = new URL(window.location.href);
      const clientSecret = url.searchParams.get("payment_intent_client_secret");
      const { error, paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );

      if (error) {
        console.log(`${error.message}`);
      } else {
        console.log(
          `https://dashboard.stripe.com/test/payments/${paymentIntent.id}`
        );
        let addOrderRequest: OrderAddCommand = {
          mealIds: [],
          unwantedIngredients: {},
          customerId: user.loginResponse?.customerId,
          type:
            cart.deliveryType === DeliveryOption.Personal
              ? OrderAddCommandTypeEnum.NaMiejscu
              : OrderAddCommandTypeEnum.Dostawa,
          status: OrderAddCommandStatusEnum.Oczekujce,
        };

        cart.items.forEach((item, idx) => {
          addOrderRequest.mealIds.push(item.dish.id);
          addOrderRequest.unwantedIngredients![idx] = item.removedIngredients;
        });

        orderApi
          .addOrder(addOrderRequest)
          .then((response) => {
            console.log(response);
            toast.success("Zamówienie zostało złożone", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            clearCart();
            console.log(cart.items);
            console.log("Cart cleared");
            console.log(cart.items);
          })
          .catch((error) => {
            console.error(error);
            toast.error(error.response.data, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      }
    });
  }, []);

  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Twoje zamówienie zostało złożone!
      </Typography>
      <Divider />
    </Container>
  );
}

export default Completion;
