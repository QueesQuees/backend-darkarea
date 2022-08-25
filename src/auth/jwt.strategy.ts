import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { JWT_SECRET } from '@Constant/jwt';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

export const JWT_SECRET = 'sdgsdhdhrywuirywuiyrw12412412';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRolesBuilder()
    private rolesBuilder: RolesBuilder,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const grants = this.rolesBuilder.getGrants();

    const role = payload?.role || '';
    if (role === '') {
      return {
        ...payload,
        pers: [],
      };
    }
    const userRole = grants[role];
    return {
      ...payload,
      pers: userRole,
    };
  }
}
