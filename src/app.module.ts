import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Carts } from './entities/carts.entity';
import { CartItemsEntity } from './entities/cart_items.entity';
import { OrdersEntity } from './entities/order.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [ UserEntity, Carts, CartItemsEntity, OrdersEntity ],
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
      ssl: {
        rejectUnauthorized: false,
      }
    })
  ],
  controllers: [AppController],
  //providers: [],
})
export class AppModule {}
