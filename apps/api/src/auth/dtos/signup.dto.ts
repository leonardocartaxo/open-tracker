import {IsEmail, IsNotEmpty, MinLength} from "class-validator";
import {ApiProperty} from '@nestjs/swagger';

export class SignupDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: 'John Doe',
        nullable: false,
    })
    @IsNotEmpty()
    name: string;

    @MinLength(6)
    password: string;

    @MinLength(6)
    passwordConfirm: string;
}
