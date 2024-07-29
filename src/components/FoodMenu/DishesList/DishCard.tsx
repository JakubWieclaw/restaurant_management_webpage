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
  styled,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Unstable_NumberInput as BaseNumberInput } from "@mui/base/Unstable_NumberInput";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useState } from "react";

import { Dish } from "../../../types/dish";

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const [open, setOpen] = useState(false);

  const blue = {
    100: "#daecff",
    200: "#b6daff",
    300: "#66b2ff",
    400: "#3399ff",
    500: "#007fff",
    600: "#0072e5",
    700: "#0059B2",
    800: "#004c99",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const StyledInputRoot = styled("div")(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[500]};
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  `
  );

  const StyledInput = styled("input")(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.375;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
    };
    border-radius: 8px;
    margin: 0 8px;
    padding: 10px 12px;
    outline: 0;
    min-width: 0;
    width: 4rem;
    text-align: center;
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[700] : blue[200]
      };
    }
  
    &:focus-visible {
      outline: 0;
    }
  `
  );

  const StyledButton = styled("button")(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    line-height: 1.5;
    border: 1px solid;
    border-radius: 999px;
    border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    width: 32px;
    height: 32px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      cursor: pointer;
      background: ${theme.palette.mode === "dark" ? blue[700] : blue[500]};
      border-color: ${theme.palette.mode === "dark" ? blue[500] : blue[400]};
      color: ${grey[50]};
    }
  
    &:focus-visible {
      outline: 0;
    }
  
    &.increment {
      order: 1;
    }
  `
  );

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
        <Typography variant="h4" sx={{ textAlign: "center", m: 1 }}>
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
      <DialogContent>
        <DialogContentText>Wybierz ilość</DialogContentText>
        <BaseNumberInput
          slots={{
            root: StyledInputRoot,
            input: StyledInput,
            incrementButton: StyledButton,
            decrementButton: StyledButton,
          }}
          slotProps={{
            incrementButton: {
              children: <AddIcon fontSize="small" />,
              className: "increment",
            },
            decrementButton: {
              children: <RemoveIcon fontSize="small" />,
            },
          }}
        />

        <DialogContentText>Modyfikuj składniki</DialogContentText>
        <FormGroup>
          {dish.ingredients.map((ingredient) => (
            <FormControlLabel
              key={ingredient}
              name={ingredient}
              defaultChecked
              label={ingredient}
              control={
                <Checkbox name={ingredient} defaultChecked color="primary" />
              }
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button type="submit" variant="contained">
          Dodaj do koszyka
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
