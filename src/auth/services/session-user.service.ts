import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { JWT_LOG_OUT } from 'src/common/constant/jwt';
import { SessionEntity } from 'src/entities/session.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class SessionUserService {
  private readonly logger: Logger = new Logger(SessionUserService.name);

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache,
  ) {}

  async deleteAllToken(userId: string): Promise<void> {
    const sessions = await this.sessionRepo.find({
      where: { userId, deletedAt: IsNull() },
    });
    if (sessions && sessions.length > 0) {
      for (const s of sessions) {
        await this.cacheManager.set(`${JWT_LOG_OUT}.${s.token}`, JWT_LOG_OUT);
      }
    }
    await this.sessionRepo.update({ userId }, { deletedAt: new Date() });
  }
}
