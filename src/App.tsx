import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { InitSystem } from "./pages/InitSystem";
import { Route, Routes } from "react-router-dom";
import { LoginRegister } from "./pages/LoginRegister";

function App() {
  return (
    <>
      <Routes>
        <Route path="/initialize-system" element={<InitSystem />} />
        <Route path="/" element={<LoginRegister />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
