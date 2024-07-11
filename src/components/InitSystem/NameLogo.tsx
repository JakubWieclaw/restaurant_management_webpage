import ImageIcon from "@mui/icons-material/Image";
import { Button, Grid, TextField, Typography } from "@mui/material";

interface NameLogoProps {
  restaurantName: string;
  setRestaurantName: (name: string) => void;
  restaurantLogo: File | null;
  setRestaurantLogo: (logo: File | null) => void;
}

export const NameLogo: React.FC<NameLogoProps> = ({
  restaurantName,
  setRestaurantName,
  restaurantLogo,
  setRestaurantLogo,
}) => {
  return (
    <Grid container sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <TextField
          margin="normal"
          required
          label="Nazwa restauracji"
          fullWidth
          value={restaurantName}
          onChange={(e) => {
            setRestaurantName(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <input
          accept="image/*"
          id="file-upload"
          type="file"
          hidden
          onChange={(e) => {
            if (e.target.files) {
              setRestaurantLogo(e.target.files[0]);
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
            Wybierz logo
          </Button>
          <br />
          <Typography variant="caption" color={"GrayText"}>
            ({restaurantLogo ? restaurantLogo.name : "Nie wybrano"})
          </Typography>
        </label>
      </Grid>
    </Grid>
  );
};
