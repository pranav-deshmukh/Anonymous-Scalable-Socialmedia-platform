import { emailWorker } from "../SignupEmailQ/worker";
import dotenv from "dotenv";

dotenv.config({path:"./.env"})


console.log("Starting email worker...");

// emailWorker.on('ready', () => {
//   console.log("Email worker is ready and listening for jobs.");
// });

emailWorker.on('error', (error: Error) => {
  console.error("Email worker encountered an error:", error);
});
