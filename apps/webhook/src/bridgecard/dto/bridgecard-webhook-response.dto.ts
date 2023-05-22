import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class BridgecardWebhookResponseDto {
  @ApiProperty({
    example: 'cardholder_verification.successful',
    description: 'Webhook response event',
  })
  @IsString()
  event: string;

  @ApiProperty({
    example: {
      cardholder_id: '859505050505',
      is_active: true,
      livemode: false,
      issuing_app_id: '9ujinoncpsni3943198393939930ke',
    },
    description: 'Webhook response body',
  })
  @IsObject()
  data: any;
}
