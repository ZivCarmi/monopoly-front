import { useState } from "react";
import LobbyGameRooms from "./LobbyGameRooms";
import CreateRoom from "./CreateRoom";
import { Button } from "./ui/button";
import { KeyRound, Users2 } from "lucide-react";

const Lobby = () => {
  const [showGameRooms, setShowGameRooms] = useState(false);

  return (
    <>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 background-animate">
        Welcome to Monopolyz
      </h1>
      <div className="my-auto">
        {showGameRooms && (
          <LobbyGameRooms onGoBack={() => setShowGameRooms(false)} />
        )}
        {!showGameRooms && (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => setShowGameRooms(true)}
              className="bg-gradient-to-tl from-pink-500 to-yellow-500 bg-pos-0 hover:bg-pos-100 bg-size-100-400 transition-all duration-500"
            >
              <Users2 className="mr-2 h-4 w-4" />
              All Game Rooms
            </Button>
            <CreateRoom>
              <KeyRound className="mr-2 h-4 w-4" />
              Create a Private Room
            </CreateRoom>
          </div>
        )}
      </div>
    </>
  );
};

export default Lobby;
