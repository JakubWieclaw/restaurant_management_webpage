import {
  Container,
  Divider,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  ListItem,
  Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

import { AxiosResponse } from "axios";
import { useEffect, useState, Fragment } from "react";

import { Category, Meal } from "../api";
import { categoriesApi, mealsApi } from "../utils/api";
import { CategoryModal } from "../components/CategoriesManagement/CategoryModal";
import { DishModal } from "../components/CategoriesManagement/DishModal";

export const CategoriesManagement = () => {
  const [open, setOpen] = useState<boolean[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meals, setMeals] = useState<Meal[][]>([]);
  const [categoryIdxToEdit, setCategoryIdxToEdit] = useState<number | null>(
    null
  );
  const [dishIdxToEdit, setDishIdxToEdit] = useState<number | null>(null);
  const [rerenderOnChange, setRerenderOnChange] = useState<boolean>(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [dishModalOpen, setDishModalOpen] = useState<boolean>(false);

  const handleClick = (idx: number) => {
    setOpen((prev) => {
      const newOpen = [...prev];
      newOpen[idx] = !newOpen[idx];
      return newOpen;
    });
    setMeals((prev: Meal[][]) => {
      return [...prev, []];
    });
  };

  const fetchMealsByCategory = (category: Category, idx: number) => {
    if (category.id !== undefined) {
      return mealsApi
        .getMealsByCategory(category.id)
        .then((response: AxiosResponse) => {
          setMeals((prev: Meal[][]) => {
            const newMeals = [...prev];
            newMeals[idx] = response.data;
            return newMeals;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    console.log("Fetching categories");
    console.log("RerenderOnChange: ", rerenderOnChange);
    categoriesApi
      .getAllCategories()
      .then((response: AxiosResponse) => {
        setCategories(response.data);
        setOpen(Array(response.data.length).fill(false));

        response.data.forEach((category: Category, idx: number) => {
          fetchMealsByCategory(category, idx);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [rerenderOnChange]);

  return (
    <Container maxWidth="md" sx={{ mt: 15 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Zarządzanie kategoriami
      </Typography>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            setCategoryModalOpen(true);
            setCategoryIdxToEdit(null);
          }}
          color="success"
        >
          Dodaj kategorię
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "text.disabled",
            color: "background.paper",
            my: 2,
            borderRadius: 2,
            opacity: 0.9,
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {categories.map((category, idx) => (
            <Fragment key={category.name}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="contained"
                    sx={{ ml: "auto", mr: 0 }}
                    onClick={() => {
                      setCategoryIdxToEdit(idx);
                      setCategoryModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </Button>
                }
              >
                <ListItemButton
                  onClick={() => {
                    handleClick(idx);
                  }}
                >
                  <ListItemIcon>
                    <Box
                      component={"img"}
                      src={category?.photographUrl}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        objectFit: "cover",
                      }}
                    ></Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={category.name}
                    secondary={`Liczba dań: ${meals?.[idx]?.length || 0}`}
                  />
                  {open[idx] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              <Collapse in={open[idx]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {meals.length > idx &&
                    Array.isArray(meals[idx]) &&
                    meals[idx].map((meal, mealIdx) => (
                      <ListItem
                        key={meal.name}
                        secondaryAction={
                          <Button
                            variant="contained"
                            sx={{ ml: "auto", mr: 0 }}
                            color="secondary"
                            onClick={() => {
                              setDishModalOpen(true);
                              setCategoryIdxToEdit(idx);
                              setDishIdxToEdit(mealIdx);
                            }}
                          >
                            <DriveFileRenameOutlineIcon />
                          </Button>
                        }
                      >
                        <ListItemButton
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                              cursor: "default",
                            },
                            pl: 4,
                          }}
                        >
                          <ListItemIcon>
                            <Box
                              component={"img"}
                              src={meal.photographUrl}
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                objectFit: "cover",
                              }}
                            ></Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={meal.name}
                            secondary={meal.price + " zł"}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </Fragment>
          ))}
        </List>
      </Box>
      <CategoryModal
        open={categoryModalOpen}
        setOpen={setCategoryModalOpen}
        category={
          categoryIdxToEdit !== null ? categories[categoryIdxToEdit] : null
        }
        setRerenderOnChange={setRerenderOnChange}
        setCategory={(category: Category | null) => {
          if (category !== null) {
            setCategories((prev) => {
              const newCategories = [...prev];
              newCategories[categoryIdxToEdit as number] = category;
              return newCategories;
            });
          } else if (categoryIdxToEdit !== null) {
            // delete category
            setCategories((prev) => {
              const newCategories = [...prev];
              newCategories.splice(categoryIdxToEdit, 1);
              return newCategories;
            });
          }
        }}
      />
      <DishModal
        open={dishModalOpen}
        setOpen={setDishModalOpen}
        dish={
          dishIdxToEdit !== null && categoryIdxToEdit !== null
            ? meals[categoryIdxToEdit][dishIdxToEdit]
            : null
        }
        setDish={(dish: Meal | null) => {
          if (dish !== null) {
            setMeals((prev) => {
              const newMeals = [...prev];
              newMeals[categoryIdxToEdit as number][dishIdxToEdit as number] =
                dish;
              return newMeals;
            });
          } else if (dishIdxToEdit !== null && categoryIdxToEdit !== null) {
            // delete dish
            setMeals((prev) => {
              const newMeals = [...prev];
              newMeals[categoryIdxToEdit].splice(dishIdxToEdit, 1);
              return newMeals;
            });
          }
        }}
        setRerenderOnChange={setRerenderOnChange}
        categories={categories}
        categoryIdx={categoryIdxToEdit as number}
      />
    </Container>
  );
};
