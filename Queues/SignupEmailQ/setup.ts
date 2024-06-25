import {Queue} from 'bullmq';

export const emailQueue = new Queue("email-queue", {
  connection: {
    host: process.env.EMAIL_QUEUE_HOST,
    port: process.env.EMAIL_QUEUE_PORT
      ? parseInt(process.env.EMAIL_QUEUE_PORT, 10)
      : undefined,
    username: process.env.EMAIL_QUEUE_USERNAME,
    password: process.env.EMAIL_QUEUE_PASSWORD,
  },
});
