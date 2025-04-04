import { IsEmail, IsNotEmpty } from 'class-validator';

export class PaymentCreateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  type: string;
}

export class PaymentFindDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class MembershipDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  full_name: string;
}
