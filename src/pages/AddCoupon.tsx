import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { useState } from "react";
import { useParams } from "react-router-dom";

import { ConfigAddCommand } from "../api";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const AddCoupon = () => {
  // get mealid from url
  const mealId = useParams<{ mealId: string }>().mealId;

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponExpiry, setCouponExpiry] = useState<Dayjs | null>();
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let addCouponRequest: ConfigAddCommand;
    //   couponsApi.createCoupon({ code: couponCode, discount: couponDiscount, expiry: couponExpiry });
  };

  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Kontakt
      </Typography>
      <Divider />
      <Box
        sx={{
          p: 3,
          mt: 5,
        }}
        boxShadow={3}
        borderRadius={2}
        bgcolor="background.paper"
      >
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Dodaj kupon
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kod kuponu"
              variant="outlined"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Zniżka (%)"
              variant="outlined"
              value={couponDiscount}
              onChange={(e) => setCouponDiscount(Number(e.target.value))}
              type="number"
              inputProps={{
                min: 1,
                step: 1,
                max: 100,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DatePicker
                value={couponExpiry}
                onChange={(newValue) => setCouponExpiry(newValue)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCouponSubmit}
            >
              Dodaj kupon
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
