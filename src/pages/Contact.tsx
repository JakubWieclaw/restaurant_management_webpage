import {
  Container,
  Typography,
  Divider,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import { AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { RootState } from "../store";
import { configApi, contactFormApi } from "../utils/api";
import { ContactFormCommand, DeliveryPricing, OpeningHour } from "../api";
import { enumToDay } from "../utils/dayEnumTranslate";
import { toast, Slide } from "react-toastify";

export const Contact = () => {
  const config = useSelector((state: RootState) => state.config);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPricing[]>([]);
  const [contactFormName, setContactFormName] = useState("");
  const [contactFormEmail, setContactFormEmail] = useState("");
  const [contactFormMessage, setContactFormMessage] = useState("");
  const [loadingSendContactForm, setLoadingSendContactForm] = useState(false);

  useEffect(() => {
    configApi
      .getDeliveryPrices()
      .then((response: AxiosResponse) => {
        setDeliveryPrices(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    configApi
      .getOpeningHours()
      .then((response: AxiosResponse) => {
        setOpeningHours(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
        <Grid
          container
          sx={{
            justifyContent: "space-evenly",
          }}
          gap={5}
        >
          <Grid item>
            <Typography variant="h5" align="justify" gutterBottom>
              Adres
            </Typography>
            <Typography variant="body1" align="justify">
              {config.config.restaurantName} <br />
              {config.config.postalCode + " " + config.config.city} <br />
              {config.config.street} <br />
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="justify" gutterBottom>
              Dane kontaktowe
            </Typography>
            <Typography variant="body1" align="justify">
              <a href={`tel:+48${config.config.phoneNumber}`}>
                +48 {config.config.phoneNumber}
              </a>{" "}
              <br />
              <a href={`mailto:${config.config.email}`}>
                {config.config.email}
              </a>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="justify" gutterBottom>
              Godziny otwarcia
            </Typography>
            <Typography variant="body1" align="justify">
              {openingHours.map((hour) => (
                <div key={hour.day}>
                  {enumToDay(hour.day)}:{" "}
                  {hour.openingTime.toString().slice(0, -3)} -{" "}
                  {hour.closingTime.toString().slice(0, -3)}
                </div>
              ))}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="justify" gutterBottom>
              Ceny dostawy
            </Typography>
            <Typography variant="body1" align="justify">
              {deliveryPrices.map((price) => (
                <div key={price.id}>
                  Do {price.maximumRange}km: {price.price} zł
                </div>
              ))}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* contact form */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Formularz kontaktowy
        </Typography>
        <Divider />
        <Grid container justifyContent="center" sx={{ mt: 5 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{ p: 3 }}
              boxShadow={3}
              borderRadius={2}
              bgcolor="background.paper"
              component={"form"}
              onSubmit={(event) => {
                setLoadingSendContactForm(true);
                event.preventDefault();
                const contactFromContent: ContactFormCommand = {
                  name: contactFormName,
                  email: contactFormEmail,
                  message: contactFormMessage,
                };
                contactFormApi
                  .sendContactForm(contactFromContent)
                  .then(() => {
                    setContactFormName("");
                    setContactFormEmail("");
                    setContactFormMessage("");
                    toast.success(
                      "Wiadomość wysłana pomyślnie. Odpowiemy tak szybko jak to możliwe.",
                      {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                      }
                    );
                  })
                  .catch((error) => {
                    if (typeof error.response.data === "string") {
                      toast.error(`${error.response.data}`, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                      });
                    } else {
                      for (const [_, value] of Object.entries(
                        error.response.data
                      )) {
                        toast.error(`${value}`, {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                          transition: Slide,
                        });
                      }
                    }
                  })
                  .finally(() => {
                    setLoadingSendContactForm(false);
                  });
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                sx={{
                  my: 1,
                }}
                placeholder="Imię"
                type="text"
                required
                value={contactFormName}
                onChange={(event) => setContactFormName(event.target.value)}
              />
              <TextField
                fullWidth
                variant="outlined"
                sx={{
                  my: 1,
                }}
                placeholder="Email"
                type="email"
                required
                value={contactFormEmail}
                onChange={(event) => setContactFormEmail(event.target.value)}
              />
              <TextField
                fullWidth
                variant="outlined"
                sx={{
                  my: 1,
                }}
                placeholder="Wiadomość"
                type="text"
                multiline
                rows={4}
                required
                value={contactFormMessage}
                onChange={(event) => setContactFormMessage(event.target.value)}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                fullWidth
                size="large"
                color="primary"
                type="submit"
              >
                {loadingSendContactForm ? (
                  <CircularProgress
                    sx={{
                      color: "white",
                    }}
                  />
                ) : (
                  "Wyślij"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
