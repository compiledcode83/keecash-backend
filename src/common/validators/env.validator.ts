import { plainToInstance } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsString, Min, MinLength, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @MinLength(1)
  TYPEORM_HOST: string;

  @IsInt()
  @Min(1)
  TYPEORM_PORT: number;

  @IsString()
  @MinLength(1)
  TYPEORM_PASSWORD: string;

  @IsString()
  @MinLength(1)
  TYPEORM_DATABASE: string;

  @IsString()
  @MinLength(1)
  TYPEORM_USERNAME: string;

  @IsString()
  @MinLength(1)
  TYPEORM_CONNECTION: string;

  @IsString()
  @MinLength(1)
  TYPEORM_MIGRATIONS: string;

  @IsString()
  @MinLength(1)
  TYPEORM_MIGRATIONS_DIR: string;

  @IsString()
  @MinLength(1)
  TYPEORM_LOGGING: string;

  @IsString()
  @MinLength(1)
  TYPEORM_SYNCHRONIZE: string;

  @IsInt()
  @Min(10)
  TYPEORM_POOL_SIZE: number;

  @IsIn(['true', 'false'])
  POSTGRESQL_TLS: 'true' | 'false';

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
