import http from "http";
import { Server } from "socket.io";
import { app } from "./app";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

if (process.env.NODE_ENV !== "test") {
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(3001, () => console.log("Server running on port 3001"));
}

export default io;
