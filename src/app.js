const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const { museAIChat } = require("./services/muse.ai");
const getVideo = require("./endpoints/getVideo");
const verifyToken = require("./middlewares/verifyToken");
const { expressjwt } = require("express-jwt");
const storage = require("node-persist");
const getToken = require("./endpoints/getToken");
const getUsers = require("./endpoints/getUsers");

storage.init();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN, // Adjust this as per your client's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // Adjust this as per your client's URL
    credentials: true,
  })
);

app.get("/video/:videoId", getVideo);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get(
  "/health-secure",
  expressjwt({ secret: process.env.SECRET_KEY, algorithms: ["HS256"] }),
  (req, res) => {
    res.status(200).json({ status: "This is a secure endpoint" });
  }
);

app.get("/token", (req, res) => getToken(req, res, storage));

app.get("/users", (req, res) => getUsers(req, res, storage));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = verifyToken(token);
  console.log("Decoded", decoded);
  if (decoded) {
    socket.user = decoded;
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.user);
  console.log("Socket ID:", socket.id);

  socket.on("message", async (data) => {
    console.log("Message received:", data);
    try {
      const response = await museAIChat(data);
      const jsonResponse = await response.json();
      console.log("Response from Muse.AI:", jsonResponse);
      io.emit("message", jsonResponse.response); // Broadcast the message to all connected clients
    } catch (error) {
      console.error("Error:", error);
      io.emit("message", { error: "An error occurred" });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
