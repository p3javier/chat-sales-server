import { isValidEmail } from "../utils/isValidEmail.mjs";
import { sendVerificationEmail } from "../services/sendEmail.mjs";
import { createUser } from "../middlewares/users-ops.mjs";
import { createToken } from "../services/createToken.mjs";

export const registerEmail = async (req, res, storage) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const numberOfChatMessages = 10;
  const expiresIn = "10d";
  const token = await createToken({ numberOfChatMessages, expiresIn, storage });
  await createUser(email, false, null);
  await sendVerificationEmail(email, token);
  res.status(200).json({ message: "Email registered" });
};
