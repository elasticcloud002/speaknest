import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { CustomerSchema } from './schema/customer.schema';

function generateCode() {
  let length = 5,
    charset = 'abcdefghijklmnopqrstuvwxyz0123456789',
    retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

@Injectable()
export class CustomerService {
  constructor(
    @Inject('Customer') private readonly customerSchema: typeof CustomerSchema,
  ) {}

  async createCustomer(customerCreateDto): Promise<string> {
    const hashPassword = await bcrypt.hash(customerCreateDto.password, 10);
    await this.customerSchema.create(
      _.assignIn(customerCreateDto, { password: hashPassword }),
    );
    return 'Customer is created';
  }

  async sendEmailCustomer(customerSendEmailDto): Promise<string> {
    const code = generateCode();
    const customer = await this.customerSchema.findOne({
      where: { email: customerSendEmailDto.email },
    });
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.FOUND);
    }
    await this.customerSchema.update(
      { code: code },
      { where: { email: customerSendEmailDto.email } },
    );
    return 'Code send';
  }
}
