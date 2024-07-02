import { createToken } from "../services/createToken.mjs";
import dotenv from "dotenv";
dotenv.config();

const getToken = async (req, res, storage) => {
  if (req.query.adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Invalid Admin Key" });
  }

  const numberOfChatMessagesReceived = parseInt(req.query.numberOfChatMessages);
  if (numberOfChatMessagesReceived < 1) {
    return res.status(400).json({ error: "Invalid number of chat messages" });
  }
  const numberOfChatMessages = numberOfChatMessagesReceived || 10;
  const expiresIn = req.query.expiresIn || "1d";
  const token = await createToken({ numberOfChatMessages, expiresIn, storage });
  res.status(200).json({ token, "user-id": id, expiresIn });
};

export default getToken;
