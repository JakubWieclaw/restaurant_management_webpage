import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";

import { Menu } from "./pages/FoodMenu";
import { InitSystem } from "./pages/InitSystem";
import { AppFooter } from "./components/AppFooter";
import { CartContent } from "./pages/CartContent";
import { LoginRegister } from "./pages/LoginRegister";
import { AppBarHeader } from "./components/AppBarHeader";

function App() {
  return (
    <>
      <AppBarHeader />
      <Container id="content" maxWidth={false}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/cart" element={<CartContent />} />
          <Route path="/auth" element={<LoginRegister />} />
          <Route path="/initialize-system" element={<InitSystem />} />
        </Routes>
      </Container>
      <AppFooter />
      <ToastContainer />
    </>
  );
}

export default App;
