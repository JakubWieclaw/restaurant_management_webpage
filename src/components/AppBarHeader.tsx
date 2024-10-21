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

import { useEffect, useState } from "react";
import { toast, Slide } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState, AppDispatch } from "../store";
import { logout } from "../reducers/slices/userSlice";
import { couponsApi, photoDownloadUrl } from "../utils/api";
import { Coupon } from "../api";

export const AppBarHeader = () => {
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [newCoupons, setNewCoupons] = useState<Coupon[]>([]);

  const config = useSelector((state: RootState) => state.config);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!user.loginResponse) return;
      couponsApi
        .getCouponsForCustomer(user.loginResponse.customerId!)
        .then((response) => {
          setNewCoupons(
            response.data.filter((coupon) => coupon.active === true)
          );
        });
    };
    fetchCoupons();
  }, []);

  const appBarMenuItems = [
    {
      label: "Moje zamówienia",
      link: "/customer-orders",
    },
    {
      label: "Kontakt",
      link: "/contact",
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
              display: { xs: "none", md: "block" },
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
                src={photoDownloadUrl + config.config.logoUrl}
              ></Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 3,
                }}
              >
                {config.config.restaurantName}
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
              display: { xs: "block", md: "none" },
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
              display: { xs: "block", md: "none" },
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
              display: { xs: "flex", md: "none" },
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
                src={photoDownloadUrl + config.config.logoUrl}
              ></Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 3,
                }}
              >
                {config.config.restaurantName}
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
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
                navigate("/cart");
              }}
            >
              <Badge badgeContent={cart.items.length} color="error">
                <ShoppingBasketIcon />
              </Badge>
            </IconButton>
            {user.loginResponse && (
              <>
                <IconButton
                  size="large"
                  aria-label={`${newCoupons.length} notifications`}
                  color="inherit"
                  sx={{ marginRight: 1 }}
                  onClick={(e: any) =>
                    setAnchorElNotifications(e.currentTarget)
                  }
                >
                  <Badge badgeContent={newCoupons.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNotifications}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    mt: "45px",
                    display: newCoupons.length === 0 ? "none" : "block",
                  }}
                  open={Boolean(anchorElNotifications)}
                  onClose={() => setAnchorElNotifications(null)}
                >
                  {newCoupons.map((coupon) => (
                    <MenuItem key={coupon.id} disabled={true}>
                      Otrzymałeś kupon na 1x{coupon.meal?.name} obniżający cenę
                      o {coupon.discountPercentage}% - kod: {coupon.code}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}

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
              {user.loginResponse?.isAdmin && [
                <MenuItem
                  key="categories-management"
                  onClick={() => {
                    navigate("/categories-management");
                  }}
                >
                  Zarządzaj kategoriami
                </MenuItem>,
                <MenuItem
                  key="tables"
                  onClick={() => {
                    navigate("/tables-management");
                  }}
                >
                  Stoliki i rezerwacje
                </MenuItem>,
                <MenuItem
                  key="orders"
                  onClick={() => {
                    navigate("/orders");
                  }}
                >
                  Zamówienia klientów
                </MenuItem>,
                <MenuItem
                  key="admin-panel"
                  onClick={() => {
                    navigate("/admin-panel");
                  }}
                >
                  Panel administracyjny
                </MenuItem>,
                <MenuItem
                  key="initialize-system"
                  onClick={() => {
                    navigate("/initialize-system");
                  }}
                >
                  Inicjalizuj system
                </MenuItem>,
              ]}
              {user.loginResponse !== null ? (
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
