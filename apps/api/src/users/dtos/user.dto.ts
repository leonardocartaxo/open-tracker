import {UserEntity} from "../entities/user.entity.js";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";

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

    @ApiProperty({
        default: 'john-doe@example.com',
        nullable: false,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: 'John',
        nullable: false,
    })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        default: 'Doe',
        nullable: false,
    })
    @IsNotEmpty()
    lastName: string;
}
