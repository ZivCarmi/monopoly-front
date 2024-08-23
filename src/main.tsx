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
import LobbyLayout from "./components/layouts/LobbyLayout";
import MainLayout from "./components/layouts/MainLayout";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import "./index.css";
import GameRoomPage from "./pages/GameRoom";
import LobbyPage from "./pages/Lobby";
import LobbyRoomsPage from "./pages/LobbyRooms";
import { authLoader, profileLoader } from "./utils";
import UserProfilePage from "./pages/UserProfile";
import PageLayout from "./components/layouts/PageLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />} loader={authLoader}>
      <Route path="/" element={<LobbyLayout />}>
        <Route index element={<LobbyPage />} />
        <Route path="browse" element={<LobbyRoomsPage />} />
      </Route>
      <Route path="/" element={<PageLayout />}>
        <Route
          path="/profile/:userId"
          element={<UserProfilePage />}
          loader={profileLoader}
        />
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
