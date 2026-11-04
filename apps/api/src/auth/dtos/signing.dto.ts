import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigningDto {
  @ApiProperty({
    default: 'johndoe@example.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'password123',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
