import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule, Cron } from '@nestjs/schedule';

import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { configRoot } from './config.root';
import { FindCustomerMiddleware } from './middleware/find.middleware';
import { usersProviders } from './customer/customer.providers';
import { AuthFindCustomerMiddleware } from './middleware/auth.find.customer.middleware';
import { jwtRoot } from './jwt.root';
import { TokenAuthorizationMiddleware } from './middleware/tokenAuthorization.middleware';
import { PaymentModule } from './payment/payment.module';
import { MailModule } from './mail/mail.module';
import { paymentProviders } from './payment/payment.providers';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [
    configRoot,
    jwtRoot,
    DbModule,
    AuthModule,
    CustomerModule,
    PaymentModule,
    MailModule,
    ScheduleModule.forRoot(),
  ],
  providers: [...usersProviders, ...paymentProviders, PaymentService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FindCustomerMiddleware)
      .forRoutes({ path: 'customer/create', method: RequestMethod.POST })
      .apply(AuthFindCustomerMiddleware)
      .forRoutes({ path: 'auth/signin', method: RequestMethod.POST })
      .apply(TokenAuthorizationMiddleware)
      .forRoutes({
        path: 'auth/authorization/token',
        method: RequestMethod.GET,
      });
  }
}
