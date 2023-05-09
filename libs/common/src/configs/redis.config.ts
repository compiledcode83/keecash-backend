import { registerAs } from '@nestjs/config';

export default registerAs('redisConfig', () => ({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
  connect_timeout: 2000,
}));
