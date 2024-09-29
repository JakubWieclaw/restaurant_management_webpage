import { Container, Divider, Typography } from "@mui/material";

import { useEffect } from "react";

import { loadStripe } from "@stripe/stripe-js";

function Completion() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);

  useEffect(() => {
    stripePromise.then(async (stripe: any) => {
      const url = new URL(window.location.href);
      const clientSecret = url.searchParams.get("payment_intent_client_secret");
      const { error, paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );

      console.log(
        error
          ? `${error.message}`
          : `https://dashboard.stripe.com/test/payments/${paymentIntent.id}`
      );
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
