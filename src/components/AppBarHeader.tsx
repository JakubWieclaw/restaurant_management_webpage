import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Menu,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

export const AppBarHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <Box
              component={"img"}
              sx={{
                width: 50,
                marginRight: 1,
              }}
              src="icons8-meal.svg"
            ></Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                letterSpacing: 3,
              }}
            >
              SZR
            </Typography>
          </Link>
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              flexGrow: 1,
            }}
          />
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(e: any) => setAnchorEl(e.currentTarget)}
            color="inherit"
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            <MenuItem onClick={() => setAnchorEl(null)} key="page">
              <Link
                to="/initialize-system"
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                Inicjalizuj system
              </Link>
            </MenuItem>
          </Menu>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexGrow: 1,
            }}
          >
            <Button key="page" sx={{ my: 2, color: "white", display: "block" }}>
              <Link
                to="/initialize-system"
                style={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Inicjalizuj system
              </Link>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
