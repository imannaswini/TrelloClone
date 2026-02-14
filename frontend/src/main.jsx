import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import useAuthStore from "./context/AuthStore";

useAuthStore.getState().initializeAuth(); // ✅ VERY IMPORTANT

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
