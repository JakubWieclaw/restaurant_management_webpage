import {
  Container,
  Divider,
  Typography,
  CircularProgress,
  Box,
  Paper,
  styled,
  Rating,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";

import { fetchRating } from "./FoodMenu";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import { useState, useEffect, useRef } from "react";

import { RootState } from "../store";
import { Dish } from "../types/dish";
import { OpinionAddCommand, OpinionResponseDTO } from "../api";
import { auth, mealsApi, opinionApi, photoDownloadUrl } from "../utils/api";

export const DishDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [opinion, setOpinion] = useState<string>("");
  const [opinionSwitch, setOpinionSwitch] = useState<boolean>(false);

  const masonryRef = useRef<JSX.Element | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const [opinions, setOpinions] = useState<OpinionResponseDTO[]>([]);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      window.location.href = "/";
      return;
    }

    opinionApi.getOpinionsForMeal(id as unknown as number).then((response) => {
      setOpinions(response.data);
    });

    mealsApi
      .getMealById(Number(id), auth(user?.loginResponse?.token))
      .then(async (response) => {
        const [rating, ratingNumber] = await fetchRating(response.data);
        setDish({
          id: response.data.id!,
          name: response.data.name,
          price: response.data.price ?? 0,
          ingredients: response.data.ingredients ?? [],
          category: "", // TODO: fetch category
          image: response.data.photographUrl ?? "",
          rating: rating,
          ratingNumber: ratingNumber,
          allergens: response.data.allergens ?? [],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, opinionSwitch]);

  const handleSendOpinion = async () => {
    if (!dish) {
      return;
    }

    const addOpinionRequest: OpinionAddCommand = {
      mealId: dish.id,
      rating: rating,
      comment: opinion,
      customerId: user.loginResponse!.customerId!,
    };

    opinionApi
      .addOpinion(addOpinionRequest, auth(user?.loginResponse?.token))
      .then((response) => {
        setOpinionSwitch(!opinionSwitch);
        setRating(5);
        setOpinion("");
        toast.success(
          typeof response.data === "string"
            ? response.data
            : "Ocena dodana pomyślnie!",
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
      .catch((_) => {
        opinionApi
          .updateOpinion(addOpinionRequest, auth(user?.loginResponse?.token))
          .then((response) => {
            setOpinionSwitch(!opinionSwitch);
            setRating(5);
            setOpinion("");
            toast.success(
              typeof response.data === "string"
                ? response.data
                : "Ocena zaktualizowana pomyślnie!",
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
          .catch((_) => {
            toast.error("Wystąpił błąd podczas dodawania oceny", {
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
          });
      });
  };

  if (!dish) {
    return (
      <Container sx={{ mt: 15 }} maxWidth="md">
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Ładowanie...
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      </Container>
    );
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#90a4ae",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "white",
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
    fontSize: "1.2rem",
  }));

  // Store the initial render of the Masonry component
  if (!masonryRef.current) {
    masonryRef.current = (
      <Masonry
        // let number of columns be depend on screen size xs-1, md-2, ...
        columns={{ xs: 1, sm: 2, md: 3 }}
        spacing={1}
      >
        <Item>
          <Box
            component={"img"}
            src={photoDownloadUrl + dish.image}
            alt={dish.name}
            sx={{ width: "100%" }}
          />
        </Item>
        <Item>Cena: {dish.price} zł</Item>
        <Item>Składniki: {dish.ingredients.join(", ")}</Item>
        <Item>
          {" "}
          <Rating
            name="read-only"
            value={dish.rating}
            precision={0.25}
            readOnly
            sx={{
              padding: "0.5rem",
            }}
          />
          <Box
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            ({dish.rating.toFixed(2)})
          </Box>
        </Item>
        <Item>Alergeny: {dish.allergens.join(", ")}</Item>
      </Masonry>
    );
  }

  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        {dish.name}
      </Typography>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        {masonryRef.current}
      </Box>
      <Divider />
      <Grid container sx={{ my: 5 }}>
        <Grid item xs={6}>
          <Box sx={{}}>
            <TextField
              fullWidth
              variant="outlined"
              sx={{
                my: 1,
              }}
              placeholder="Napisz kilka słów o daniu..."
              type="text"
              multiline
              rows={4}
              required
              value={opinion}
              onChange={(event) => setOpinion(event.target.value)}
              disabled={user.loginResponse === null}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              color={
                user.loginResponse === null ? "text.disabled" : "text.primary"
              }
            >
              Oceń danie!
            </Typography>
            <Rating
              name="size-large"
              size="large"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue ?? 0);
              }}
              disabled={user.loginResponse === null}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
            }}
            disabled={user.loginResponse === null}
            onClick={handleSendOpinion}
          >
            {user.loginResponse === null
              ? "Zaloguj się, aby dodać opinię"
              : "Wyślij opinię"}
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Grid container sx={{ mt: 5 }}>
        <Grid item xs={12}>
          <Typography variant="h5" align="center" gutterBottom>
            Opinie o daniu
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {opinions.map((opinion) => (
            <Paper
              key={opinion.customerId}
              sx={{
                p: 2,
                mt: 2,
              }}
              elevation={24}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Rating
                  name="read-only"
                  value={opinion.rating}
                  readOnly
                  sx={{
                    padding: "0.5rem",
                  }}
                />
                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    whiteSpace: "pre-wrap", // Ensures that whitespace is preserved and text wraps
                    wordBreak: "break-word", // Ensures that long words break to fit within the container
                  }}
                >
                  {opinion.comment}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};
