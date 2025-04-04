import {
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerSchema } from '../customer/schema/customer.schema';
import { CustomerCreateInterface } from '../customer/interfaces/customerCreate.interface';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class TokenAuthorizationMiddleware implements NestMiddleware {
  constructor(
    @Inject('Customer') private readonly customerSchema: typeof CustomerSchema,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization'];
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_JWT,
      });
      const customer = await this.customerSchema.findOne({
        where: { id: payload.user_id },
      });
      if (customer) {
        return res.status(200).json({ data: customer });
      }
      res.status(403).json({ message: 'Customer not found' });
    } catch (e) {
      console.log(e);
      if (e.message === 'jwt expired') {
        throw new UnauthorizedException();
      }
    }
  }
}
