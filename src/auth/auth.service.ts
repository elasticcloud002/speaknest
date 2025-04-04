import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerSchema } from '../customer/schema/customer.schema';
import { PaymentSchema } from '../payment/schema/payment.schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Customer') private readonly customerSchema: typeof CustomerSchema,
    @Inject('Payment') private readonly paymentSchema: typeof PaymentSchema,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signInDto): Promise<object> {
    const access_token = await this.jwtService.signAsync(
      { user_id: signInDto.customer.id },
      { expiresIn: '525600m' },
    );
    return {
      access_token,
      id: signInDto.customer.id,
      email: signInDto.customer.email,
      first_name: signInDto.customer.first_name,
      last_name: signInDto.customer.last_name,
      card_id: signInDto.customer.card_id,
      subscribe_date: signInDto.customer.subscribe_date,
    };
  }

  async authorization(): Promise<object> {
    return {};
  }

  async deleteAccount(deleteAccountDto): Promise<string> {
    const customer = await this.customerSchema.findOne({
      where: { id: deleteAccountDto.customer_id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const payment = await this.paymentSchema.findOne({
      where: { email: customer.email },
    });

    if (payment) {
      await this.paymentSchema.destroy({
        where: { id: payment.id },
      });
    }

    await this.customerSchema.destroy({
      where: { id: deleteAccountDto.customer_id },
    });
    return 'account is deleted';
  }
}
