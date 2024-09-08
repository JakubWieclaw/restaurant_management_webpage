import "./App.css";
import { Container } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";

import { Cart } from "./pages/Cart";
import { Menu } from "./pages/FoodMenu";
import { configApi } from "./utils/api";
import { InitSystem } from "./pages/InitSystem";
import { AppFooter } from "./components/AppFooter";
import { LoginRegister } from "./pages/LoginRegister";
import { AppBarHeader } from "./components/AppBarHeader";
import { setConfig } from "./reducers/slices/configSlice";
import { CategoriesManagement } from "./pages/CategoriesManagement";

function App() {
  const dispatch = useDispatch();
  // fetch user from redux

  useEffect(() => {
    configApi
      .getConfig()
      .then((response) => {
        if (response.status === 200) {
          dispatch(setConfig(response.data));
        }
      })
      .catch((error) => {
        if (!window.location.href.includes("/initialize-system")) {
          window.location.href = "/initialize-system";
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
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/initialize-system" element={<InitSystem />} />
          <Route
            path="/categories-management"
            element={<CategoriesManagement />}
          />
        </Routes>
      </Container>
      <AppFooter />
      <ToastContainer />
    </>
  );
}

export default App;
