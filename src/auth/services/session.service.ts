import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ErrorMessages } from 'src/common/constant/error';
import { JWT_LOG_OUT } from 'src/common/constant/jwt';
import { CBadRequestException } from 'src/common/exception';
import { makeRandomString } from 'src/common/util/string';
import { SessionEntity } from 'src/entities/session.entity';
import { UserEntity } from 'src/user/user.entity';
import { IsNull, Repository } from 'typeorm';
import { LogoutDto } from '../dto/logout.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { LoginRes } from '../res/token.res';

@Injectable()
export class SessionService {
  private readonly logger: Logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache,
  ) {}

  async createTokenLogin(
    user: UserEntity,
    agent: string,
    ip?: string,
  ): Promise<LoginRes> {
    const refreshToken = `${makeRandomString(60, 'Aa#')}.${user.id}`;
    const payloadSign = { sub: user.id };
    const token = this.jwtService.sign(payloadSign);
    await this.sessionRepo.save({
      refreshToken,
      token,
      ip,
      agent,
      userId: user.id,
    });
    const decode = this.jwtService.decode(token);
    return {
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: 3600,
      expiresAt: decode['exp'],
    };
  }

  async refreshToken(payload: RefreshDto): Promise<LoginRes> {
    const tokens = payload.refreshToken.split('.');
    if (!tokens || tokens.length !== 2) {
      throw new CBadRequestException(ErrorMessages.REFRESH_TOKEN_WRONG);
    }
    const session = await this.sessionRepo.findOne({
      where: {
        userId: tokens[1],
        refreshToken: payload.refreshToken,
        deletedAt: IsNull(),
      },
    });
    if (!session) {
      throw new CBadRequestException(ErrorMessages.REFRESH_TOKEN_WRONG);
    }
    const user = await this.userRepo.findOne(session.userId);
    const refreshToken = `${makeRandomString(60, 'Aa#')}.${user.id}`;
    const payloadSign = { sub: user.id };
    const token = this.jwtService.sign(payloadSign);
    await this.sessionRepo.update(session.id, {
      refreshToken,
      token,
      updatedAt: new Date(),
    });
    const decode = this.jwtService.decode(token);
    return {
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: 3600,
      expiresAt: decode['exp'],
    };
  }

  async deleteToken(payload: LogoutDto): Promise<void> {
    const decode = this.jwtService.decode(payload.token);
    const session = await this.sessionRepo.findOne({
      where: {
        userId: decode['sub'],
        token: payload.token,
        deletedAt: IsNull(),
      },
    });

    if (session) {
      await this.sessionRepo.update(session.id, { deletedAt: new Date() });
      await this.cacheManager.set(
        `${JWT_LOG_OUT}.${payload.token}`,
        JWT_LOG_OUT,
      );
    }
  }

  async deleteAllToken(userId: string): Promise<void> {
    const sessions = await this.sessionRepo.find({
      where: {
        userId,
        deletedAt: IsNull(),
      },
    });
    if (sessions && sessions.length > 0) {
      for (const s of sessions) {
        await this.cacheManager.set(`${JWT_LOG_OUT}.${s.token}`, JWT_LOG_OUT);
      }
    }
    await this.sessionRepo.update({ userId }, { deletedAt: new Date() });
  }
}
