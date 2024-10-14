import {
  Box,
  Divider,
  Typography,
  List,
  CircularProgress,
  TextField,
} from "@mui/material";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { RootState } from "../../store";

import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { couponsApi } from "../../utils/api";
import { AxiosResponse } from "axios";
import { Coupon } from "../../api";

interface ContentSummaryProps {
  shippingCost: number;
}

export const ContentSummary: React.FC<ContentSummaryProps> = ({
  shippingCost,
}) => {
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);

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
              amount: (Number(total - couponDiscount) * 100)
                .toFixed(0)
                .toString(), // Convert to the smallest currency unit
              currency: "pln",
              "automatic_payment_methods[enabled]": "true",
            }),
          }
        );

        const data = await response.json();
        setPaymentIntent(data.client_secret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, []);
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", p: 5 }}>
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
      {couponDiscount !== 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1">Kod rabatowy</Typography>
          <Typography variant="body1">-{couponDiscount} zł</Typography>
        </Box>
      )}
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">Łącznie</Typography>
        <Typography variant="body1">
          {(total - couponDiscount).toFixed(2)} zł
        </Typography>
      </Box>
      {user.loginResponse && (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              my: 3,
            }}
          >
            <TextField
              label="Kod rabatowy"
              variant="outlined"
              size="small"
              onChange={(e) => {
                setCouponCode(e.target.value);
              }}
              disabled={couponDiscount !== 0}
              helperText="Wpisz kod rabatowy i naciśnij Enter"
              // on key press enter
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  couponsApi
                    .getCouponsForCustomer(user.loginResponse?.customerId!)
                    .then((response) => {
                      const coupon = response.data.find(
                        (coupon) => coupon.code === couponCode && coupon.active
                      );

                      if (
                        coupon?.active &&
                        cart.items.some(
                          (item) => coupon.meal?.id === item.dish.id
                        )
                      ) {
                        couponsApi
                          .applyCoupon(
                            coupon.code,
                            user.loginResponse?.customerId!,
                            coupon.meal?.id!,
                            coupon.meal?.price!
                          )
                          .then((response: AxiosResponse) => {
                            setCouponDiscount(
                              parseFloat((response.data as number).toFixed(2))
                            );
                            setCoupon(coupon);
                            toast.success("Kod rabatowy został zastosowany", {
                              position: "bottom-center",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                            });
                          });
                      } else {
                        toast.error("Kod rabatowy jest nieprawidłowy", {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                      }
                    });
                }
              }}
            />
          </Box>
          <Divider />
        </>
      )}

      {paymentIntent === null ? (
        <CircularProgress
          sx={{
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
          <CheckoutForm coupon={coupon} />
        </Elements>
      )}
    </List>
  );
};
