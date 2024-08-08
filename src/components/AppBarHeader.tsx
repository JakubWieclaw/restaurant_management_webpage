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
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

import { useState } from "react";
import { toast, Slide } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState, AppDispatch } from "../store";
import { logout } from "../reducers/slices/userSlice";

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
  ];

  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);
  const handleLogin = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Wylogowano pomyślnie", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
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
            <IconButton
              size="large"
              color="inherit"
              onClick={() => {
                console.log(cart.items);
              }}
            >
              <Badge badgeContent={cart.items.length} color="error">
                <ShoppingBasketIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              sx={{ marginRight: 1 }}
            >
              <Badge badgeContent={7} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
