import {OmitType} from "@nestjs/swagger";
import {UserDto} from "./user.dto.js";

export class UserCreateDto extends OmitType(UserDto, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'isActive'] as const) {}
