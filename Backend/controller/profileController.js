import User from "../models/user.js";

//Function to get user details
export const getUserDetails = async (req, res) => {
  console.log("Profile Controller hit");
  const userId = req.params.id || req.params.Id;

  try {
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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
