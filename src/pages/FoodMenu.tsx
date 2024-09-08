import { Container, Grid, Divider, Typography } from "@mui/material";

import { useEffect, useState } from "react";

import { Dish } from "../types/dish";
import { categoriesApi, mealsApi } from "../utils/api";
import { Filters } from "../components/FoodMenu/Filters/Filters";
import { DishesList } from "../components/FoodMenu/DishesList/DishesList";
import { CategorySelector } from "../components/FoodMenu/CategorySelector/CategorySelector";
import { Category, Meal } from "../api";

export const Menu = () => {
  const [minStars, setMinStars] = useState<number>(1);
  const [minMaxPrice, setMinMaxPrice] = useState<number[]>([0, 1000]);
  const [category, setCategory] = useState<string>("Pizza");
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await categoriesApi.getAllCategories();
        const categoriesData: Category[] =
          categoriesResponse.data as Category[];
        if (categoriesData.length !== 0) {
          setCategory(categoriesData[0].name);
        }
        const categoriesMap: { [key: string]: string } = Object.fromEntries(
          categoriesData.map((category: Category) => [
            category.id,
            category.name,
          ])
        );

        const mealsResponse = await mealsApi.getAllMeals();
        const meals: Meal[] = mealsResponse.data as Meal[];

        setDishes(
          meals.map((meal: Meal) => ({
            id: meal.id ?? 0,
            name: meal.name,
            price: meal.price ?? 0,
            ingredients: meal.ingredients ?? [],
            category: categoriesMap[meal.categoryId] ?? "",
            image: meal.photographUrl ?? "",
            rating: 5,
          }))
        );
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.category === category &&
      dish.price >= minMaxPrice[0] &&
      dish.price <= minMaxPrice[1] &&
      dish.ingredients?.every(
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
