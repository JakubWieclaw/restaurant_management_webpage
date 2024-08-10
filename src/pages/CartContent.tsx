import { DataGrid } from "@mui/x-data-grid";
import { Box, Container, Divider, Typography } from "@mui/material";

import { useSelector } from "react-redux";

import { RootState } from "../store";

export const CartContent = () => {
  const cart = useSelector((state: RootState) => state.cart);
  console.log(cart);

  return (
    <Container maxWidth="md" sx={{ mt: 15 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Twój koszyk
      </Typography>
      <Divider />

      <Box>
        <DataGrid
          rows={cart.items.map((item, index) => ({
            id: index + 1,
            name: item.dish.name,
            quantity: item.quantity,
            price: item.dish.price * item.quantity + " zł",
          }))}
          columns={[
            { field: "id", headerName: "Lp." },
            { field: "name", headerName: "Danie" },
            { field: "quantity", headerName: "Ilość" },
            { field: "price", headerName: "Cena" },
          ]}
          hideFooter={true}
        />
      </Box>
    </Container>
  );
};
