import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { museAIChat } from "./services/muse.ai.mjs";
import getVideo from "./endpoints/getVideo.mjs";
import verifyToken from "./middlewares/verifyToken.mjs";
import { expressjwt } from "express-jwt";
import storage from "node-persist";
import getToken from "./endpoints/getToken.mjs";
import getUsers from "./endpoints/getUsers.mjs";
import { registerEmail } from "./endpoints/registerEmail.mjs";
import getMessagesAvailable from "./services/node-persist.mjs";
import bodyParser from "body-parser";
import { testAnthropic } from "./endpoints/testAnthropic.mjs";
import { anthropicChat } from "./services/anthropic.mjs";
import { injectContext } from "./utils/injectContext.mjs";

dotenv.config();

console.log("Secret key:", process.env.SECRET_KEY);
storage.init({ dir: `${process.env.STORAGE_DIR}/node-persist/storage` });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.get("/users");

app.post("/register", (req, res) => registerEmail(req, res, storage));

app.post("/test-anthropic", (req, res) => testAnthropic(req, res));

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
    const messagesAvailable = await getMessagesAvailable(
      storage,
      socket.user.id
    );
    console.log("Messages available:", messagesAvailable);
    if (messagesAvailable <= 1) {
      console.log("No messages available");
      io.emit("message", { error: "Zero messages left" });
      return;
    }
    try {
      const { message, svid } = JSON.parse(data);
      //const response = await museAIChat(data);
      const response = await anthropicChat(injectContext(message));
      console.log("Response from AI service:", response);
      await storage.setItem(socket.user.id, messagesAvailable - 1);
      io.emit("message", response[0].text); // Broadcast the message to all connected clients
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
