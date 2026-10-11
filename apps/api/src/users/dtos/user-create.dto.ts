import {UserDto} from "./user.dto.js";
import {ApiProperty} from "@nestjs/swagger";

export class UserCreateDto implements Omit<UserDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive'> {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    password: string;
}
