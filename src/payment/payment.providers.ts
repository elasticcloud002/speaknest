import { PaymentSchema } from './schema/payment.schema';

export const paymentProviders = [
  {
    provide: 'Payment',
    useValue: PaymentSchema,
  },
];
