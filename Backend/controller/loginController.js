import User from "../models/user.js";
//Check if the user details are correct
export const Login = async (req, res) => {
  console.log("Login Function hit");
  try {
    //Get user data
    const { userEmail, userPassword } = req.body;
    //finduser
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //find password
    const corrUser = await user.matchPassword(userPassword);
    if (!corrUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //success
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      type: user.type,
      message: "Login Successful",
    });
  } catch (err) {
    console.error("ERROR in Login function:", err);
    res.status(500).send(err.message);
  }
};
