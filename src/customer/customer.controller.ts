import { Controller, Post, Body } from '@nestjs/common';

import { CustomerService } from './customer.service';
import {
  CustomerCreateDto,
  CustomerSendEmailDto,
} from './dto/customerCreate.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  async findAll(@Body() customerCreateDto: CustomerCreateDto) {
    return await this.customerService.createCustomer(customerCreateDto);
  }

  @Post('forgot/email')
  async forgot(@Body() customerSendEmailDto: CustomerSendEmailDto) {
    return await this.customerService.sendEmailCustomer(customerSendEmailDto);
  }
}
