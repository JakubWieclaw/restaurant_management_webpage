import "./App.css";
import { Container } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";

import { RootState } from "./store";
import { Cart } from "./pages/Cart";
import { Menu } from "./pages/FoodMenu";
import { auth, configApi } from "./utils/api";
import { InitSystem } from "./pages/InitSystem";
import { AppFooter } from "./components/AppFooter";
import { LoginRegister } from "./pages/LoginRegister";
import { AppBarHeader } from "./components/AppBarHeader";
import { setConfig } from "./reducers/slices/configSlice";
import { CategoriesManagement } from "./pages/CategoriesManagement";
import { Contact } from "./pages/Contact";
import { PasswordReset } from "./pages/PasswordReset";
import { DishDetails } from "./pages/DishDetails";
import { OrderDetails } from "./pages/OrderDetails";
import { CustomerOrders } from "./pages/CustomerOrders";
import { Orders } from "./pages/Orders";
import { AddCoupon } from "./pages/AddCoupon";
import { TablesManagement } from "./pages/TablesManagement";
import { AdminPanel } from "./pages/AdminPanel";
import { CustomerDetails } from "./pages/CustomerDetails";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    configApi
      .getConfig(auth(user?.loginResponse?.token))
      .then((response) => {
        dispatch(setConfig(response.data));
        const link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = response.data.logoUrl;
        document.getElementsByTagName("head")[0].appendChild(link);
      })
      .catch((error) => {
        if (user.loginResponse === null) {
          if (!window.location.href.includes("/auth")) {
            window.location.href = "/auth";
            toast.info("Zarejestruj się, aby utworzyć konto administratora.", {
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
        } else if (!window.location.href.includes("/initialize-system")) {
          window.location.href = "/initialize-system";
          toast.info("Zainicjalizuj system, aby móc korzystać z aplikacji.", {
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

        toast.info(error.response.data, {
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
      });
  }, []);
  return (
    <>
      <AppBarHeader />
      <Container id="content" maxWidth={false}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/dish-details/:id" element={<DishDetails />} />
          <Route path="/initialize-system" element={<InitSystem />} />
          <Route path="/auth/password-reset" element={<PasswordReset />} />
          <Route
            path="/categories-management"
            element={<CategoriesManagement />}
          />
          <Route path="order-details/:orderId" element={<OrderDetails />} />
          <Route path="/customer-orders" element={<CustomerOrders />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/coupons/add/:mealId" element={<AddCoupon />} />
          <Route path="/tables-management" element={<TablesManagement />} />
          <Route path="/customer-details/:id" element={<CustomerDetails />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </Container>
      <AppFooter />
      <ToastContainer />
    </>
  );
}

export default App;
