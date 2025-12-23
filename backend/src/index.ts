import mongoose from "mongoose";
import {app} from "./app";
import https from 'https';
import fs from 'fs';
require("dotenv").config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/trackbite")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// For HTTPS (development)
if (process.env.NODE_ENV === 'development') {
  const httpsOptions = {
    key: fs.readFileSync('.cert/key.pem'),
    cert: fs.readFileSync('.cert/cert.pem')
  };
  
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`TrackBite API (HTTPS) listening at https://localhost:${PORT}`);
  });
} else {
  // For HTTP (production will use reverse proxy)
  app.listen(PORT, () => {
    console.log(`TrackBite API listening at http://localhost:${PORT}`);
  });
}

export default app;
