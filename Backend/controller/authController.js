import User from "../models/user.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
export const forgotPassword = async (req, res, next) => {
  console.log("forgotPassword function hit");
  const { email } = req.body;
  try {
    //Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Email could not be sent" });
    }
    // Generate Token
    const resetToken = user.getResetPasswordToken();
    await user.save();
    //Create the Reset Link
    const resetUrl = `http://localhost:5173/passwordreset/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      <p>This link expires in 5 minutes.</p>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res
        .status(500)
        .json({ success: false, error: "Email could not be sent" });
    }
  } catch (error) {
    next(error);
  }
};
