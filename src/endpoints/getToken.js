const jwt = require("jsonwebtoken");
const ms = require("ms");
const { v4: uuidv4 } = require("uuid");

const getToken = async (req, res, storage) => {
  if (req.query.adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Invalid Admin Key" });
  }
  const id = uuidv4();
  const numberOfChatMessages = req.query.numberOfChatMessages || 10;
  const expiresIn = req.query.expiresIn || "1d";
  const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn });
  await storage.setItem(id, numberOfChatMessages, { ttl: ms(expiresIn) });
  res.status(200).json({ token, "user-id": id, expiresIn });
};

module.exports = getToken;
