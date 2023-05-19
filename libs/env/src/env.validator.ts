import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsString,
  Min,
  MinLength,
  ValidateIf,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment, { groups: ['api', 'database', 'producer', 'consumer', 'admin'] })
  NODE_ENV: Environment;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_HOST: string;

  @IsInt({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @Min(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_PORT: number;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_PASSWORD: string;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_DATABASE: string;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_USERNAME: string;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_CONNECTION: string;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_MIGRATIONS: string;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_MIGRATIONS_DIR: string;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_LOGGING: string;

  @IsString({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @MinLength(1, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_SYNCHRONIZE: string;

  @IsInt({ groups: ['database', 'producer', 'consumer', 'admin'] })
  @Min(10, { groups: ['database', 'producer', 'consumer', 'admin'] })
  TYPEORM_POOL_SIZE: number;

  @IsIn(['true', 'false'], { groups: ['database', 'producer', 'consumer', 'admin'] })
  POSTGRESQL_TLS: 'true' | 'false';

  @IsString({ groups: ['producer', 'consumer'] })
  @MinLength(1, { groups: ['producer', 'consumer'] })
  KAFKA_BROKER_URL: string;

  @IsString({ groups: ['producer', 'consumer'] })
  @MinLength(1, { groups: ['producer', 'consumer'] })
  KAFKA_CONSUMER_GROUP: string;

  @IsIn(['true', 'false'], { groups: ['producer', 'consumer'] })
  KAFKA_SSL: 'true' | 'false';

  @ValidateIf((o) => o.NODE_ENV === Environment.Production, { groups: ['producer', 'consumer'] })
  @IsString({ groups: ['producer'] })
  @MinLength(1, { groups: ['producer'] })
  KAFKA_USERNAME: string;

  @ValidateIf((o) => o.NODE_ENV === Environment.Production, { groups: ['producer', 'consumer'] })
  @IsString({ groups: ['producer', 'consumer'] })
  @MinLength(1, { groups: ['producer', 'consumer'] })
  KAFKA_PASSWORD: string;

  @IsString({ groups: ['api'] })
  @MinLength(64, { groups: ['api'] })
  JWT_SECRET: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  JWT_REFRESH_TOKEN_COOKIE_DOMAIN: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  JWT_REFRESH_TOKEN_DURATION_DAYS: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  JWT_REFRESH_TOKEN_MAX_SESSIONS: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  JWT_ACCESS_TOKEN_DURATION_MINUTES: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  RESET_PASSWORD_TOKEN_DURATION_MINUTES: string;

  @IsString({ groups: ['api'] })
  @IsIn(['true', 'false'], { groups: ['api'] })
  JWT_REFRESH_TOKEN_COOKIE_SECURE: 'true' | 'false';

  @IsString({ groups: ['api'] })
  @IsIn(['true', 'false'], { groups: ['api'] })
  JWT_REFRESH_TOKEN_COOKIE_HTTPONLY: 'true' | 'false';

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TWILIO_VERIFICATION_SERVICE_SID: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TWILIO_AUTH_TOKEN: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TWILIO_ACCOUNT_SID: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  PROJECT_ID: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  PRIVATE_KEY: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  CLIENT_EMAIL: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  STORAGE_MEDIA_BUCKET: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TRIPLEA_API_BASE_URL: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TRIPLEA_EUR_CLIENT_ID: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TRIPLEA_EUR_CLIENT_SECRET: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TRIPLEA_EUR_MERCHANT_KEY: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TRIPLEA_USD_CLIENT_ID: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TRIPLEA_USD_CLIENT_SECRET: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  TRIPLEA_USD_MERCHANT_KEY: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  SUMSUB_APP_TOKEN: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  SUMSUB_SECRET_KEY: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  SUMSUB_BASE_URL: string;

  @IsString({ groups: ['api'] })
  @MinLength(1, { groups: ['api'] })
  SUMSUB_ACCESS_TOKEN_DURATION_MINUTES: string;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  BRIDGECARD_AUTH_TOKEN;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  BRIDGECARD_SECRET_KEY;

  @IsString({ groups: ['api', 'consumer'] })
  @MinLength(1, { groups: ['api', 'consumer'] })
  BRIDGECARD_ISSUING_ID;
}

export function validateApi(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false, groups: ['api'] });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export function validateDatabaseConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    groups: ['database'],
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export function validateConsumer(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    groups: ['consumer'],
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export function validateProducer(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    groups: ['producer'],
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
