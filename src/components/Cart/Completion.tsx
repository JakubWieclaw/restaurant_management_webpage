import {
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../store";
import { orderApi } from "../../utils/api";
import {
  MealQuantity,
  OrderAddCommand,
  OrderAddCommandStatusEnum,
  OrderAddCommandTypeEnum,
} from "../../api";
import { DeliveryOption } from "./DeliverySelection";
import { clearCart } from "../../reducers/slices/cartSlice";
import { AxiosResponse } from "axios";

function Completion() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    stripePromise.then(async (stripe: any) => {
      const url = new URL(window.location.href);
      const clientSecret = url.searchParams.get("payment_intent_client_secret");
      const { error, paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );

      if (error) {
        console.log(`${error.message}`);
      } else if (cart.items.length > 0) {
        console.log(
          `https://dashboard.stripe.com/test/payments/${paymentIntent.id}`
        );
        console.log(cart.deliveryType);
        let addOrderRequest: OrderAddCommand = {
          mealIds: [],
          unwantedIngredients: [],
          customerId: user.loginResponse?.customerId ?? 0, // 0 means unregistered user
          type:
            cart.deliveryType == DeliveryOption.Personal
              ? OrderAddCommandTypeEnum.NaMiejscu
              : OrderAddCommandTypeEnum.Dostawa,
          status: OrderAddCommandStatusEnum.Oczekujce,
          deliveryAddress: cart.address,
        };

        cart.items.forEach((item, idx) => {
          const mealQuantity: MealQuantity = {
            mealId: item.dish.id,
            quantity: item.quantity,
          };
          addOrderRequest.mealIds.push(mealQuantity);
          if (new Set(item.removedIngredients).size !== 0) {
            addOrderRequest.unwantedIngredients!.push({
              mealIndex: idx,
              ingredients: item.removedIngredients,
            });
          }

          // addOrderRequest.unwantedIngredients![idx].ingredients =
          //   item.removedIngredients;
        });

        orderApi
          .addOrder(addOrderRequest)
          .then((response: AxiosResponse) => {
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
            dispatch(clearCart());
            navigate("/order-details/" + response.data.id);
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
      <CircularProgress
        sx={{
          // center
          margin: "auto",
          display: "block",
          mt: 3,
        }}
      />
    </Container>
  );
}

export default Completion;
