import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import { App } from "@/app";
import { AppProviders } from "@/components/provider";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
      <Toaster position="bottom-center" />
    </AppProviders>
  </StrictMode>,
);
