import { Inject, NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomerSchema } from '../customer/schema/customer.schema';
import * as http from 'node:http';
import { PaymentSchema } from 'src/payment/schema/payment.schema';
import { PaymentService } from 'src/payment/payment.service';
@Injectable()
export class AuthFindCustomerMiddleware implements NestMiddleware {
  constructor(
    @Inject('Customer') private readonly customerSchema: typeof CustomerSchema,
    @Inject('Payment') private readonly paymentSchema: typeof PaymentSchema,
    private readonly paymentService: PaymentService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const customer = await this.customerSchema.findOne({ where: { email } });
    if (!customer) {
      return res
        .status(HttpStatus.FOUND)
        .json({ message: 'This email is not registered' });
    }
    const payment = await this.paymentSchema.findOne({
      where: { email: customer.email },
    });
    let customerData: any = {};
    if (payment) {
      const dateString = payment.subscribe_date;
      let subscribe_date = new Date(dateString);
      subscribe_date.setDate(subscribe_date.getDate() + 30);
      const dateNow = Date.now();
      if (subscribe_date < (dateNow as unknown as Date)) {
        await this.paymentService.cancelPayment({ email: customer.email });

        subscribe_date = null;
      }
      customerData = {
        ...customer,
        card_id: payment.card_id,
        subscribe_date: subscribe_date.toUTCString().toString(),
      };
    } else {
      customerData = customer;
    }
    req.body.customer = customerData;
    next();
  }
}
