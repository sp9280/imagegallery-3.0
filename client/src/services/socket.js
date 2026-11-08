// client/src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:4000");

// Initialize socket connection
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

// Log connection status
socket.on("connect", () => {
  console.log("Connected to socket server:", SOCKET_URL);
});

socket.on("disconnect", (reason) => {
  console.warn("Disconnected from socket:", reason);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

export default socket;
// Helper functions
const subscribeToNewMedia = (callback) => socket.on("new_media", callback);
const subscribeToLike = (callback) => socket.on("media_liked", callback);
const subscribeToComment = (callback) => socket.on("media_commented", callback);

const emitLike = (mediaId) => socket.emit("like_media", { mediaId });
const emitComment = (mediaId, comment) =>
  socket.emit("add_comment", { mediaId, comment });

export {
  socket,
  subscribeToNewMedia,
  subscribeToLike,
  subscribeToComment,
  emitLike,
  emitComment,
};