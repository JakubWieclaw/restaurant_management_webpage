import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Customer } from "../api";
import { AxiosResponse } from "axios";
import { customersApi } from "../utils/api";

export const CustomerDetails = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerId, setcustomerId] = useState<number | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    setcustomerId(id ? parseInt(id, 10) : null);
    console.log(id);
  }, [id]);

  useEffect(() => {
    if (customerId === null) {
      return;
    }
    customersApi.getCustomerById(customerId).then((res: AxiosResponse) => {
      setCustomer(res.data);
    });
  }, [customerId]);

  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Dane klienta
      </Typography>
      <Divider />
      <Box
        sx={{
          p: 3,
          mt: 5,
        }}
      >
        {customer ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Imię: {customer.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Nazwisko: {customer.surname}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Email: {customer.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Telefon: {customer.phone}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  );
};
