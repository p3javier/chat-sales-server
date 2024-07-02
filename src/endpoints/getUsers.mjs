const getUsers = async (req, res, storage) => {
  const keys = await storage.keys();
  const users = await Promise.all(
    keys.map(async (key) => {
      const value = await storage.getItem(key);
      return { id: key, numberOfChatMessages: value };
    })
  );
  res.status(200).json(users);
};

export default getUsers;
