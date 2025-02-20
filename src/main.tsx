import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import Popup from "./pages/popup";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
