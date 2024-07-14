import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { InitSystem } from "./pages/InitSystem";
import { Route, Routes } from "react-router-dom";
import { LoginRegister } from "./pages/LoginRegister";
import { AppBarHeader } from "./components/AppBarHeader";
import { AppFooter } from "./components/AppFooter";
import { Container } from "@mui/material";

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
