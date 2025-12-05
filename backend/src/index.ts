import mongoose from "mongoose";
import {app} from "./app";
require("dotenv").config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/trackbite").then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

app.listen(PORT, () => {
  console.log(
    `TrackBite API server listening at http://localhost:${PORT}`
  );
});

export default app;
