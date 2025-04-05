import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
  } from 'typeorm';
  //import { CartItemEntity } from './cart-item.entity'; // Assuming you have a CartItemEntity
  
  @Entity('orders')
  export class OrdersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid', nullable: false })
    user_id: string;
  
    @Column({ type: 'uuid', nullable: false })
    cart_id: string;
  
    @Column({ type: 'json', nullable: false })
    payment: string;

    @Column({ type: 'json', nullable: false })
    items: string;
  
    @Column({ type: 'json', nullable: false })
    delivery: string;
  
    @Column({ type: 'text' })
    comments: string;
  
    @Column({
      type: 'enum',
      enum: ['OPEN','APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED', 'ORDERED'],
      default: 'OPEN',
      nullable: false,
    })
    status: string;
  
    @Column({ type: 'numeric' })
    total: number;
  }