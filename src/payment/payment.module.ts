import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { paymentProviders } from './payment.providers';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, MailService, ...paymentProviders],
})
export class PaymentModule {}
