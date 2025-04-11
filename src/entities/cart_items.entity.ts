import {
    Entity,
    PrimaryGeneratedColumn,
    PrimaryColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Carts } from './carts.entity';
import { forwardRef } from '@nestjs/common';
  
  @Entity('cart_items')
  export class CartItemsEntity {
    @Column({ type: 'uuid', nullable: false })
    cart_id: string;
  
    @PrimaryColumn({ type: 'uuid', nullable: false })
    product_id: string;
  
    @Column({ type: 'int' })
    count: number;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'numeric' })
    price: number;
  
    @ManyToOne(() => Carts, (cart) => cart.items)
    cart: Carts;
  }