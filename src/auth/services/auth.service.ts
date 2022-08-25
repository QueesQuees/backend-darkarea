import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CBadRequestException } from 'src/common/exception';
import { ErrorMessages } from 'src/common/constant/error';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { LoginRes } from '../res/token.res';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private sessionService: SessionService,
  ) {}

  async login(payload: LoginDto, agent: string, ip: string): Promise<LoginRes> {
    const user = await this.userRepository.findOne({
      where: [{ username: payload?.username }, { email: payload?.username }],
      relations: ['role'],
    });

    if (!user || !user?.isActive) {
      throw new CBadRequestException(ErrorMessages.CAN_NOT_LOGIN, {});
    }

    if (!bcrypt.compareSync(payload?.password, user?.password)) {
      throw new CBadRequestException(ErrorMessages.CAN_NOT_LOGIN, {});
    }

    return await this.sessionService.createTokenLogin(user, agent, ip);
  }

  // async sendMailWhenCreateAcc(user: UserEntity) {
  //   const token = Math.floor(1000 + Math.random() * 9000).toString();
  //   // create user in db
  //   // ...
  //   // send confirmation mail
  //   await this.mailService.sendUserConfirmation(user, token);
  // }
}
