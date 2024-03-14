import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import LobbyPage from "./pages/Lobby";
import LobbyRoomsPage from "./pages/LobbyRooms";
import LobbyLayout from "./components/lobby/LobbyLayout";
import GameRoomPage from "./pages/GameRoom";
import MainLayout from "./components/MainLayout";

console.log("on App");

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

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
