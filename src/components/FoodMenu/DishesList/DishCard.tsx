import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Rating,
  Box,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useState } from "react";
import { toast, Slide } from "react-toastify";
import { useDispatch } from "react-redux";

import { Dish } from "../../../types/dish";
import { DishDialog } from "./DishDialog";
import { CartItem } from "../../../types/cartTypes";
import { addToCart } from "../../../reducers/slices/cartSlice";
import { Link } from "react-router-dom";

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const dispatch = useDispatch();

  const onSubmit = (_: React.FormEvent<HTMLFormElement>) => {
    const item: CartItem = {
      dish,
      quantity,
      removedIngredients,
    };
    dispatch(addToCart(item));
    toast.success("Dodano do koszyka", {
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
    setRemovedIngredients([]);
    setQuantity(1);
  };

  return (
    <>
      {/* go to rates after clicking the dish */}
      <Card>
        <Link
          to={`/dish-details/${dish.id}`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <CardMedia
            image={dish.image}
            title={dish.name}
            sx={{
              height: 200,
              width: 400,
              objectFit: "cover",
              ":hover": { transform: "scale(1.1)" },
            }}
          />
          <CardContent>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">{dish.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {dish.ingredients.join(", ")}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="text.secondary">
                  {dish.price} zł
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Link>

        <CardActions>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid item>
              <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
                <Rating
                  name="read-only"
                  value={dish.rating}
                  readOnly
                  precision={0.5}
                  sx={{
                    padding: "0.5rem",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "text.secondary",
                  }}
                >
                  ({dish.ratingNumber})
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ ml: "auto" }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <ShoppingCartIcon />
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      <DishDialog
        {...{
          open,
          setOpen,
          dish,
          quantity,
          setQuantity,
          removedIngredients,
          setRemovedIngredients,
          onSubmit,
          submitLabel: "Dodaj do koszyka",
        }}
      />
    </>
  );
};
