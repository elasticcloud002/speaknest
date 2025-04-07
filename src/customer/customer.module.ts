import { Module } from '@nestjs/common';

import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { usersProviders } from './customer.providers';
import { paymentProviders } from '../payment/payment.providers';

@Module({
  providers: [CustomerService, ...usersProviders],
  controllers: [CustomerController],
  exports: [CustomerService, ...usersProviders],
})
export class CustomerModule {}
