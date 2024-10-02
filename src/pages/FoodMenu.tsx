import {
  Container,
  Grid,
  Divider,
  Typography,
  TextField,
  List,
  ListItem,
  Button,
  Box,
} from "@mui/material";

import { useEffect, useState } from "react";

import { Dish } from "../types/dish";
import { categoriesApi, mealsApi, opinionApi } from "../utils/api";
import { Filters } from "../components/FoodMenu/Filters/Filters";
import { DishesList } from "../components/FoodMenu/DishesList/DishesList";
import { CategorySelector } from "../components/FoodMenu/CategorySelector/CategorySelector";
import { Category, Meal } from "../api";
import { AIChat } from "./AIChat";

export const fetchRating = async (meal: Meal) => {
  let rating = 5; // 1 is minimum rating - bugs otherwise
  await opinionApi
    .getAverageRating(meal.id!)
    .then((response) => {
      console.log(response);
      rating = response.data.averageRating ?? 5;
    })
    .catch((_) => {});
  return rating;
};

export const Menu = () => {
  const [minStars, setMinStars] = useState<number>(1);
  const [minMaxPrice, setMinMaxPrice] = useState<number[]>([0, 1000]);
  const [category, setCategory] = useState<string>("");
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [chatOpen, setChatOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchPhrase === "") {
          const categoriesResponse = await categoriesApi.getAllCategories();
          const categoriesData: Category[] = categoriesResponse.data;
          if (category === "" && categoriesData.length > 0) {
            setCategory(categoriesData[0].name);
          }
          const categoriesMap: { [key: string]: string } = Object.fromEntries(
            categoriesData.map((category: Category) => [
              category.id,
              category.name,
            ])
          );

          const mealsResponse = await mealsApi.getAllMeals();
          const meals: Meal[] = mealsResponse.data;

          const dishes = await Promise.all(
            meals.map(async (meal: Meal) => ({
              id: meal.id ?? 0,
              name: meal.name,
              price: meal.price ?? 0,
              ingredients: meal.ingredients ?? [],
              category: categoriesMap[meal.categoryId] ?? "",
              image: meal.photographUrl ?? "",
              rating: await fetchRating(meal),
              allergens: meal.allergens ?? [],
            }))
          );
          setDishes(dishes);
        } else {
          const mealsResponse = await mealsApi.searchMealsByName(searchPhrase);
          const meals: Meal[] = mealsResponse.data as Meal[];

          console.log(meals);

          const dishes = await Promise.all(
            meals.map(async (meal: Meal) => ({
              id: meal.id ?? 0,
              name: meal.name,
              price: meal.price ?? 0,
              ingredients: meal.ingredients ?? [],
              category: category,
              image: meal.photographUrl ?? "",
              rating: await fetchRating(meal),
              allergens: meal.allergens ?? [],
            }))
          );
          setDishes(dishes);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setDishes([]);
      }
    };

    fetchData();
  }, [searchPhrase]);

  useEffect(() => {
    setSearchPhrase("");
  }, [category]);

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

            <Typography variant="h2" sx={{ mt: 5, textAlign: "center" }}>
              {searchPhrase === ""
                ? category
                : "Wyszukiwanie dla: " + searchPhrase}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{ mb: 5, textAlign: "center" }}
            >
              {filteredDishes.length === 0
                ? "Brak wyników"
                : "Liczba dań: " + filteredDishes.length}
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mb: 2,
                      width: "60%",
                    }}
                    onClick={() => {
                      setChatOpen(true);
                    }}
                  >
                    Poradź się SI!
                  </Button>
                </Box>
                <Divider />
                <List>
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    Wyszukaj po nazwie
                  </Typography>
                  <ListItem>
                    <TextField
                      fullWidth
                      variant="outlined"
                      sx={{
                        my: 1,
                      }}
                      placeholder="Hawajska"
                      value={searchPhrase}
                      onChange={(event) => setSearchPhrase(event.target.value)}
                      type="search"
                    />
                  </ListItem>
                </List>

                <Divider
                  sx={{
                    mb: 2,
                    mt: 2,
                  }}
                />
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
      <AIChat openChat={chatOpen} setOpenChat={setChatOpen} />
    </Container>
  );
};
