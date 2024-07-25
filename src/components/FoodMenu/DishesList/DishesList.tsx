import { Divider, Grid, Skeleton, CardMedia, Typography } from "@mui/material";

import { Dish } from "../../../types/dish";
import { DishCard } from "./DishCard";

interface DishesListProps {
  category: string;
}

export const DishesList: React.FC<DishesListProps> = ({ category }) => {
  // TBD: Fetch dishes from API based on category
  const dishes: Dish[] = [
    {
      id: "1",
      name: "Margherita",
      price: 20.99,
      ingredients: ["Sos pomidorowy", "Ser", "Bazylia"],
      category: "Pizza",
      image: "food/pizza1.jpg",
    },
    {
      id: "2",
      name: "Capriciosa",
      price: 25.99,
      ingredients: ["Sos pomidorowy", "Ser", "Szynka", "Pieczarki"],
      category: "Pizza",
      image: "food/pizza2.jpg",
    },
    {
      id: "3",
      name: "Hawajska",
      price: 24.99,
      ingredients: ["Sos pomidorowy", "Ser", "Szynka", "Ananas"],
      category: "Pizza",
      image: "food/pizza3.jpg",
    },
    {
      id: "4",
      name: "Pepperoni",
      price: 23.99,
      ingredients: ["Sos pomidorowy", "Ser", "Pepperoni"],
      category: "Pizza",
      image: "food/pizza4.jpg",
    },
    {
      id: "5",
      name: "Diavola",
      price: 27.99,
      ingredients: ["Sos pomidorowy", "Ser", "Salami", "Oliwki"],
      category: "Pizza",
      image: "food/pizza5.jpg",
    },
    {
      id: "6",
      name: "Vegetariana",
      price: 22.99,
      ingredients: ["Sos pomidorowy", "Ser", "Papryka", "Pieczarki", "Oliwki"],
      category: "Pizza",
      image: "food/pizza6.jpg",
    },
    {
      id: "7",
      name: "Prosciutto",
      price: 26.99,
      ingredients: ["Sos pomidorowy", "Ser", "Szynka", "Rukola"],
      category: "Pizza",
      image: "food/pizza7.jpg",
    },
  ];

  const filteredDishes = dishes.filter((dish) => dish.category === category);
  const dummyDishes = Array(6).fill(null);

  return (
    <>
      <Divider sx={{ marginTop: 3 }} />

      <Typography variant="h2" sx={{ m: 5, textAlign: "center" }}>
        {category}
      </Typography>
      <Grid container justifyContent="space-around" spacing={1} sx={{ mt: 5 }}>
        {filteredDishes.length !== 0
          ? filteredDishes.map((dish) => (
              <Grid item key={dish.id}>
                <DishCard dish={dish} />
              </Grid>
            ))
          : // repeat 6 times
            dummyDishes.map((_, index) => (
              <Grid item key={index}>
                <Skeleton variant="rectangular">
                  <CardMedia sx={{ height: 200, width: 400 }} />
                </Skeleton>
                <Skeleton variant="rectangular" sx={{ mt: 2 }}>
                  <CardMedia sx={{ height: 120, width: 400 }} />
                </Skeleton>
              </Grid>
            ))}
      </Grid>
    </>
  );
};
