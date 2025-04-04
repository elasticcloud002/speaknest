import {
  Inject,
  NestMiddleware,
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CustomerSchema } from '../customer/schema/customer.schema';
import { isEmail } from 'class-validator';
@Injectable()
export class FindCustomerMiddleware implements NestMiddleware {
  constructor(
    @Inject('Customer') private readonly customerSchema: typeof CustomerSchema,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const customer = await this.customerSchema.findOne({ where: { email } });
    if (customer) {
      throw new HttpException(
        'This email is already registered',
        HttpStatus.FOUND,
      );
    }
    next();
  }
}
