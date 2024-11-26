import "./index.css";
import { CssBaseline } from "@mui/material";

import { PersistGate } from "redux-persist/integration/react";

import App from "./App.tsx";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { store, persistor } from "./store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <CssBaseline />
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </>
);
