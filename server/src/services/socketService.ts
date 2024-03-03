import { Server } from "socket.io";
import { server } from "./expressService";

const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
  cors: {
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://localhost:4173",
      "https://socket-io-monopoly.vercel.app",
    ],
  },
});

export default io;
