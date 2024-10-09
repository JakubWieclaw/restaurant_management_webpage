import { Dish } from "../types/dish";

export interface CartItem {
  dish: Dish;
  quantity: number;
  removedIngredients: string[];
}

export interface CartState {
  items: CartItem[];
  deliveryType: string;
  address: string;
  distance: number;
}
