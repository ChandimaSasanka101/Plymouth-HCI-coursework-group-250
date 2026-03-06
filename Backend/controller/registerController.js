import User from "../models/user.js";
export const createUser = async (req, res) => {
  const { userFirstName, userLastName, userEamil, userPassword } = req.body;
  const type = "Customer";

  try {
    //Check if the user already exists
    const existingUser = await User.findOne({ userEamil });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }
    //create user object
    const newUser = new User({
      firstName: userFirstName,
      lastName: userLastName,
      email: userEamil,
      password: userPassword,
      type: type,
    });
    //save to db
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully!",
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating user.",
    });
  }
};
