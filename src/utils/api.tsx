import {
  CategoryControllerApi,
  Configuration,
  MealControllerApi,
  AuthControllerApi,
  ConfigControllerApi,
  PhotoControllerApi,
  OpinionControllerApi,
  OrderControllerApi,
} from "../api";

export const apiUrl = import.meta.env.VITE_API_URL;

const config = new Configuration({ basePath: apiUrl });

export const mealsApi = new MealControllerApi(config);
export const categoriesApi = new CategoryControllerApi(config);
export const authApi = new AuthControllerApi(config);
export const configApi = new ConfigControllerApi(config);
export const photoApi = new PhotoControllerApi(config);
export const opinionApi = new OpinionControllerApi(config);
export const orderApi = new OrderControllerApi(config);

export const photoDownloadUrl = `${apiUrl}/api/photos/download?filename=`;
