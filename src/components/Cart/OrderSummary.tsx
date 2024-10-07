import {
  Box,
  Divider,
  Typography,
  List,
  CircularProgress,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store";

import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface ContentSummaryProps {
  shippingCost: number;
}

export const ContentSummary: React.FC<ContentSummaryProps> = ({
  shippingCost,
}) => {
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  const cart = useSelector((state: RootState) => state.cart);

  const mealsCost = cart.items.reduce(
    (acc, item) => acc + item.dish.price * item.quantity,
    0
  );
  const total = mealsCost + shippingCost;

  const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(
          "https://api.stripe.com/v1/payment_intents",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + import.meta.env.VITE_STRIPE_SECRET_KEY,
            },
            body: new URLSearchParams({
              amount: (Number(total) * 100).toFixed(0).toString(), // Convert to the smallest currency unit
              currency: "pln",
              "automatic_payment_methods[enabled]": "true",
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        setPaymentIntent(data.client_secret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, []);
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">Posiłki</Typography>
        <Typography variant="body1">{mealsCost.toFixed(2)} zł</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">Dostawa</Typography>
        <Typography variant="body1">{shippingCost.toFixed(2)} zł</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">Łącznie</Typography>
        <Typography variant="body1">{total.toFixed(2)} zł</Typography>
      </Box>
      {paymentIntent === null ? (
        <CircularProgress
          sx={{
            // center
            margin: "auto",
            display: "block",
            mt: 3,
          }}
        />
      ) : (
        <Elements
          stripe={stripe}
          options={{
            clientSecret: paymentIntent,
          }}
        >
          <Divider sx={{ mb: 3 }} />
          <CheckoutForm />
        </Elements>
      )}
    </List>
  );
};
