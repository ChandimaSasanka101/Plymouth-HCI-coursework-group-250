import mongoose from "mongoose";

//Define the Schema for a single piece of furniture
const furnitureItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  // Position (X, Z)
  x: { type: Number, required: true },
  z: { type: Number, required: true },

  // Dimensions
  w: { type: Number, required: true },
  d: { type: Number, required: true },
  h: { type: Number, required: true },

  // Styles
  color: { type: String, default: "#ffffff" },
  rotation: { type: Number, default: 0 },
});

//Define the Main Design Schema
const designSchema = new mongoose.Schema({
  // Metadata
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: [true, "Please provide a name for this design"],
    trim: true,
  },

  // Room Configuration (The walls/floor settings)
  roomConfig: {
    width: { type: Number, default: 12 },
    depth: { type: Number, default: 12 },
    wallColor: { type: String, default: "#eeeeee" },
    floorColor: { type: String, default: "#cccccc" },
    globalShade: { type: Number, default: 0.8 },
  },

  // The Array of Furniture Items
  items: [furnitureItemSchema],

  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Design = mongoose.model("Design", designSchema);
export default Design;
