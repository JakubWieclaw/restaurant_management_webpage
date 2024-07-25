import {
  Container,
  Grid,
  Divider,
  Typography,
  List,
  ListItem,
  Autocomplete,
  Chip,
  TextField,
  ListSubheader,
  Rating,
  Slider,
} from "@mui/material";

import { useState } from "react";

import { CategorySelector } from "../components/FoodMenu/CategorySelector/CategorySelector";
import { DishesList } from "../components/FoodMenu/DishesList/DishesList";
export const Menu = () => {
  const [minStars, setMinStars] = useState<number>(1);
  const [minMaxPrice, setMinMaxPrice] = useState<number[]>([0, 1000]);
  const [category, setCategory] = useState<string>("Pizza");
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

  const handlePriceFilter = (
    _: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < 10) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 200 - 10);
        setMinMaxPrice([clamped, clamped + 10]);
      } else {
        const clamped = Math.max(newValue[1], 10);
        setMinMaxPrice([clamped - 10, clamped]);
      }
    } else {
      setMinMaxPrice(newValue);
    }
  };

  const ingredients = ["Ser", "Szynka", "Pieczarki", "Ananas", "Oliwki"];

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
                xs={3}
                sx={{ p: 3, borderRight: 1, borderColor: "divider" }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Filtry
                </Typography>
                <List>
                  {/* filters like price, rating, ingridients to exclude */}
                  <ListSubheader>Cena</ListSubheader>
                  <ListItem sx={{ mt: 4 }}>
                    <Slider
                      value={minMaxPrice}
                      onChange={handlePriceFilter}
                      valueLabelDisplay="auto"
                      getAriaValueText={(num: number) => `${num} zł`}
                      disableSwap
                      min={0}
                      max={200}
                    />
                  </ListItem>
                  <Divider />

                  <ListSubheader>Minimalna ocena</ListSubheader>
                  <ListItem>
                    <Rating
                      value={minStars}
                      onChange={(_, value) => {
                        setMinStars(value ?? 1);
                      }}
                    />
                  </ListItem>
                  <Divider />

                  <ListSubheader>Składniki do wykluczenia</ListSubheader>
                  <ListItem>
                    <Autocomplete
                      multiple
                      value={excludedIngredients}
                      onChange={(_, newValue) => {
                        setExcludedIngredients([...newValue]);
                      }}
                      options={ingredients}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip key={key} label={option} {...tagProps} />
                          );
                        })
                      }
                      style={{ width: 500 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={9}>
                <DishesList category={category} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
