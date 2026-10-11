import {OmitType} from "@nestjs/swagger";
import { UserCreateDto } from './user-create.dto.js';

export class UserUpdateDto extends OmitType(UserCreateDto, ['email'] as const) {}
