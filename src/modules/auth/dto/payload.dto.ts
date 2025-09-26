import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class PayloadDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID('4')
  @IsNotEmpty()
  id: string;
}
