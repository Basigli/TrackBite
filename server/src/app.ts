import express from "express";
const routes = require("./routes/routes");
// import routes from "./routes/routes";

const app = express();
app.use(express.json());
app.use("/", routes);

export { app };
