import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class SigningDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}
