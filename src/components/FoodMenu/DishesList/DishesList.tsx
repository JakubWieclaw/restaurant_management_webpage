import { Grid, Skeleton, CardMedia } from "@mui/material";

import { Dish } from "../../../types/dish";
import { DishCard } from "./DishCard";

interface DishesListProps {
  dishes: Dish[];
}

export const DishesList: React.FC<DishesListProps> = ({ dishes }) => {
  const dummyDishes = Array(6).fill(null);

  return (
    <Grid container justifyContent="space-around">
      {dishes.length !== 0
        ? dishes.map((dish) => (
            <Grid item key={dish.id} sx={{ mb: 1 }}>
              <DishCard dish={dish} />
            </Grid>
          ))
        : // repeat 6 times
          dummyDishes.map((_, index) => (
            <Grid item key={index} sx={{ mb: 2 }}>
              <Skeleton variant="rounded">
                <CardMedia sx={{ height: 200, width: 400, mb: 1 }} />
              </Skeleton>
              <Skeleton variant="rounded">
                <CardMedia sx={{ height: 120, width: 400 }} />
              </Skeleton>
            </Grid>
          ))}
    </Grid>
  );
};
