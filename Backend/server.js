import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

//Route imports
import LoginRoute from "./routes/loginRoute.js";
import RegisterRoute from "./routes/registerRoute.js";
import DesignRoute from "./routes/designRoute.js";
dotenv.config();
connectDB();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

//Routes
app.use("/api/login", LoginRoute);
app.use("/api/register", RegisterRoute);
app.use("/api/design", DesignRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
