import {
  Link,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { Link as RouterLink } from "react-router-dom";

import { Dish } from "../../../types/dish";

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  return (
    <Link component={RouterLink} to="/" underline="none">
      <Card
        onClick={() => {
          alert("clicked!");
        }}
      >
        <CardMedia
          image={dish.image}
          title={dish.name}
          sx={{ height: 200, width: 400, objectFit: "cover" }}
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
          <Button variant="contained" sx={{ ml: "auto", mr: 0 }}>
            <ShoppingCartIcon />
          </Button>
        </CardActions>
      </Card>
    </Link>
  );
};
