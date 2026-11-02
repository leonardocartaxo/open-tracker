import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {CurrentUser} from '../dtos/current-user.dto.js';
import {JwtPayload} from '../dtos/jwt-payload.dto.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    return {
      id: payload?.user?.id,
      email: payload?.user?.email,
      name: payload?.user?.name,
      roles: payload?.user?.roles,
    };
  }
}
