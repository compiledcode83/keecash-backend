import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminAuthModule } from '@admin/auth/admin-auth.module';
import { AdminModule } from '@admin/admin/admin.module';
import { AuthModule } from '@api/auth/auth.module';
import { BeneficiaryModule } from '@api/beneficiary/beneficiary.module';
import { CardModule } from '@api/card/card.module';
import { UserModule } from '@api/user/user.module';
import { AdminUserModule } from './admin/user/user.module';
import { AdminCountryModule } from './admin/country/country.module';
import { AdminCryptoTxModule } from './admin/crypto-tx/crypto-tx.module';
import { AdminCardModule } from './admin/card/card.module';
import { AdminBeneficiaryModule } from './admin/beneficiary/beneficiary.module';
import { CardHistoryModule } from './api/card-history/card-history.module';

export class SwaggerManager {
  static setSwaggerDefaults(app: INestApplication): INestApplication {
    const publicApiConfig = new DocumentBuilder()
      .setTitle('Keecash Public API')
      .setDescription('The Keecash Public API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer('/api/v1')
      .build();

    const adminApiConfig = new DocumentBuilder()
      .setTitle('Keecash Admin API')
      .setDescription('The Keecash Admin API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer('/api/v1')
      .build();

    const publicDocument = SwaggerModule.createDocument(app, publicApiConfig, {
      include: [AuthModule, CardModule, CardHistoryModule, UserModule, BeneficiaryModule],
    });
    const adminDocument = SwaggerModule.createDocument(app, adminApiConfig, {
      include: [
        AdminModule,
        AdminAuthModule,
        AdminUserModule,
        AdminCountryModule,
        AdminCryptoTxModule,
        AdminCardModule,
        AdminBeneficiaryModule,
      ],
    });

    SwaggerModule.setup('docs/public', app, publicDocument);
    SwaggerModule.setup('docs/admin', app, adminDocument);

    return app;
  }
}
