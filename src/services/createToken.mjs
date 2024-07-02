import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import ms from "ms";
import dotenv from "dotenv";
dotenv.config();

export const createToken = async ({
  numberOfChatMessages,
  expiresIn,
  storage,
}) => {
  const id = uuidv4();
  const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn });
  await storage.setItem(id, numberOfChatMessages, { ttl: ms(expiresIn) });

  return token;
};
