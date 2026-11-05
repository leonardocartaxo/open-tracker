import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CurrentUser } from '../dtos/current-user.dto';
import { JwtPayload } from '../dtos/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<CurrentUser> {
    return {
      id: jwtPayload?.user?.id,
      email: jwtPayload?.user?.email,
      name: jwtPayload?.user?.name,
      role: jwtPayload?.user?.role,
    };
  }
}
