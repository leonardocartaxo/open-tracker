import {UserEntity} from "../entities/user.entity.js";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto implements Omit<UserEntity, 'hashedPassword' > {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date | null;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
}
