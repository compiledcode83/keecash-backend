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
  @IsEnum(Environment, { groups: ['database', 'producer', 'consumer', 'admin'] })
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

  @IsString()
  @MinLength(64)
  JWT_SECRET: string;

  @IsString()
  @MinLength(1)
  JWT_REFRESH_TOKEN_COOKIE_DOMAIN: string;

  @IsString()
  @MinLength(1)
  JWT_REFRESH_TOKEN_DURATION_DAYS: string;

  @IsString()
  @MinLength(1)
  JWT_REFRESH_TOKEN_MAX_SESSIONS: string;

  @IsString()
  @MinLength(1)
  JWT_ACCESS_TOKEN_DURATION_MINUTES: string;

  @IsString()
  @MinLength(1)
  RESET_PASSWORD_TOKEN_DURATION_MINUTES: string;

  @IsString()
  @IsIn(['true', 'false'])
  JWT_REFRESH_TOKEN_COOKIE_SECURE: 'true' | 'false';

  @IsString()
  @IsIn(['true', 'false'])
  JWT_REFRESH_TOKEN_COOKIE_HTTPONLY: 'true' | 'false';

  @IsString()
  @MinLength(1)
  TWILIO_VERIFICATION_SERVICE_SID: string;

  @IsString()
  @MinLength(1)
  TWILIO_AUTH_TOKEN: string;

  @IsString()
  @MinLength(1)
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  @MinLength(1)
  PROJECT_ID: string;

  @IsString()
  @MinLength(1)
  PRIVATE_KEY: string;

  @IsString()
  @MinLength(1)
  CLIENT_EMAIL: string;

  @IsString()
  @MinLength(1)
  STORAGE_MEDIA_BUCKET: string;

  @IsString()
  @MinLength(1)
  TRIPLEA_API_BASE_URL: string;

  @IsString()
  @MinLength(1)
  TRIPLEA_EUR_CLIENT_ID: string;

  @IsString()
  @MinLength(1)
  TRIPLEA_EUR_CLIENT_SECRET: string;

  @IsString()
  @MinLength(1)
  TRIPLEA_EUR_MERCHANT_KEY: string;

  @IsString()
  @MinLength(1)
  TRIPLEA_USD_CLIENT_ID: string;

  @IsString()
  @MinLength(1)
  TRIPLEA_USD_CLIENT_SECRET: string;

  @IsString()
  @MinLength(1)
  TRIPLEA_USD_MERCHANT_KEY: string;

  @IsString()
  @MinLength(1)
  SUMSUB_APP_TOKEN: string;

  @IsString()
  @MinLength(1)
  SUMSUB_SECRET_KEY: string;

  @IsString()
  @MinLength(1)
  SUMSUB_BASE_URL: string;

  @IsString()
  @MinLength(1)
  SUMSUB_ACCESS_TOKEN_DURATION_MINUTES: string;

  @IsString()
  @MinLength(1)
  BRIDGECARD_AUTH_TOKEN;

  @IsString()
  @MinLength(1)
  BRIDGECARD_SECRET_KEY;

  @IsString()
  @MinLength(1)
  BRIDGECARD_ISSUING_ID;

  @IsString({ groups: ['api', 'producer', 'consumer'] })
  SENTRY_DSN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

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
