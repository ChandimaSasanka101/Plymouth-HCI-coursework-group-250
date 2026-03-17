import User from "../models/user.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
//forgotpassword function
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
      <div style="font-family: Arial, sans-serif; background: #f7f9fc; padding: 24px; color: #1f2937;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #111827; color: #ffffff; padding: 18px 24px;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 600;">Password Reset Request</h1>
          </div>
          <div style="padding: 24px; line-height: 1.6;">
            <p style="margin: 0 0 14px;">You requested to reset your password.</p>
            <p style="margin: 0 0 20px;">Click the button below to set a new password:</p>
            <a href="${resetUrl}" clicktracking="off" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 600;">Reset Password</a>
            <p style="margin: 20px 0 8px; font-size: 14px; color: #4b5563;">If the button doesn’t work, use this link:</p>
            <p style="margin: 0 0 16px; word-break: break-all;"><a href="${resetUrl}" clicktracking="off" style="color: #2563eb; text-decoration: underline;">${resetUrl}</a></p>
            <p style="margin: 0; font-size: 13px; color: #6b7280;">This link expires in 5 minutes.</p>
          </div>
        </div>
      </div>
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

export const resetPassword = async (req, res, next) => {
  console.log("resetPassword function hit");
  //Get hashed token from URL params
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    // Find user by Token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Token or Token Expired" });
    }

    //Set new password
    user.password = req.body.password;

    //Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    //Save
    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Updated Success",
    });
  } catch (error) {
    next(error);
  }
};
