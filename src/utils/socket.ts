import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Update with your backend URL

export default socket;
