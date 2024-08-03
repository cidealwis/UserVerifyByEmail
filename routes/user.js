import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import emailService from "../util/email.js";
import Token from "../model/token.js";
import { User, validate } from "../model/user.js";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.verified) {
        return res.status(400).send("User with given email already exists!");
      } else {
        await Token.deleteMany({ userId: user._id }); 
        user.name = req.body.name; 
        await user.save(); 
      }
    } else {
      user = new User({
        name: req.body.name,
        email: req.body.email,
      });
      await user.save();
    }

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
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

    await emailService(user.email, "Verify Email", message);

    res.send("An Email has been sent to your account. Please verify.");
  } catch (error) {
    res.status(400).send("An error occurred");
  }
});

router.get("/verify/:id/:token", async (req, res) => {

  console.log("Verification request received:", req.params);
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    if (user.verified) {
      await Token.findByIdAndDelete(token._id); 
      return res.send("Email already verified.");
    }

    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.findByIdAndDelete(token._id); 

    res.send("Email verified successfully");
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(400).send("An error occurred");
  }
});

export { router as UserRouter };
