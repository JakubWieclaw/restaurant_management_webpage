import ImageIcon from "@mui/icons-material/Image";
import { Button, Grid, TextField, Typography } from "@mui/material";

import { useContext } from "react";

import { WizardContext } from "../../pages/InitSystem";

export const NameLogo = () => {
  const ctx = useContext(WizardContext);
  return (
    <Grid container sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Nazwa restauracji"
          fullWidth
          value={ctx.restaurantName}
          onChange={(e) => {
            ctx.setRestaurantName(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <input
          accept="image/*"
          id="file-upload"
          type="file"
          hidden
          required
          onChange={(e) => {
            if (e.target.files) {
              ctx.setRestaurantLogo(e.target.files[0]);
            }
          }}
        />
        <label htmlFor="file-upload">
          <Button
            startIcon={<ImageIcon />}
            variant="contained"
            component="span"
            sx={{ my: 2, py: 1 }}
          >
            Wybierz logo *
          </Button>
          <br />
          <Typography
            variant="caption"
            color={ctx.restaurantLogo ? "GrayText" : "Red"}
          >
            (
            {ctx.restaurantLogo
              ? ctx.restaurantLogo.name
              : "Nie wybrano - wymagane"}
            )
          </Typography>
        </label>
      </Grid>
    </Grid>
  );
};
