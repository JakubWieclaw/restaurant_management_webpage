import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Box, Button, Container, Divider, Typography } from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../store";
import { removeFromCart } from "../reducers/slices/cartSlice";

export const CartContent = () => {
  const cart = useSelector((state: RootState) => state.cart);
  console.log(cart.items);
  const apiRef = useGridApiRef();

  const dispatch = useDispatch();

  const onDeleteAction = () => {
    const selectedRows = apiRef.current?.getSelectedRows();
    console.log(selectedRows);
    if (selectedRows.size > 0) {
      selectedRows.forEach((row) => {
        dispatch(removeFromCart({ row: row }));
      });
    } else {
      console.log("No rows selected");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 15 }}>
      <Typography
        component="h1"
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 5 }}
      >
        Twój koszyk
      </Typography>

      <Box>
        <DataGrid
          rows={cart.items.map((item, idx) => ({
            id: idx,
            item: item,
            no: idx + 1,
            name: item.dish.name,
            quantity: item.quantity,
            price: (item.dish.price * item.quantity).toFixed(2) + " zł",
          }))}
          columns={[
            { field: "no", headerName: "Lp.", flex: 0.5 },
            { field: "name", headerName: "Danie", flex: 1 },
            { field: "quantity", headerName: "Ilość", flex: 0.5 },
            { field: "price", headerName: "Łączna cena", flex: 1 },
          ]}
          hideFooter={true}
          checkboxSelection={true}
          apiRef={apiRef}
        />
      </Box>
      <Box sx={{ display: "flex", my: 3, flexDirection: "row-reverse" }}>
        <Button
          variant="outlined"
          color="error"
          onClick={onDeleteAction}
          sx={{ textAlign: "right" }}
        >
          Usuń wybrane pozycje
        </Button>
      </Box>

      <Divider sx={{ my: 5 }} />
    </Container>
  );
};
