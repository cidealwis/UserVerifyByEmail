import crypto from 'crypto';
import Token from '../model/token.js';
import { User, validate } from '../model/user.js';
import emailService from '../util/email.js';

export const registerUser = async (userData) => {
  try {
    const { error } = validate(userData);
    if (error) throw new Error(error.details[0].message);

    let user = await User.findOne({ email: userData.email });
    if (user) {
      if (user.verified) {
        throw new Error("User with given email already exists!");
      } else {
        await Token.deleteMany({ userId: user._id });
        user.name = userData.name;
        await user.save();
      }
    } else {
      user = new User({
        name: userData.name,
        email: userData.email,
      });
      await user.save();
    }

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
    await token.save();

    const message = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2>Email Verification</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${process.env.BASE_URL}/api/user/verify/${user._id}/${token.token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-align: center; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    await emailService(user.email, 'Verify Email', message);

    return "An email has been sent to your account. Please verify.";
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const verifyEmail = async (userId, tokenValue) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: tokenValue,
    });
    if (!token) throw new Error("Invalid link");

    if (user.verified) {
      await Token.findByIdAndDelete(token._id);
      return "Email already verified.";
    }

    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.findByIdAndDelete(token._id);

    return "Email verified successfully";
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
};
