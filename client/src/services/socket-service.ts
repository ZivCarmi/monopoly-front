import { Socket, io } from "socket.io-client";

class SocketService {
  public socket: Socket | null = null;

  public connect(url: string): Promise<Socket> {
    return new Promise((rs, rj) => {
      this.socket = io(url);

      if (!this.socket) {
        return rj("Could not initialize socket instance.");
      }

      this.socket.on("connect", () => {
        rs(this.socket as Socket);
      });

      this.socket.on("connect_error", (err) => {
        console.log(`Socket connection error: ${err}`);
        rj(err);
      });
    });
  }
}

export default new SocketService();
