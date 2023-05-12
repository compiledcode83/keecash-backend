import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@ApiTags('Manage Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ description: 'Get all notifications' })
  @ApiOkResponse({
    description: 'Notification response',
    schema: {
      example: {
        notifications: [
          {
            date: '2023-05-03T12:51:07.656Z',
            type: 'DEPOSIT',
            status: 'UNREAD',
            message: null,
            amount: 100,
            currency: 'EUR',
            url_avatar: '',
            card_brand: '',
            card_name: '',
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Req() req): Promise<any> {
    return this.notificationService.findAll(req.user.id);
  }

  @ApiOperation({ description: 'Mark all notifications as read' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('read-all')
  markAsReadAll(@Req() req): Promise<any> {
    return this.notificationService.markAsReadAdll(req.user.id);
  }
}
