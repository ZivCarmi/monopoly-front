import React, { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import socketService from "@/services/socket-service";

// UNUSED

type SocketContextType = {
  socket: Socket | null;
  socketErrorMsg: string;
};

export const SocketContext = React.createContext<SocketContextType>(
  {} as SocketContextType
);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketErrorMsg, setSocketErrorMsg] = useState("");

  const connect = async () => {
    const socket = await socketService
      .connect("http://localhost:3001")
      .then((res) => {
        setSocket(res);
      })
      .catch((err) => {
        console.log("Error: ", err);
        setSocketErrorMsg(err);
      });
  };

  useEffect(() => {
    connect();

    return () => {
      socket?.disconnect();
    };
  }, []);

  const contextValue: SocketContextType = {
    socket,
    socketErrorMsg,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {socket ? children : <p>Loading...</p>}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket context must be used within SocketProvider");
  }

  return context;
};

export default SocketProvider;
