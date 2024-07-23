import useJoinRoom from "@/hooks/useJoinRoom";
import { ArrowRight, PlusSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import FetchLobbyRoomsButton from "./FetchLobbyRoomsButton";

const LobbyGameRoomsActions = () => {
  const createRoom = useJoinRoom();

  return (
    <div className="mb-8 flex items-center justify-between">
      <Button asChild variant="outline">
        <Link to="/">
          <Icon icon={ArrowRight} />
          חזור
        </Link>
      </Button>
      <div className="flex gap-2">
        <FetchLobbyRoomsButton />
        <Button onClick={() => createRoom()} variant="primaryFancy">
          <Icon icon={PlusSquare} />
          חדר חדש
        </Button>
      </div>
    </div>
  );
};

export default LobbyGameRoomsActions;
