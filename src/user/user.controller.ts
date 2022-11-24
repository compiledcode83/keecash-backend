import {
  Body,
  Controller,
  forwardRef,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { EmailComfirmationService } from '@src/email-comfirmation/email-confirmation.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => EmailComfirmationService))
    private readonly emailComfirmationService: EmailComfirmationService,
  ) {}

  @ApiOperation({ description: `Register a new user` })
  @ApiResponse(ApiResponseHelper.success(User, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @Post('auth/register')
  async register(@Body() body: CreateUserDto): Promise<string> {
    await this.userService.create(body);
    const response =
      await this.emailComfirmationService.sendEmailComfirmationLink(body.email);
    return response;
  }
}
