import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { usersProviders } from '../customer/customer.providers';
import { paymentProviders } from '../payment/payment.providers';

@Module({
  providers: [AuthService, ...usersProviders, ...paymentProviders],
  controllers: [AuthController],
})
export class AuthModule {}
