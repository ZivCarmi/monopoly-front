import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";
import { ToggleTheme } from "./components/theme/ThemeToggle.tsx";
import store from "@/app/store.ts";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/toaster.tsx";
import { SocketProvider } from "./app/socket-context2.tsx";
import { DirectionProvider } from "@radix-ui/react-direction";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DirectionProvider dir="ltr">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToggleTheme />
        <Provider store={store}>
          <SocketProvider>
            <BrowserRouter>
              <App />
              <Toaster />
            </BrowserRouter>
          </SocketProvider>
        </Provider>
      </ThemeProvider>
    </DirectionProvider>
  </React.StrictMode>
);
