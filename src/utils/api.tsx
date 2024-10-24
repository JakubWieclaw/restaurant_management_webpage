import {
  CategoryControllerApi,
  Configuration,
  MealControllerApi,
  AuthControllerApi,
  ConfigControllerApi,
  PhotoControllerApi,
  OpinionControllerApi,
  OrderControllerApi,
  CouponControllerApi,
  CustomerControllerApi,
  TableControllerApi,
  TableReservationControllerApi,
  ContactFormControllerApi,
  StatsControllerApi,
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
export const couponsApi = new CouponControllerApi(config);
export const customersApi = new CustomerControllerApi(config);
export const tableApi = new TableControllerApi(config);
export const tableReservationApi = new TableReservationControllerApi(config);
export const contactFormApi = new ContactFormControllerApi(config);
export const statsApi = new StatsControllerApi(config);

export const photoDownloadUrl = `${apiUrl}/api/photos/download?filename=`;
