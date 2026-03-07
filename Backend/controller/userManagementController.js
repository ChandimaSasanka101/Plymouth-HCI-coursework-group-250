import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  console.log("User  Controller Get function hit");
  try {
    const users = await User.find({ type: "Customer" }).select(
      "firstName lastName email status",
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in createDesign:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to save design.",
      error: error.message,
    });
  }
};
//Functiont to ban a user
export const BanUser = async (req, res) => {
  console.log("User  Controller Ban function hit");
  const userId = req.params.id || req.params.Id;
  try {
    const user = await User.findByIdAndUpdate(userId, { status: "Banned" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "Account banned successful!" });
  } catch (err) {
    console.error("ERROR in Profile Update user function:", err);
    res.status(500).send(err.message);
  }
};
//Function to Unban a user
export const UnBanUser = async (req, res) => {
  console.log("User  Controller UnBan function hit");
  const userId = req.params.id || req.params.Id;
  try {
    const user = await User.findByIdAndUpdate(userId, { status: "Active" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "Account unbanned successful!" });
  } catch (err) {
    console.error("ERROR in Profile Update user function:", err);
    res.status(500).send(err.message);
  }
};
