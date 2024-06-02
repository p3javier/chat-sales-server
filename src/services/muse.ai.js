const museAIChat = async (data) => {
  const { message, svid } = JSON.parse(data);
  return fetch(`https://muse.ai/api/files/chat/${svid}`, {
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
    body: JSON.stringify({ history: [{ role: "user", content: message }] }),
    method: "POST",
  });
};
const headersInit = {
  Key: process.env.MUSE_API_KEY,
};

const getVideoData = async (videoId) => {
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

module.exports = { museAIChat, getVideoData };
