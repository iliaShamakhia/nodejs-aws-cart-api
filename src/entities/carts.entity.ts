import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { CartItemsEntity } from './cart_items.entity';
  import { CartStatuses } from 'src/cart';
import { forwardRef } from '@nestjs/common';
  
  @Entity('carts')
  export class Carts {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid', nullable: false })
    user_id: string;
  
    @Column({
      type: 'timestamp',
      default: new Date().toString(),
      nullable: false,
    })
    created_at: Date | string;
  
    @Column({ type: 'timestamp', default: '', nullable: false })
    updated_at: Date | string;
  
    @Column({
      type: 'enum',
      enum: ['OPEN', 'ORDERED'],
      default: 'OPEN',
      nullable: false,
    })
    status: CartStatuses;
  
    @OneToMany(() => CartItemsEntity, (cart_item: any) => cart_item.carts)
    items: CartItemsEntity[];
  }