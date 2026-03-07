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
