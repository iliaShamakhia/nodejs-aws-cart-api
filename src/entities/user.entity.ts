import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
  } from 'typeorm';
  //import { CartItemEntity } from './cart-item.entity'; // Assuming you have a CartItemEntity
  
  @Entity('cart')
  export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'text', nullable: false })
    name: string;
  
    @Column({ type: 'text', nullable: false })
    email: string;
  
    @Column({ type: 'text', nullable: false })
    password: string;
  }