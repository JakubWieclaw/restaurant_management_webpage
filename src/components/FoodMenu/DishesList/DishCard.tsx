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
  TextField,
  DialogActions,
  Box,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useState } from "react";

import { Dish } from "../../../types/dish";

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const [open, setOpen] = useState(false);

  const putIntoCartDialog = (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          setOpen(false);
        },
      }}
    >
      <DialogTitle>
        <Box component="img"></Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit">Subscribe</Button>
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
