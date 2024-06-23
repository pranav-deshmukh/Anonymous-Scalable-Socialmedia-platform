import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const encryptionKey = process.env.ENCRYPTION_KEY;
const encryptionIv = process.env.ENCRYPTION_IV;

if (!encryptionKey || !encryptionIv) {
  throw new Error('Encryption key or IV is missing');
}

const keyBuffer = Buffer.from(encryptionKey, 'hex');
const ivBuffer = Buffer.from(encryptionIv, 'hex');

export const encrypt = (data: string): string => {
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export const decrypt = (data: string): string => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  let decrypted = decipher.update(data, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
