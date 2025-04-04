import { IsEmail, IsNotEmpty } from 'class-validator';

export class CustomerCreateDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CustomerSendEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
