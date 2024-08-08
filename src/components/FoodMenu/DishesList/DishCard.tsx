import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Rating,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useState } from "react";
import { toast, Slide } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

import api from "../../../utils/api";
import { Dish } from "../../../types/dish";
import { AppDispatch, RootState } from "../../../store";
import { CartItem } from "../../../types/cartTypes";
import { IncrementDecrementNumberInput } from "../../inputs/IncrementDecrementNumberInput";
import { addToCart } from "../../../reducers/slices/cartSlice";

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const dispatch: AppDispatch = useDispatch();

  const putIntoCartDialog = (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if ((event.nativeEvent as any).submitter.name === "submit_btn") {
            console.log(quantity, removedIngredients);
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
            setOpen(false);
          }
        },
      }}
    >
      <DialogTitle>
        <Typography sx={{ textAlign: "center", m: 1, fontSize: 35 }}>
          {}
          {dish.name} - {dish.price} zł
        </Typography>
        <Box
          component="img"
          src={dish.image}
          sx={{
            height: 300,
            width: "100%",
            objectFit: "cover",
          }}
        ></Box>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <DialogContentText>Liczba sztuk</DialogContentText>
        <FormGroup sx={{ m: 1 }}>
          <IncrementDecrementNumberInput
            value={quantity}
            setValue={setQuantity}
          />
        </FormGroup>

        <DialogContentText>Modyfikuj składniki</DialogContentText>
        <FormGroup sx={{ my: 2 }}>
          {dish.ingredients.map((ingredient) => (
            <FormControlLabel
              key={ingredient}
              name={ingredient}
              defaultChecked
              label={ingredient}
              control={
                <Checkbox
                  name={ingredient}
                  color="primary"
                  checked={!removedIngredients.includes(ingredient)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    if (checked) {
                      setRemovedIngredients(
                        removedIngredients.filter(
                          (removedIngredient) =>
                            removedIngredient !== ingredient
                        )
                      );
                    } else {
                      setRemovedIngredients([
                        ...removedIngredients,
                        ingredient,
                      ]);
                    }
                  }}
                />
              }
            />
          ))}
        </FormGroup>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ display: "flex", justifyContent: "center", my: 1 }}>
        <Button type="submit" variant="contained" name="submit_btn">
          Dodaj do koszyka - {(quantity * dish.price).toFixed(2)} zł
        </Button>
      </DialogActions>
    </Dialog>
  );

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
      {putIntoCartDialog}
    </>
  );
};
