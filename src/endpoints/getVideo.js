const { getVideoData } = require("../services/muse.ai");

const getVideo = async (req, res) => {
  const { videoId } = req.params;
  try {
    const response = await getVideoData(videoId);
    const { url, title, error } = response;
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json({ url, title });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = getVideo;
