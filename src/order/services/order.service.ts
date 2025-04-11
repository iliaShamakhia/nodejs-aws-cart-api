import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Order } from '../models';
import { OrderStatus } from '../type';
import { OrdersEntity } from 'src/entities/order.entity';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Carts } from 'src/entities/carts.entity';
import { CartStatuses } from 'src/cart';
import { CartItemsEntity } from 'src/entities/cart_items.entity';

@Injectable()
export class OrderService {
  constructor(
    /* @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>, */
    /* @InjectRepository(Carts)
    private readonly cartsRepository: Repository<Carts>, */
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ){}
  private orders: Record<string, Order> = {};

  async getAll() {
    let orders = await this.entityManager.find(OrdersEntity);
    let items = await this.entityManager.find(CartItemsEntity);
    if(items){
      (orders as any).items = items;
    }
    return orders;
  }

  async findById(orderId: string): Promise<any> {
    return await this.entityManager.findBy(OrdersEntity, { id: orderId})
  }

  async create(data: any) {
    const id = randomUUID() as string;
    const order = {
      id,
      user_id: data.userId,
      cart_id: data.cartId,
      payment: JSON.stringify(data.address),
      delivery: JSON.stringify(data.address),
      comment: data.address.comment,
      status: OrderStatus.Open,
      total: data.total,
      items: data.items
    };

    

    await this.entityManager.transaction( async (entityManager) => {

      await entityManager.save(OrdersEntity, order);

      let cart = await entityManager.findOneBy(Carts, { id: order.cart_id });

      if (cart){
        cart.status = CartStatuses.ORDERED;
        await entityManager.save(Carts, cart);
        await entityManager.delete(CartItemsEntity, { cart_id: cart.id });
      }

    })

    return order;
  }

  // TODO add  type
  async update(orderId: string, data: any) {
    const order = await this.entityManager.findOneBy(OrdersEntity, { id: orderId });

    if (!order) {
      throw new Error('Order does not exist.');
    }
    let parsedPayment = JSON.parse(order.payment);
    parsedPayment.comment = data.comment;
    let paymentStringified = JSON.stringify(parsedPayment);

    order.delivery = paymentStringified;
    order.payment = paymentStringified;
    order.status = data.status;
    await this.entityManager.save(OrdersEntity, order);
  }

  async getOrderById(id: string) {
    return await this.entityManager.findOneBy(OrdersEntity, { id });
  }

  async removeById(id: string) {
    let order = await this.entityManager.findOneBy(OrdersEntity, { id });

    if(order){
      await this.entityManager.delete(OrdersEntity, { id });
    }
  }
}
