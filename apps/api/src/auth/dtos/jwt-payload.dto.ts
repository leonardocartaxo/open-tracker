import { CurrentUser } from './current-user.dto';

export class JwtPayload {
  user: CurrentUser;

  iat?: number;

  exp?: number;
}
