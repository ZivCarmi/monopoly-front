import { BASE_URL } from "@/api/config";
import { LobbyRoom } from "@ziv-carmi/monopoly-utils";
import { useEffect, useState } from "react";

const useFetchRoom = (roomId: string | undefined) => {
  const [lobbyRoom, setLobbyRoom] = useState<LobbyRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomId) return;

    const getRoom = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/getRoom/${roomId}`);

        if (!response.ok) {
          throw new Error("Could not fetch room");
        }

        const resJson = await response.json();

        setLobbyRoom(resJson);
      } catch (error) {
        setError("Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    };

    getRoom();
  }, []);

  return { data: lobbyRoom, loading: isLoading, error };
};

export default useFetchRoom;
