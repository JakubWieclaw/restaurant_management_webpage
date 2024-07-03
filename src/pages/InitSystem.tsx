import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ImageIcon from "@mui/icons-material/Image";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";

// Consider Stepper/Wizard form for better UX

export function InitSystem() {
  return (
    <Container maxWidth="sm">
      <Box component="h1">Wprowadź dane dotyczące restauracji</Box>

      <Box component="form">
        <Grid container>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              label="Nazwa restauracji"
              autoFocus
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              label="Waluta"
              autoFocus
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              label="Adres"
              autoFocus
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              label="Nr telefonu"
              autoFocus
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              label="Koszt dostawy"
              autoFocus
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <input accept="image/*" id="file-upload" type="file" hidden />
            <label htmlFor="file-upload">
              <Button
                startIcon={<ImageIcon />}
                variant="contained"
                component="span"
                fullWidth
                sx={{ marginY: 2, paddingY: 1 }}
              >
                Wybierz logo
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Divider orientation="horizontal" flexItem />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ marginY: 2, paddingY: 1 }}
            >
              Zapisz
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
