import {CurrentUser} from './current-user.dto.js';

export class JwtPayload {
	user: CurrentUser;
	iat?: number;
	exp?: number;
}
