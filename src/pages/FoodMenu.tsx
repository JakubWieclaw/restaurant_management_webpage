import { Container, Grid, Divider, Typography } from "@mui/material";

import { useState } from "react";

import { CategorySelector } from "../components/FoodMenu/CategorySelector/CategorySelector";
import { DishesList } from "../components/FoodMenu/DishesList/DishesList";
export const Menu = () => {
  const [category, setCategory] = useState<string>("Pizza");

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
              <Grid item xs={3}>
                Site navigation
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
