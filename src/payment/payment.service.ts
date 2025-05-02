import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PaymentSchema } from './schema/payment.schema';
import { MailService } from './../mail/mail.service';
import { Op } from 'sequelize';

import * as process from 'process';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { CustomerSchema } from 'src/customer/schema/customer.schema';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

function generateCode() {
  let length = 4,
    charset = '0123456789',
    retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('Payment') private readonly paymentSchema: typeof PaymentSchema,
    @Inject('Customer') private readonly customerSchema: typeof CustomerSchema,
    private mailService: MailService,
  ) {}

  async createPayment(paymentCreateDto): Promise<string> {
    try {
      const payment = await this.paymentSchema.findOne({
        where: { email: paymentCreateDto.email },
      });
      if (payment) {
        return 'Payment';
      }
      if (paymentCreateDto.platform === 'ios') {
        const data = {
          subscribe_id: paymentCreateDto.subscriptionId,
          card_id: paymentCreateDto.card_id,
          type: paymentCreateDto.type,
          platform: paymentCreateDto.platform,
          code: paymentCreateDto.code,
          // subscribe_date: paymentCreateDto.type,
          email: paymentCreateDto.email,
        };
        await this.paymentSchema.create(data);
        const customer = await this.customerSchema.findOne({
          where: { email: paymentCreateDto.email },
        });
        let customerData: any = {};
        const payment = await this.paymentSchema.findOne({
          where: { email: customer.email },
        });
        if (payment) {
          const dateString = payment.subscribe_date;
          const subscribe_date = new Date(dateString);
          subscribe_date.setDate(subscribe_date.getDate() + 30);
          customerData = {
            ...customer,
            card_id: payment.card_id,
            subscribe_date: subscribe_date.toUTCString().toString(),
          };
        }
        return customerData;
      } else {
        const customer = await stripe.customers.create({
          email: paymentCreateDto.email,
          name: paymentCreateDto.card_name,
          source: paymentCreateDto.stripe_token.id,
        });
        const data = {
          customer_stripe_id: customer.id,
          subscribe_type: paymentCreateDto.type,
          card_number: paymentCreateDto.stripe_token.card.last4,
          card_id: paymentCreateDto.stripe_token.card.id,
          card_date: paymentCreateDto.card_date,
          card_name: paymentCreateDto.card_name,
          email: paymentCreateDto.email,
          code: paymentCreateDto.code,
          post_code: paymentCreateDto.post_code,
          subscribe_date: `${new Date()}`,
          subscribe_id: undefined,
          charges_id: undefined,
        };
        const charges = await stripe.charges.create({
          amount: 1500,
          currency: 'usd',
          customer: customer.id,
        });
        data.charges_id = charges.id;
        // @ts-ignore
        await this.paymentSchema.create(data);
      }
      await this.mailService.sendCustomerPaymentSuccess(
        paymentCreateDto.email as string,
      );
      await this.mailService.customerPaymentSuccess(
        paymentCreateDto.email as string,
      );

      return 'Payment is created';
    } catch (e) {
      console.log(e.message);
      throw new HttpException(
        e.message ? e.message : 'Payment incorrect',
        HttpStatus.FOUND,
      );
    }
  }

  async findPayment(paymentFindDto): Promise<Object> {
    const payment = await this.paymentSchema.findOne({
      where: { email: paymentFindDto.email },
    });
    return payment;
  }

  async cancelPayment(paymentFindDto): Promise<Object> {
    const payment = await this.paymentSchema.findOne({
      where: { email: paymentFindDto.email },
    });
    if (payment.subscribe_id) {
      await stripe.subscriptions.update(payment.subscribe_id, {
        cancel_at_period_end: true,
      });
    }
    await this.paymentSchema.destroy({
      where: { email: paymentFindDto.email },
    });
    return payment;
  }

  async changeCode(paymentFindDto): Promise<number> {
    // const code = generateCode();
    // const numericCode = parseInt(code, 10);
    const payment = await this.paymentSchema.findOne({
      where: { email: paymentFindDto.email },
    });
    const code = payment.code;
    if (payment) {
      await this.mailService.sendUserConfirmation(paymentFindDto.email, code);
    }
    return code;
  }

  async membershipSub(membershipDto): Promise<string> {
    await this.mailService.sendMembership(
      membershipDto.email,
      membershipDto.full_name,
    );
    return 'Ok';
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleEvery10Minutes() {
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const payment = await this.paymentSchema.findAll({
      where: {
        createdAt: {
          [Op.lte]: thirtyDaysAgo,
        },
        platform: {
          [Op.ne]: 'auto_apple',
        },
      },
    });
    const deleteItems = [];
    for (let i = 0; i < payment.length; i += 1) {
      deleteItems.push(payment[i].id);
    }
    await this.paymentSchema.destroy({
      where: {
        id: deleteItems,
      },
    });
  }
}
