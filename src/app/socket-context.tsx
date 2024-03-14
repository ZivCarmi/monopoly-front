import { BASE_URL } from "@/api/config";
import Loader from "@/components/ui/loader";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return socket;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  console.log("on SocketProvider, socket:", socket);

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {socket ? (
        children
      ) : (
        <div className="fixed inset-1/2">
          <Loader />
        </div>
      )}
    </SocketContext.Provider>
  );
}
