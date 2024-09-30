import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartState, CartItem } from "../../types/cartTypes";
import { DeliveryOption } from "../../components/Cart/DeliverySelection";

const initialState: CartState = {
  items: [],
  deliveryType: DeliveryOption.Personal,
  address: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      console.log("Adding to cart");
      const existingItem = state.items.find(
        (item) =>
          item.dish.id === action.payload.dish.id &&
          JSON.stringify(item.removedIngredients) ===
            JSON.stringify(action.payload.removedIngredients)
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<{ row: any }>) {
      state.items = state.items.filter((item) => {
        return JSON.stringify(action.payload.row.item) !== JSON.stringify(item);
      });
    },
    updateCartItem(
      state,
      action: PayloadAction<{
        row: any;
        quantity: number;
        removedIngredients: string[];
      }>
    ) {
      const existingItem = state.items.find(
        (item) =>
          JSON.stringify(item) === JSON.stringify(action.payload.row.item)
      );
      if (existingItem) {
        const idx = state.items.indexOf(existingItem);
        state.items[idx].quantity = action.payload.quantity;
        state.items[idx].removedIngredients = action.payload.removedIngredients;
      }
    },
    clearCart(state) {
      console.log("Clearing cart");
      state.items = [];
    },
    changeDeliveryType(state, action: PayloadAction<DeliveryOption>) {
      state.deliveryType = action.payload;
    },
    changeAddress(state, action: PayloadAction<string>) {
      state.address = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  changeDeliveryType,
  changeAddress,
} = cartSlice.actions;

export default cartSlice.reducer;
