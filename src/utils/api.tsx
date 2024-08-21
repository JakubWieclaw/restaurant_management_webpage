import {
  CategoryControllerApi,
  Configuration,
  MealControllerApi,
  AuthControllerApi,
} from "../api";

const apiUrl = import.meta.env.VITE_API_URL;

const config = new Configuration({ basePath: apiUrl });

export const mealsApi = new MealControllerApi(config);
export const categoriesApi = new CategoryControllerApi(config);
export const authApi = new AuthControllerApi(config);
