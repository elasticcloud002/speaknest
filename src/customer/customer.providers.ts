import { CustomerSchema } from './schema/customer.schema';

export const usersProviders = [
  {
    provide: 'Customer',
    useValue: CustomerSchema,
  },
];
