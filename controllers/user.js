import { registerUser, verifyEmail } from '../services/user.js';

export const register = async (req, res) => {
  try {
    const message = await registerUser(req.body);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const message = await verifyEmail(userId, token);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
