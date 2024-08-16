import { Box, Button, Grid, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";

import { useState } from "react";
import { toast, Slide } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

import { Dish } from "../../types/dish";
import { RootState } from "../../store";
import { DishDialog } from "../../components/FoodMenu/DishesList/DishDialog";
import {
  removeFromCart,
  updateCartItem,
} from "../../reducers/slices/cartSlice";

export const CartContent = () => {
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const cart = useSelector((state: RootState) => state.cart);

  const [open, setOpen] = useState(false);
  const [dish, setDish] = useState<Dish>();
  const [quantity, setQuantity] = useState(1);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const onDeleteClick = () => {
    const selectedRows = apiRef.current?.getSelectedRows();
    if (selectedRows.size > 0) {
      selectedRows.forEach((row) => {
        dispatch(removeFromCart({ row: row }));
      });
    } else {
      toast.info("Zaznacz danie do usunięcia", {
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
    }
  };

  const onModifyClick = () => {
    const selectedRows = apiRef.current?.getSelectedRows();
    if (selectedRows && selectedRows.size > 0) {
      selectedRows.forEach((row) => {
        setDish(row.item.dish);
        setQuantity(row.quantity);
        setRemovedIngredients(row.item.removedIngredients);
      });
      setOpen(true);
    } else {
      toast.info("Zaznacz danie do edycji", {
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
    }
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
    <>
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
            { field: "quantity", headerName: "Liczba", flex: 0.5 },
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
      {cart.items.length !== 0 && (
        <>
          <Grid container flexDirection={"row"} spacing={1} sx={{ my: 1 }}>
            <Grid item>
              <Button variant="outlined" color="error" onClick={onDeleteClick}>
                Usuń
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="warning"
                onClick={onModifyClick}
              >
                Edytuj
              </Button>
            </Grid>
          </Grid>

          <Typography variant="h6" align="right" gutterBottom sx={{ mb: 5 }}>
            Łączna cena:{" "}
            {cart.items
              .reduce((acc, item) => acc + item.dish.price * item.quantity, 0)
              .toFixed(2) + " zł"}
          </Typography>
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
        </>
      )}
    </>
  );
};
