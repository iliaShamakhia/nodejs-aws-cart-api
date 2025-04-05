import { forwardRef, Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carts } from 'src/entities/carts.entity';
import { CartItemsEntity } from 'src/entities/cart_items.entity';

@Module({
  imports: [forwardRef(() => TypeOrmModule.forFeature([Carts, CartItemsEntity])), forwardRef(() => OrderModule)],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
