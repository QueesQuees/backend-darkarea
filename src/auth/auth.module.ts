import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigHolidayEntity } from '@/entities/configHoliday.entity';
import { UnAllocationEntity } from '@/entities/unallocation.entity';
import { JWT_LIFETIME, JWT_SECRET } from 'src/common/constant/jwt';
import { UserProjectEntity } from '@/entities/user-project.entity';
import { AllocationEntity } from '@/entities/allocation.entity';
import { CustomerEntity } from '@/entities/customer.entity';
import { RequestEntity } from '@/entities/request.entity';
import { ProjectEntity } from '@/entities/project.entity';
import { SessionEntity } from '@/entities/session.entity';
import { RoleEntity } from '@/entities/role.entity';
import { UserEntity } from '@/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { AllocationService } from '@/allocations/services/allocations.service';
import { ProjectService } from '../projects/services/projects.service';
import { SessionService } from './services/session.service';
import { MailService } from '@/mail/service/mail.service';
import { AuthService } from './services/auth.service';
import { TokenController } from './token.controller';
import { AuthController } from './auth.controller';
import { MailModule } from '@/mail/mail.module';
import { ContractService } from '@/contract/services/contracts.service';
import { ContractEntity } from '@/entities/contract.entity';
import { ContractHistoryEntity } from '@/entities/contracthistory.entity';
import { TimeKeepingEntity } from '@/entities/timekeeping.entity';
import { ErrorEntity } from '@/entities/error.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      ProjectEntity,
      RoleEntity,
      UserProjectEntity,
      AllocationEntity,
      CustomerEntity,
      RequestEntity,
      ConfigHolidayEntity,
      UnAllocationEntity,
      ContractEntity,
      ContractHistoryEntity,
      TimeKeepingEntity,
      ErrorEntity,
    ]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: `${JWT_LIFETIME}s` },
    }),
    MailModule,
  ],
  controllers: [AuthController, TokenController],
  providers: [
    AuthService,
    SessionService,
    ProjectService,
    JwtStrategy,
    MailService,
    AllocationService,
    ContractService,
  ],
  exports: [SessionService],
})
export class AuthModule {}
