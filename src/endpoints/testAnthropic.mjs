import { anthropicChat } from "../services/anthropic.mjs";
import { injectContext } from "../utils/injectContext.mjs";

export const testAnthropic = async (req, res) => {
  if (req.query.adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Invalid Admin Key" });
  }
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }
  const response = await anthropicChat(injectContext(question));
  res.status(200).json({ response });
};
