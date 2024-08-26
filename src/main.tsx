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
import PageLayout from "./components/layouts/PageLayout";
import UserNotFound from "./components/profile/UserNotFound";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import "./index.css";
import GameRoomPage from "./pages/GameRoom";
import LobbyPage from "./pages/Lobby";
import LobbyRoomsPage from "./pages/LobbyRooms";
import { authLoader, profileLoader } from "./utils";

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
          errorElement={<UserNotFound />}
          lazy={async () =>
            await import("./pages/UserProfile").then((module) => ({
              loader: profileLoader,
              Component: module.UserProfilePage,
            }))
          }
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
