import { Container, Grid } from "@mui/material";

export function Menu() {
  return (
    <Container sx={{ mt: 3 }}>
      <Grid container>
        <Grid item xs={2}>
          Site navigation
        </Grid>
        <Grid item xs={10}>
          <Grid container>
            <Grid item xs={12}>
              Category selector
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
