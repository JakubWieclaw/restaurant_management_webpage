import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { Container } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";

import { Menu } from "./pages/FoodMenu";
import { Cart } from "./pages/Cart";
import { InitSystem } from "./pages/InitSystem";
import { AppFooter } from "./components/AppFooter";
import { LoginRegister } from "./pages/LoginRegister";
import { AppBarHeader } from "./components/AppBarHeader";
import { CategoriesManagement } from "./pages/CategoriesManagement";

function App() {
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
