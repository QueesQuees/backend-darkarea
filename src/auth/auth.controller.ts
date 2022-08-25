import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './res/token.res';
import { ParsedBody } from '@nestjsx/crud';
// import { UserEntity } from '@/entities/user.entity';
import { UserEntity } from 'src/user/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    description: 'Login with basic user',
  })
  async loginWithUser(
    @Body() payload: LoginDto,
    @Req() request: Request,
  ): Promise<LoginRes> {
    return await this.authService.login(
      payload,
      request.get('user-agent'),
      request.ip,
    );
  }

  // @Post('sendMail')
  // @ApiOperation({
  //   description: 'Send mail to Account new',
  // })
  // async senMail(@ParsedBody() payload: UserEntity) {
  //   return await this.authService.sendMailWhenCreateAcc(payload);
  // }
}
