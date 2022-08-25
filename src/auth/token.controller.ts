import { Controller, Post, Body, Get, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRes } from './res/token.res';
import { RefreshDto } from './dto/refresh.dto';
import { SessionService } from './services/session.service';
import { LogoutDto } from './dto/logout.dto';

@Controller('token')
@ApiTags('Auth')
export class TokenController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('refresh')
  @ApiOperation({
    description: 'Refresh new token',
  })
  async loginWithUser(@Body() payload: RefreshDto): Promise<LoginRes> {
    return await this.sessionService.refreshToken(payload);
  }

  @Delete('')
  @ApiOperation({
    description: 'Logout token',
  })
  async deleteToken(@Body() payload: LogoutDto) {
    await this.sessionService.deleteToken(payload);
    return {
      success: true,
    };
  }
}
