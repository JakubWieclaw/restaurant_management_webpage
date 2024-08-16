import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Dish } from "../types/dish";
import { RootState } from "../store";
import { DishDialog } from "../components/FoodMenu/DishesList/DishDialog";
import { removeFromCart, updateCartItem } from "../reducers/slices/cartSlice";

export const CartContent = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const apiRef = useGridApiRef();

  const [dish, setDish] = useState<Dish>();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const dispatch = useDispatch();

  const onDeleteAction = () => {
    const selectedRows = apiRef.current?.getSelectedRows();
    if (selectedRows.size > 0) {
      selectedRows.forEach((row) => {
        dispatch(removeFromCart({ row: row }));
      });
    }
  };

  const onModifyClick = () => {
    const selectedRows = apiRef.current?.getSelectedRows();
    if (selectedRows.size > 0) {
      selectedRows.forEach((row) => {
        console.log(row);
        setDish(row.item.dish);
        setQuantity(row.quantity);
        setRemovedIngredients(row.item.removedIngredients);
      });
    }
    setOpen(true);
  };

  const onModifySubmit = () => {
    const selectedRows = apiRef.current?.getSelectedRows();
    if (selectedRows.size > 0) {
      selectedRows.forEach((row) => {
        dispatch(updateCartItem({ row, quantity, removedIngredients }));
      });
    }
  };

  const noItemsInfo = () => (
    <Typography
      sx={{
        textAlign: "center",
        mt: 5,
        color: "text.secondary",
      }}
    >
      Brak pozycji w koszyku. Dodaj coś smacznego!
    </Typography>
  );

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
            name: item.dish.name,
            quantity: item.quantity,
            price: (item.dish.price * item.quantity).toFixed(2) + " zł",
          }))}
          columns={[
            { field: "name", headerName: "Danie", flex: 1 },
            { field: "quantity", headerName: "Ilość", flex: 0.5 },
            {
              field: "price",
              headerName: "Cena",
              flex: 1,
            },
          ]}
          hideFooter={true}
          checkboxSelection={true}
          apiRef={apiRef}
          autoHeight={true}
          disableMultipleRowSelection={true}
          sx={{ border: 2, borderColor: "divider" }}
          slots={{
            noRowsOverlay: noItemsInfo,
          }}
        />
      </Box>
      <Grid container flexDirection={"row-reverse"} spacing={1} sx={{ mt: 1 }}>
        <Grid item>
          <Button variant="outlined" color="error" onClick={onDeleteAction}>
            Usuń wybraną pozycję
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="warning" onClick={onModifyClick}>
            Edytuj wybraną pozycję
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Typography
        component="h2"
        variant="h5"
        align="center"
        gutterBottom
        sx={{ mb: 5 }}
      >
        Podsumowanie
      </Typography>
      <Typography
        component="h3"
        variant="h6"
        align="center"
        gutterBottom
        sx={{ mb: 5 }}
      >
        Łączna cena:{" "}
        {cart.items
          .reduce((acc, item) => acc + item.dish.price * item.quantity, 0)
          .toFixed(2) + " zł"}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{ mt: 5 }}
      >
        Przejdź do płatności
      </Button>

      <Button
        variant="outlined"
        color="primary"
        size="large"
        fullWidth
        sx={{ mt: 2 }}
      >
        Kontynuuj zakupy
      </Button>

      <Button
        variant="outlined"
        color="error"
        size="large"
        fullWidth
        sx={{ mt: 2 }}
      >
        Wyczyść koszyk
      </Button>
      <DishDialog
        {...{
          open,
          setOpen,
          dish,
          quantity,
          setQuantity,
          removedIngredients,
          setRemovedIngredients,
          onSubmit: onModifySubmit,
          submitLabel: "Modyfikuj danie",
        }}
      />
    </Container>
  );
};
