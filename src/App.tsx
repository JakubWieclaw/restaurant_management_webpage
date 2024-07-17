import "./App.css";
import { Container } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";

import { InitSystem } from "./pages/InitSystem";
import { AppFooter } from "./components/AppFooter";
import { LoginRegister } from "./pages/LoginRegister";
import { AppBarHeader } from "./components/AppBarHeader";

function App() {
  return (
    <>
      <AppBarHeader />
      <Container id="content">
        <Routes>
          <Route path="/initialize-system" element={<InitSystem />} />
          <Route path="/auth" element={<LoginRegister />} />
        </Routes>
      </Container>
      <AppFooter />
      <ToastContainer />
    </>
  );
}

export default App;
