import { useAppSelector } from "@/app/hooks";
import useCountdown from "@/hooks/useCountdown";
import useFetchLobbyRooms from "@/hooks/useFetchLobbyRooms";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

const FetchLobbyRoomsButton = () => {
  const fetchLobbyRooms = useFetchLobbyRooms();
  const { isFetching, nextUpdate } = useAppSelector((state) => state.lobby);

  return (
    <Button
      variant="outline"
      onClick={fetchLobbyRooms}
      disabled={isFetching}
      className="flex items-center"
    >
      <RefreshCcw className="h-4 w-4" />
      {nextUpdate && <FetchCounter nextUpdate={nextUpdate} />}
    </Button>
  );
};

const FetchCounter = ({ nextUpdate }: { nextUpdate: Date }) => {
  const { seconds } = useCountdown(nextUpdate);

  return seconds;
};

export default FetchLobbyRoomsButton;
