import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";

import { Menu } from "./pages/FoodMenu";
import { InitSystem } from "./pages/InitSystem";
import { AppFooter } from "./components/AppFooter";
import { LoginRegister } from "./pages/LoginRegister";
import { AppBarHeader } from "./components/AppBarHeader";

function App() {
  return (
    <>
      <AppBarHeader />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/initialize-system" element={<InitSystem />} />
      </Routes>
      <AppFooter />
      <ToastContainer />
    </>
  );
}

export default App;
