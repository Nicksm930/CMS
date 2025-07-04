import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'nikhilmore',
    });
  }

  async validate(payload: any) {
    return {
      _id: payload._id,
      email: payload.email,
      user_role: payload.user_role,
    };
  }
}
