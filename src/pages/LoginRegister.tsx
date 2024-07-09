import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export function LoginRegister() {
  return (
    <Container maxWidth="md" sx={{ mt: 15 }}>
      <Grid container sx={{ textAlign: "center" }}>
        <Grid item>
          <form>
            <TextField></TextField>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
