import express from "express";
import routes from "./routes/routes";
import cors from "cors";
import { NotificationScheduler } from './utils/NotificationScheduler';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routes);

const notificationScheduler = new NotificationScheduler();

// Start scheduler when app starts
notificationScheduler.start();

// Stop scheduler on app shutdown
process.on('SIGTERM', () => {
  notificationScheduler.stop();
  process.exit(0);
});

export { app };
