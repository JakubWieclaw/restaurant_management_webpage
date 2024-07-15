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
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useState } from "react";
import { Link } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import { login, logout } from "../utils/userSlice";
import { useSelector, useDispatch } from "react-redux";

export const AppBarHeader = () => {
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const appBarLogo = "icons8-meal.svg";
  const appBarTitle = "SZR";
  const appBarMenuItems = [
    {
      label: "Inicjalizuj system",
      link: "/initialize-system",
    },
    {
      label: "Zaloguj się",
      link: "/auth",
    },
  ];

  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const handleLogin = () => {
    dispatch(login());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
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
                src={appBarLogo}
              ></Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 3,
                }}
              >
                {appBarTitle}
              </Typography>
            </Link>
          </Box>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(e: any) => setAnchorElMenu(e.currentTarget)}
            color="inherit"
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElMenu}
            open={Boolean(anchorElMenu)}
            onClose={() => setAnchorElMenu(null)}
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
            {appBarMenuItems.map((item, index) => (
              <MenuItem
                key={"xs" + index}
                onClick={() => setAnchorElMenu(null)}
              >
                <Link
                  to={item.link}
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  {item.label}
                </Link>
              </MenuItem>
            ))}
          </Menu>

          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
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
                src={appBarLogo}
              ></Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 3,
                }}
              >
                {appBarTitle}
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexGrow: 1,
            }}
          >
            {appBarMenuItems.map((item, index) => (
              <Button
                key={"sm" + index}
                color="inherit"
                component={Link}
                to={item.link}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={(e: any) => setAnchorElProfile(e.currentTarget)}
                sx={{ p: 0 }}
              >
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElProfile}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElProfile)}
              onClose={() => setAnchorElProfile(null)}
            >
              {user.loggedIn ? (
                <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
              ) : (
                <MenuItem onClick={handleLogin}>Zaloguj się</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
