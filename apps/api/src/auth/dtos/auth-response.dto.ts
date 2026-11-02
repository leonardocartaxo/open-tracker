import {CurrentUser} from "./current-user.dto.js";

export class AuthResponseDto {
    bearerToken: string;
    user: CurrentUser;
}
