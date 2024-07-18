import { getUsers } from "../middlewares/users-ops.mjs";
export const getRegisteredUsers = async (req, res) => {
  if (req.query.adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Invalid Admin Key" });
  }
  try {
    const users = await getUsers();
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
