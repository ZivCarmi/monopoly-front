import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "./hooks";
import { setSocketId } from "@/slices/user-slice";

const SocketContext = createContext<Socket | null>(null);

export function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    setSocket(newSocket);

    newSocket.on("connect", () => {
      dispatch(setSocketId(newSocket.id));
    });

    return () => {
      dispatch(setSocketId(null));
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {socket ? children : <p>Loading...</p>}
    </SocketContext.Provider>
  );
}
