import Design from "../models/furniture_item_models.js";

//Add new design function
export const createDesign = async (req, res) => {
  console.log("Desgin Controller hit");
  try {
    const { userId, name, roomConfig, items } = req.body;
    if (!roomConfig || !items) {
      return res.status(400).json({
        success: false,
        message: "Please provide room configuration and furniture items.",
      });
    }
    //Create the new Design object
    const newDesign = new Design({
      userId: userId,
      name: name || `Untitled Design ${new Date().toLocaleDateString()}`,
      roomConfig,
      items,
    });
    //Save to MongoDB Atlas
    const savedDesign = await newDesign.save();
    //Send back the success response
    res.status(201).json({
      success: true,
      data: savedDesign,
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

//Get Desgin function
export const getDesign = async (req, res) => {
  console.log("Desgin Controller Get function hit");
  const userId = req.params.id || req.params.Id;
  try {
    console.log("User ID", userId);
    const designs = await Design.find({ userId: userId });
    console.log("Data: ", designs);
    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs,
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
