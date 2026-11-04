import { CurrentUser } from './current-user.dto';

export class AuthResponseDto {
  bearerToken: string;

  user: CurrentUser;
}
