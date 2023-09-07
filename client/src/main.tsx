import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";
import { ToggleTheme } from "./components/theme/ThemeToggle.tsx";
import store from "@/app/store.ts";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/toaster.tsx";
import SocketProvider from "./app/socket-context.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToggleTheme />
      <Provider store={store}>
        <SocketProvider>
          <App />
          <Toaster />
        </SocketProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
