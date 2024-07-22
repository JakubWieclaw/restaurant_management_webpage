import { Container, Grid } from "@mui/material";
import { CategorySelector } from "../components/FoodMenu/CategorySelector/CategorySelector";

export function Menu() {
  return (
    <Container sx={{ mt: 3 }} maxWidth="xl">
      <Grid container>
        <Grid item xs={2}>
          Site navigation
        </Grid>
        <Grid item xs={10}>
          <Grid container>
            <Grid item xs={12}>
              <CategorySelector />
            </Grid>
            <Grid item xs={12}>
              Product list
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
