import { Table, Column, Model } from 'sequelize-typescript';
import { CustomerSchema } from '../../customer/schema/customer.schema';
import { OneToOne } from 'typeorm';
@Table({
  modelName: 'payment',
})
export class PaymentSchema extends Model<PaymentSchema> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  id: number;
  @Column
  card_id: string;
  @Column
  subscribe_id: string;
  @Column
  subscribe_type: string;
  @Column
  card_number: string;
  @Column
  subscribe_date: Date;
  @Column
  code: number;
  @Column
  card_date: string;
  @Column
  charges_id: string;
  @Column
  platform: string;
  @Column
  card_name: string;
  @Column
  email: string;
  @Column
  country: string;
  @Column
  post_code: string;
  @OneToOne(() => CustomerSchema, (customer) => customer.payment)
  customer: CustomerSchema;
}
