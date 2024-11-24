import {
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  TextField,
  FormGroup,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Typography,
  DialogActions,
  Chip,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Autocomplete from "@mui/material/Autocomplete";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";

import { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { Transition } from "../../utils/Transision";
import { mealsApi, photoApi, auth } from "../../utils/api";
import { Meal, Category, MealUnitTypeEnum, MealAddCommand } from "../../api";

interface DishModalProps {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  dish: Meal | null;
  setDish: (arg0: Meal | null) => void;
  categories: Category[];
  setRerenderOnChange: any;
  allIngredients: string[];
  allAllergens: string[];
}

export const DishModal: React.FC<DishModalProps> = ({
  open,
  setOpen,
  dish,
  setDish,
  categories,
  setRerenderOnChange,
  allIngredients: ingredients,
  allAllergens: allergens,
}) => {
  useEffect(() => {
    setDishCopy(dish);
  }, [dish]);

  const user = useSelector((state: RootState) => state.user);

  const [dishCopy, setDishCopy] = useState<Meal | null>(dish);
  const [selectedUnit, setSelectedUnit] = useState<MealUnitTypeEnum>(
    MealUnitTypeEnum.Gramy
  );
  const [photo, setPhoto] = useState<File | null>(null);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dish ? "Danie: " + dish.name : "Nowe danie"}
      </DialogTitle>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1,
        }}
      >
        {dish?.id && (
          <Link to={`/coupons/add/${dish?.id}`}>Dodaj kupon do tego dania</Link>
        )}
      </Typography>
      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          if (!dishCopy?.photographUrl && !photo) {
            toast.error("Ikonka jest wymagana.", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Slide,
            });
            return;
          }
          if (dishCopy?.id) {
            // update dish
            if (photo) {
              photoApi
                .uploadPhoto(photo, auth(user?.loginResponse?.token))
                .then((response) => {
                  dishCopy.photographUrl =  response.data;
                })
                .catch((error) => {
                  toast.error(
                    error.response.data?.name ??
                      JSON.stringify(error.response.data),
                    {
                      position: "bottom-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      transition: Slide,
                    }
                  );
                });
            }

            mealsApi
              .updateMeal(dishCopy.id, dishCopy as MealAddCommand, auth(user?.loginResponse?.token))
              .then((_) => {
                toast.success("Danie zaktualizowane pomyślnie.", {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  transition: Slide,
                });
                setOpen(false);
                setDish({
                  ...dishCopy,
                  name: dishCopy.name ?? "",
                  categoryId: dishCopy.categoryId ?? -1,
                });
                setRerenderOnChange((prev: boolean) => !prev);
              })
              .catch((_) => {
                toast.info("Błąd podczas aktualizacji dania.", {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  transition: Slide,
                });
              });
          } else if (dish === null) {
            // add dish
            if (photo) {
              photoApi
                .uploadPhoto(photo, auth(user?.loginResponse?.token))
                .then((response) => {
                  mealsApi
                    .addMeal({
                      ...dishCopy,
                      photographUrl:  response.data,
                    } as MealAddCommand,
                    auth(user?.loginResponse?.token)
                  )
                    .then((_) => {
                      toast.success("Danie dodane pomyślnie.", {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                      });
                      setOpen(false);
                      setDish({
                        ...dishCopy,
                        name: dishCopy?.name ?? "",
                        categoryId: dishCopy?.categoryId ?? -1,
                      });
                      setRerenderOnChange((prev: boolean) => !prev);
                    })
                    .catch((error) => {
                      toast.error(
                        error.response.data?.name ??
                          JSON.stringify(error.response.data),
                        {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                          transition: Slide,
                        }
                      );
                    });
                })
                .catch((error) => {
                  toast.error(
                    error.response.data?.name ??
                      JSON.stringify(error.response.data),
                    {
                      position: "bottom-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                      transition: Slide,
                    }
                  );
                });
            } else {
              toast.error("Ikonka jest wymagana.", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
              });
            }
          } else {
            toast.info(
              "Nie udało się zaktualizować kategorii. Spróbuj ponownie.",
              {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
              }
            );
          }
        }}
      >
        <DialogContent id="alert-dialog-slide-description">
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              alignItems: "center",
            }}
          >
            <Box>
              <TextField
                label="Nazwa"
                value={dishCopy?.name ?? ""}
                required
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    name: e.target.value,
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
              />
            </Box>
            <Box>
              <TextField
                label="Cena (zł)"
                value={dishCopy?.price ?? ""}
                required
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    price: Number(e.target.value),
                    name: dishCopy?.name ?? "",
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
                type="number"
                inputProps={{
                  min: 0,
                  step: 0.01,
                }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Kategoria</InputLabel>
                <Select
                  id="category-select"
                  labelId="category-select-label"
                  value={
                    dishCopy?.categoryId == null || dishCopy?.categoryId == -1
                      ? ""
                      : dishCopy?.categoryId
                  }
                  required
                  label="Kategoria"
                  onChange={(e) => {
                    setDishCopy({
                      ...dishCopy,
                      categoryId: Number(e.target.value),
                      name: dishCopy?.name ?? "",
                    });
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                width: "100%",
                maxWidth: "230px",
              }}
            >
              <Autocomplete
                key={dishCopy?.id}
                multiple
                id="tags-outlined"
                options={ingredients.map((ingredient) => ingredient)}
                value={dishCopy?.ingredients ?? []}
                onChange={(_, newValue) => {
                  setDishCopy({
                    ...dishCopy,
                    ingredients: newValue,
                    name: dishCopy?.name ?? "",
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) => {
                  return value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        variant="outlined"
                        label={option}
                        key={key}
                        {...tagProps}
                      />
                    );
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Składniki"
                    placeholder="..."
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                maxWidth: "230px",
              }}
            >
              <Autocomplete
                key={dishCopy?.id}
                multiple
                id="tags-outlined"
                options={allergens.map((allergen) => allergen)}
                value={dishCopy?.allergens ?? []}
                onChange={(_, newValue) => {
                  setDishCopy({
                    ...dishCopy,
                    allergens: newValue,
                    name: dishCopy?.name ?? "",
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) => {
                  return value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        variant="outlined"
                        label={option}
                        key={key}
                        {...tagProps}
                      />
                    );
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Alergeny"
                    placeholder="..."
                  />
                )}
              />
            </Box>
            <Box>
              <TextField
                label="Kalorie (kcal)"
                value={dishCopy?.calories ?? ""}
                required
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    calories: Number(e.target.value),
                    name: dishCopy?.name ?? "",
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
                type="number"
                inputProps={{
                  min: 0,
                  step: 1,
                }}
              />
            </Box>
            <Box>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="units"
                  name="position"
                  defaultValue="top"
                >
                  {Object.values(MealUnitTypeEnum).map((unit) => (
                    <FormControlLabel
                      key={unit}
                      value={unit}
                      control={<Radio size="small" />}
                      label={<Typography variant="caption">{unit}</Typography>}
                      labelPlacement="top"
                      onChange={(e: any) => {
                        setSelectedUnit(e.target.value as MealUnitTypeEnum);
                      }}
                      checked={selectedUnit === unit}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
            <Box>
              <TextField
                required
                label={`Wartość (${selectedUnit})`}
                value={dishCopy?.weightOrVolume ?? ""}
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    weightOrVolume: Number(e.target.value),
                    name: dishCopy?.name ?? "",
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
                type="number"
                inputProps={{
                  min: 0,
                  step: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
                maxWidth: "230px",
              }}
            >
              <input
                accept="image/*"
                id="file-upload-dish"
                type="file"
                hidden
                onChange={(e: any) => {
                  if (e.target.files) {
                    setPhoto(e.target.files[0]);
                    setDishCopy({
                      ...dishCopy,
                      photographUrl: e.target.files[0].name,
                      name: dishCopy?.name ?? "",
                      categoryId: dishCopy?.categoryId ?? -1,
                    });
                  }
                }}
              />
              <label htmlFor="file-upload-dish">
                <Button
                  startIcon={<ImageIcon />}
                  variant="contained"
                  component="span"
                  sx={{
                    mb: 1,
                    py: 1,
                  }}
                >
                  Ikonka *
                </Button>
                <br />
              </label>
              <Typography
                variant="caption"
                color={dishCopy?.photographUrl ? "GrayText" : "Red"}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                (
                {dishCopy?.photographUrl
                  ? dishCopy?.photographUrl
                  : "Nie wybrano - wymagane"}
                )
              </Typography>
            </Box>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            autoFocus
          >
            Anuluj
          </Button>
          {dish ? (
            <>
              <Button
                onClick={() => {
                  // delete dish
                  if (!dishCopy?.id) return;
                  mealsApi
                    .deleteMealById(dishCopy.id, auth(user?.loginResponse?.token))
                    .then((response: AxiosResponse) => {
                      toast.success(response.data, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                      });
                      setOpen(false);
                      setDish(null);
                      setRerenderOnChange((prev: boolean) => !prev);
                    })
                    .catch((_) => {
                      toast.error("Błąd podczas usuwania dania.", {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                      });
                    });
                }}
                color="error"
              >
                Usuń
              </Button>
              <Button type="submit" color="warning">
                Zapisz
              </Button>
            </>
          ) : (
            <Button type="submit" color="success">
              Dodaj
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
