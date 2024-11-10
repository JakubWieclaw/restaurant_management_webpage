import { Button, CircularProgress } from "@mui/material";

import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Coupon } from "../../api";
import { RootState } from "../../store";
import { couponsApi } from "../../utils/api";

interface CheckoutFormProps {
  coupon: Coupon | null;
  orderId: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ coupon, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // fetch user
  const user = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    if (coupon) {
      couponsApi.deactivateCoupon(coupon.id!);
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/order-details/${orderId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message!);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        // Access the email value like so:
        // onChange={(event) => {
        //  setEmail(event.value.email);
        // }}
        //
        // Prefill the email field like so:
        options={{
          defaultValues: {
            email: user.loginResponse?.customerEmail
              ? user.loginResponse?.customerEmail
              : "",
          },
        }}
      />
      <PaymentElement id="payment-element" />
      <Button
        variant="contained"
        sx={{
          margin: "auto",
          display: "block",
          mt: 3,
        }}
        disabled={isLoading || !stripe || !elements}
        id="submit"
        type="submit"
      >
        <span id="button-text">
          {isLoading ? <CircularProgress /> : "Zapłać teraz"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};
export default CheckoutForm;