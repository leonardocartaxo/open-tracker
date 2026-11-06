import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    default: 'johndoe@example.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'John Doe',
    nullable: false,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    default: 'password123',
    nullable: false,
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    default: 'password123',
    nullable: false,
  })
  @MinLength(6)
  passwordConfirm: string;
}
