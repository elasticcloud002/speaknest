import { Controller, Post, Body, Get } from '@nestjs/common';
import { DeleteAccountDto, SignInDto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { tsxRegex } from 'ts-loader/dist/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('delete/account')
  async deleteAccount(@Body() deleteAccountDto: DeleteAccountDto) {
    return this.authService.deleteAccount(deleteAccountDto);
  }

  @Get('authorization/token')
  async authorization() {
    return this.authService.authorization();
  }
}
