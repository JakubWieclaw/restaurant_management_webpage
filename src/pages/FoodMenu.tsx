import { Container, Grid, Divider, Typography } from "@mui/material";

import { useState } from "react";

import { Dish } from "../types/dish";
import { Filters } from "../components/FoodMenu/Filters/Filters";
import { DishesList } from "../components/FoodMenu/DishesList/DishesList";
import { CategorySelector } from "../components/FoodMenu/CategorySelector/CategorySelector";

export const Menu = () => {
  const [minStars, setMinStars] = useState<number>(1);
  const [minMaxPrice, setMinMaxPrice] = useState<number[]>([0, 1000]);
  const [category, setCategory] = useState<string>("Pizza");
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

  const dishes: Dish[] = [
    {
      id: "1",
      name: "Margherita",
      price: 20.99,
      ingredients: ["Sos pomidorowy", "Ser", "Bazylia"],
      category: "Pizza",
      image: "food/pizza1.jpg",
      rating: 4,
    },
    {
      id: "2",
      name: "Capriciosa",
      price: 25.99,
      ingredients: ["Sos pomidorowy", "Ser", "Szynka", "Pieczarki"],
      category: "Pizza",
      image: "food/pizza2.jpg",
      rating: 5,
    },
    {
      id: "3",
      name: "Hawajska",
      price: 24.99,
      ingredients: ["Sos pomidorowy", "Ser", "Szynka", "Ananas"],
      category: "Pizza",
      image: "food/pizza3.jpg",
      rating: 3,
    },
    {
      id: "4",
      name: "Pepperoni",
      price: 23.99,
      ingredients: ["Sos pomidorowy", "Ser", "Pepperoni"],
      category: "Pizza",
      image: "food/pizza4.jpg",
      rating: 2,
    },
    {
      id: "5",
      name: "Diavola",
      price: 27.99,
      ingredients: ["Sos pomidorowy", "Ser", "Salami", "Oliwki"],
      category: "Pizza",
      image: "food/pizza5.jpg",
      rating: 1,
    },
    {
      id: "6",
      name: "Vegetariana",
      price: 22.99,
      ingredients: ["Sos pomidorowy", "Ser", "Papryka", "Pieczarki", "Oliwki"],
      category: "Pizza",
      image: "food/pizza6.jpg",
      rating: 4,
    },
    {
      id: "7",
      name: "Prosciutto",
      price: 26.99,
      ingredients: ["Sos pomidorowy", "Ser", "Szynka", "Rukola"],
      category: "Pizza",
      image: "food/pizza7.jpg",
      rating: 5,
    },
  ];

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.category === category &&
      dish.price >= minMaxPrice[0] &&
      dish.price <= minMaxPrice[1] &&
      dish.ingredients.every(
        (ingredient) => !excludedIngredients.includes(ingredient)
      ) &&
      dish.rating >= minStars
  );

  // Ingredients as a set to avoid duplicates from multiple dishes and sort them alphabetically
  const ingredients = Array.from(
    new Set(filteredDishes.flatMap((dish) => dish.ingredients))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <Container sx={{ mt: 3 }} maxWidth="xl">
      <Grid container>
        <Grid container>
          <Grid item xs={12}>
            <CategorySelector setCategory={setCategory} />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ marginTop: 3 }} />

            <Typography variant="h2" sx={{ m: 5, textAlign: "center" }}>
              {category}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  p: 3,
                  borderRight: { xs: 0, md: 1 },
                  borderColor: { xs: "transparent", md: "divider" },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Filtry
                </Typography>
                <Filters
                  minStars={minStars}
                  setMinStars={setMinStars}
                  minMaxPrice={minMaxPrice}
                  setMinMaxPrice={setMinMaxPrice}
                  excludedIngredients={excludedIngredients}
                  setExcludedIngredients={setExcludedIngredients}
                  ingredients={ingredients}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <DishesList dishes={filteredDishes} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
