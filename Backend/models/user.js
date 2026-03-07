import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);
//The Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//method to generate a secure token
userSchema.methods.getResetPasswordToken = function () {
  //Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set expiration (5 minutes)
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  return resetToken; // Return the raw token to send in the email
};
const User = mongoose.model("User", userSchema);
export default User;
