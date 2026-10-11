import { UserCreateDto } from './user-create.dto.js';
import {ApiProperty} from "@nestjs/swagger";

export class UserUpdateDto implements Omit<UserCreateDto, 'email' | 'password'> {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

}
