import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@ApiTags('Manage Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ description: 'Get all notifications' })
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
