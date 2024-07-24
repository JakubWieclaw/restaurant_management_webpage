import { Grid } from "@mui/material";

import { Dish } from "../../../types/dish";
import { DishCard } from "./DishCard";

export function DishesList() {
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

  return (
    <Grid container justifyContent="space-around" spacing={1} sx={{ mt: 5 }}>
      {dishes.map((dish) => (
        <Grid item key={dish.id}>
          <DishCard dish={dish} />
        </Grid>
      ))}
    </Grid>
  );
}
