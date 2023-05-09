import { registerAs } from '@nestjs/config';

export default registerAs('storageConfig', () => ({
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY,
  clientEmail: process.env.CLIENT_EMAIL,
  storageMediaBucket: process.env.STORAGE_MEDIA_BUCKET,
}));
