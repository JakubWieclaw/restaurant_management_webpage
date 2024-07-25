import { Container, Grid } from "@mui/material";

import { useState } from "react";

import { CategorySelector } from "../components/FoodMenu/CategorySelector/CategorySelector";
import { DishesList } from "../components/FoodMenu/DishesList/DishesList";

export function Menu() {
  const [category, setCategory] = useState<string>("Pizza");

  return (
    <Container sx={{ mt: 3 }} maxWidth="xl">
      <Grid container>
        <Grid item xs={2}>
          Site navigation
        </Grid>
        <Grid item xs={10}>
          <Grid container>
            <Grid item xs={12}>
              <CategorySelector setCategory={setCategory} />
            </Grid>
            <Grid item xs={12}>
              <DishesList category={category} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
