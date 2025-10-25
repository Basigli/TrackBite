import {app} from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `TrackBite API server listening at http://localhost:${PORT}`
  );
});

export default app;
