import store from "@/app/store.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { SocketProvider } from "./app/socket-context.tsx";
import { ThemeProvider } from "./components/theme/ThemeProvider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <SocketProvider>
          <App />
          <Toaster />
        </SocketProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
