import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import "@excalidraw/excalidraw/index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <App />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
      />
    </>
  </StrictMode>
);