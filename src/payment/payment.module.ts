import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { paymentProviders } from './payment.providers';
import { MailService } from '../mail/mail.service';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [CustomerModule],
  controllers: [PaymentController],
  providers: [PaymentService, MailService, ...paymentProviders],
})
export class PaymentModule {}
