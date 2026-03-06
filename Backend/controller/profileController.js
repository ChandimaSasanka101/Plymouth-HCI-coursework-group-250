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

//Update User profile
export const updateUser = async (req, res) => {
  console.log("Update user function hit");
  const userId = req.params.id || req.params.Id;
  try {
    const { firstName, lastName } = req.body;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //Update details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "Update successful!" });
  } catch (err) {
    console.error("ERROR in Profile Update user function:", err);
    res.status(500).send(err.message);
  }
};
