import express from "express";
import { createServer } from "http";

const app = express();

export const server = createServer(app);

server.listen("3001", () => {
  console.log("Server is Running on port 3001");
});

export default app;
