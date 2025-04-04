import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { PaymentSchema } from '../../payment/schema/payment.schema';
import { JoinColumn, OneToOne } from 'typeorm';

@Table({
  modelName: 'customer',
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
})
export class CustomerSchema extends Model<CustomerSchema> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  id: number;
  @Column
  first_name: string;
  @Column
  last_name: string;
  @Column({ unique: true, primaryKey: true, allowNull: false })
  email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
  @Column
  code: string;
  @OneToOne(() => PaymentSchema, (payment) => payment.customer, {
    cascade: true,
  })
  @JoinColumn()
  payment: PaymentSchema;
}
