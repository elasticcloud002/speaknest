import { Body, Controller, Post, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  MembershipDto,
  PaymentCreateDto,
  PaymentFindDto,
} from './dto/paymentCreate.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async findAll(@Body() paymentCreateDto: PaymentCreateDto) {
    return await this.paymentService.createPayment(paymentCreateDto);
  }

  @Post('find')
  async findPayment(@Body() paymentFindDto: PaymentFindDto) {
    return await this.paymentService.findPayment(paymentFindDto);
  }

  @Post('cancel')
  async cancelPayment(@Body() paymentFindDto: PaymentFindDto) {
    return await this.paymentService.cancelPayment(paymentFindDto);
  }

  @Post('forgot/code')
  async changeForgot(@Body() paymentFindDto: PaymentFindDto) {
    return await this.paymentService.changeCode(paymentFindDto);
  }

  @Post('membership')
  async membership(@Body() membershipDto: MembershipDto) {
    return await this.paymentService.membershipSub(membershipDto);
  }
}
