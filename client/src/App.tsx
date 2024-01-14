import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LobbyRoomsPage from "./pages/LobbyRooms";
import LobbyLayout from "./components/layouts/LobbyLayout";
import GameRoom from "./components/GameRoom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LobbyLayout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<LobbyRoomsPage />} />
      </Route>
      <Route path="room/:roomId" element={<GameRoom />} />
    </Routes>
  );
};

export default App;
