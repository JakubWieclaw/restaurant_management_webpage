import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Rating,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useState } from "react";
import { toast, Slide } from "react-toastify";
import { useDispatch } from "react-redux";

import { Dish } from "../../../types/dish";
import { DishDialog } from "./DishDialog";
import { CartItem } from "../../../types/cartTypes";
import { addToCart } from "../../../reducers/slices/cartSlice";

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
      <Card>
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

        <CardActions>
          <Rating
            name="read-only"
            sx={{ mr: "auto", ml: 0 }}
            value={dish.rating}
            readOnly
          />
          <Button
            variant="contained"
            sx={{ ml: "auto", mr: 0 }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <ShoppingCartIcon />
          </Button>
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
