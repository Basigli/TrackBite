const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const routes = require("./routes/routes");
app.use("/", routes);

app.listen(PORT, () => {
  console.log(
    `TrackBite API server listening at http://localhost:${PORT}`
  );
});
