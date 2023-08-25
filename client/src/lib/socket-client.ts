import ioClient from "socket.io-client";

const WS_URL = "http://localhost:3001";

const socket = ioClient(WS_URL);

export default socket;
