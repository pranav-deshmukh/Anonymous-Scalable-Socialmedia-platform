import { Worker, Job } from 'bullmq';
import { sendMail } from '../../server/src/utils/email';

interface EmailJobData {
  email: string;
  message: string;
  subject: string;
}

export const emailWorker = new Worker<EmailJobData>(
  "email-queue",
  async (job: Job<EmailJobData>) => {
    try {
      const data = job.data;
      console.log("Job Received...", job.id);

      await sendMail({
        email: data.email,
        message: data.message,
        subject: data.subject,
      });

      console.log("Email sent successfully for job id:", job.id);
    } catch (error) {
      console.error("Error processing job id:", job.id, error);
    }
  },
  {
    connection: {
    host: process.env.EMAIL_QUEUE_HOST,
    port: process.env.EMAIL_QUEUE_PORT
      ? parseInt(process.env.EMAIL_QUEUE_PORT, 10)
      : undefined,
    username: process.env.EMAIL_QUEUE_USERNAME,
    password: process.env.EMAIL_QUEUE_PASSWORD,
  },
    limiter: {
      max: 50,
      duration: 10 * 1000,
    },
  }
);

emailWorker.on('completed', (job: Job<EmailJobData>) => {
  console.log(`Job ${job.id} has been completed`);
});

emailWorker.on('failed', (job: Job<EmailJobData>, err: Error) => {
  console.error(`Job ${job.id} has failed with error: ${err.message}`);
});

// emailWorker.on('ready', () => {
//   console.log("Email worker is ready and listening for jobs.");
// });

emailWorker.on('error', (error: Error) => {
  console.error("Email worker encountered an error:", error);
});
