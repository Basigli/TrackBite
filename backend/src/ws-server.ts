import http from "http";
import { Server } from "socket.io";
import { app } from "./app";


const server = http.createServer(app);

// one socket for each userId
const userSockets = new Map<string, string>();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

if (process.env.NODE_ENV !== "test") {
    
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", (userId: string) => {
      if (!userSockets.has(userId)) {
        userSockets.set(userId, socket.id);
        console.log(`user:${userId} registered with socket ${socket.id}`);
      } else {
        if (userSockets.get(userId) !== socket.id) {
          userSockets.set(userId, socket.id);
          console.log(`user:${userId} updated with new socket ${socket.id}`);
        } else {
          console.log(`user:${userId} already registered with socket ${socket.id}`);
        }
      }
    });

    socket.on("disconnect", () => {
      const userId = Array.from(userSockets.entries()).find(([key, val]) => val === socket.id)?.[0];
      if (userId) {
        userSockets.delete(userId);
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(3001, () => console.log("Server running on port 3001"));
}

export function sendNotification(userId: string, notification: any) {
  const socketId = userSockets.get(userId);
  console.log(`Attempting to send notification with socket ${socketId}`);
  if (socketId) {
    io.to(socketId).emit("notification", notification);
    console.log(`Notification sent to user ${userId} with socket ${socketId}`);
  }
}

export function isUserOnline(userId: string): boolean {
  return userSockets.has(userId);
}

export default io;
