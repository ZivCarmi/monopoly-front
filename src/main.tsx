import store from "@/app/store";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { SocketProvider } from "./app/socket-context";
import LobbyLayout from "./components/lobby/LobbyLayout";
import MainLayout from "./components/MainLayout";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import "./index.css";
import GameRoomPage from "./pages/GameRoom";
import LobbyPage from "./pages/Lobby";
import LobbyRoomsPage from "./pages/LobbyRooms";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route path="/" element={<LobbyLayout />}>
        <Route index element={<LobbyPage />} />
        <Route path="rooms" element={<LobbyRoomsPage />} />
      </Route>
      <Route path="/rooms/:roomId" element={<GameRoomPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <SocketProvider>
          <RouterProvider router={router} />
          <Toaster />
        </SocketProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
