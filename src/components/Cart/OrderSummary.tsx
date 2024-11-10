import {
  Box,
  Divider,
  Typography,
  List,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";

import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Coupon,
  MealQuantity,
  OrderAddCommand,
  OrderAddCommandStatusEnum,
  OrderAddCommandTypeEnum,
} from "../../api";
import { RootState } from "../../store";
import CheckoutForm from "./CheckoutForm";
import { DeliveryOption } from "./DeliverySelection";
import { couponsApi, orderApi } from "../../utils/api";
import { clearCart } from "../../reducers/slices/cartSlice";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface ContentSummaryProps {
  shippingCost: number;
}

export const ContentSummary: React.FC<ContentSummaryProps> = ({
  shippingCost,
}) => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [orderAccepted, setOrderAccepted] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mealsCost = cart.items.reduce(
    (acc, item) => acc + item.dish.price * item.quantity,
    0
  );
  const total = mealsCost + shippingCost;

  const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHED_KEY);

  useEffect(() => {
    if (orderAccepted) {
      if (cart.items.length > 0) {
        let deliveryType: OrderAddCommandTypeEnum =
          OrderAddCommandTypeEnum.NaMiejscu; // default value
        switch (cart.deliveryType) {
          case DeliveryOption.Personal:
            deliveryType = OrderAddCommandTypeEnum.NaMiejscu;
            break;
          case DeliveryOption.Courier:
            deliveryType = OrderAddCommandTypeEnum.Dostawa;
            break;
          case DeliveryOption.Table:
            deliveryType = OrderAddCommandTypeEnum.DoStolika;
            break;
        }
        let addOrderRequest: OrderAddCommand = {
          mealIds: [],
          unwantedIngredients: [],
          customerId: user.loginResponse?.customerId ?? 0, // 0 means unregistered user
          type: deliveryType,
          status: OrderAddCommandStatusEnum.Oczekujce,
          deliveryAddress:
            cart.deliveryType != DeliveryOption.Courier
              ? undefined
              : cart.address,
          deliveryDistance:
            cart.deliveryType != DeliveryOption.Courier ? 0 : cart.distance,
          tableId:
            deliveryType == OrderAddCommandTypeEnum.DoStolika
              ? cart.address
              : undefined,
          people:
            deliveryType == OrderAddCommandTypeEnum.DoStolika ? 1 : undefined,
          minutesForReservation:
            deliveryType == OrderAddCommandTypeEnum.DoStolika ? 1 : undefined,
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
        });

        orderApi
          .addOrder(addOrderRequest)
          .then((response: AxiosResponse) => {
            setOrderId(response.data.id);
            setPaymentIntent(response.data.paymentIntentClientSecret);
            dispatch(clearCart());
            const previousButton = document.getElementById("previous");
            if (previousButton) {
              previousButton.style.display = "none";
            }

            // navigate("/order-details/" + response.data.id);
          })
          .catch((error) => {
            // go back to the wybór dostawy page
            navigate("/cart");
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
    }
  }, [orderAccepted]);
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", p: 5 }}>
      {paymentIntent === null && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">Posiłki</Typography>
            <Typography variant="body1">{mealsCost.toFixed(2)} zł</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">Dostawa</Typography>
            <Typography variant="body1">
              {shippingCost.toFixed(2)} zł
            </Typography>
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
        </>
      )}

      {user.loginResponse && paymentIntent === null && (
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
        <Button
          variant="contained"
          sx={{ margin: "auto", display: "block", mt: 3 }}
          onClick={() => setOrderAccepted(true)}
        >
          {orderAccepted ? (
            <CircularProgress
              sx={{
                color: "white",
              }}
            />
          ) : (
            "Zatwierdź i zapłać"
          )}
        </Button>
      ) : (
        <Elements
          stripe={stripe}
          options={{
            clientSecret: paymentIntent,
          }}
        >
          <CheckoutForm coupon={coupon} orderId={orderId!} />
        </Elements>
      )}
    </List>
  );
};
