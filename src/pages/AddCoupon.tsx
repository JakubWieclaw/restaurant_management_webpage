import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Dayjs } from "dayjs";
import { AxiosResponse } from "axios";
import { CouponAddCommand, Customer } from "../api";
import { couponsApi, customersApi } from "../utils/api";

export const AddCoupon = () => {
  const mealId = useParams<{ mealId: string }>().mealId;

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(1);
  const [couponExpiry, setCouponExpiry] = useState<Dayjs | null>();
  const [clients, setClients] = useState<Customer[]>([]);
  const [chosenClients, setChosenClients] = useState<Customer[]>([]);
  const [selectAllClients, setSelectAllClients] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      await customersApi
        .getAllCustomers()
        .then((r: AxiosResponse) => setClients(r.data));
    };
    fetchClients();
  }, []);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let addCouponRequest: CouponAddCommand;
    let success = true;
    let error: any = null;
    if (selectAllClients) {
      setChosenClients([...clients]);
    }
    for (const client of chosenClients) {
      addCouponRequest = {
        code: couponCode,
        discountPercentage: couponDiscount,
        expiryDate: couponExpiry?.toISOString(),
        customerId: client.id!,
        mealId: Number(mealId),
      };
      await couponsApi.createCoupon(addCouponRequest).catch((e) => {
        error = e.response.data;
        success = false;
      });
    }
    if (success) {
      toast.success("Kupon dodany pomyślnie", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (typeof error === "object") {
      for (const [_, err] of Object.entries(error)) {
        toast.error(`${err}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setClients([]);
  };

  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Dodaj kupon
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
              Wprowadź dane kuponu
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={couponExpiry}
                onChange={(newValue) => setCouponExpiry(newValue)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disabled={selectAllClients}
              multiple
              value={chosenClients.map(
                (client) => `(${client.id}) ${client.name} ${client.surname}`
              )}
              onChange={(_, newValue) => {
                setChosenClients([
                  ...newValue.map(
                    (client) =>
                      clients.filter(
                        (c) =>
                          c.id === Number(client.split(" ")[0].slice(1, -1))
                      )[0]
                  ),
                ]);
              }}
              options={clients.map((client) => {
                return `(${client.id}) ${client.name} ${client.surname}`;
              })}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return <Chip key={key} label={option} {...tagProps} />;
                })
              }
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Wybierz użytkowników" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormGroup
              sx={{
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAllClients}
                    onChange={(e) => setSelectAllClients(e.target.checked)}
                  />
                }
                label="Wybierz wszystkich klientów"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCouponSubmit}
              sx={{
                width: "100%",
              }}
            >
              Dodaj kupon
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
