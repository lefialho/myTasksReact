import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import { App } from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster richColors />
  </StrictMode>
);
