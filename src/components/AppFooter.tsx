import { Box, Typography, AppBar, Container, Toolbar } from "@mui/material";

export const AppFooter = () => {
  return (
    <Box
      component={"footer"}
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <AppBar position="static">
        <Container>
          <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" color="inherit">
              {new Date().getFullYear()} &copy; SZR
            </Typography>
          </Toolbar>
        </Container>
        {/* <BottomNavigation showLabels onChange={(event, newValue) => {}}>
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation> */}
      </AppBar>
    </Box>
  );
};
