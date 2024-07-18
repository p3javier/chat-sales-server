import Anthropic from "@anthropic-ai/sdk";
import { getSemantic, setSemantic } from "../middlewares/semanticCache.mjs";

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
});

export const anthropicChat = async (question) => {
  const responseFromSemantic = await getSemantic(question);
  if (!responseFromSemantic) {
    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [{ role: "user", content: question }],
      model: "claude-3-5-sonnet-20240620",
    });

    console.log("Claude response", message.content);

    await setSemantic(question, message.content);
    return message.content;
  }
  return responseFromSemantic;
};
