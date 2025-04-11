import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './services';
import { OrdersEntity } from 'src/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [forwardRef(() => TypeOrmModule.forFeature([OrdersEntity]))],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
