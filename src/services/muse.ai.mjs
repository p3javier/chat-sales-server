import dotenv from "dotenv";
dotenv.config();
import { getSemantic, setSemantic } from "../middlewares/semanticCache.mjs";

export const museAIChat = async (data) => {
  const { message, svid } = JSON.parse(data);

  const responseFromSemantic = await getSemantic(message);
  console.log("responseFromSemantic", responseFromSemantic);
  if (!responseFromSemantic) {
    const response = await fetch(`https://muse.ai/api/files/chat/${svid}`, {
      headers: {
        accept: "*/*",
        "content-type": "application/json",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie: `key=${process.env.MUSE_SESSION_KEY};`,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: JSON.stringify({
        history: [
          {
            role: "user",
            content: `A continuación verás una pregunta sobre el vídeo, si la pregunta es sobre algo que está en el vídeo, ademas de responder tienes que enviar el timestamp exacto donde se explica eso en el vídeo: ${message}`,
          },
        ],
      }),
      method: "POST",
    });
    const jsonResponse = await response.json();
    await setSemantic(message, jsonResponse.response);
    return jsonResponse.response;
  }

  return responseFromSemantic;
};
const headersInit = {
  Key: process.env.MUSE_API_KEY,
};

export const getVideoData = async (videoId) => {
  try {
    const response = await fetch(
      `https://muse.ai/api/files/videos/${videoId}`,
      {
        headers: headersInit,
      }
    );
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};
