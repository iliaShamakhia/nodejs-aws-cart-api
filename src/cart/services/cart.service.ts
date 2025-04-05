import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Cart, CartStatuses } from '../models';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Carts } from 'src/entities/carts.entity';
import { EntityManager } from 'typeorm';
import { CartItemsEntity } from 'src/entities/cart_items.entity';

@Injectable()
export class CartService {
  constructor(
    /* @InjectRepository(Carts)
    private readonly cartRepository: Repository<Carts>,
    @InjectRepository(CartItemsEntity)
    private readonly cartItemRepository: Repository<CartItemsEntity> */
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ){}

  //private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Carts> {
    let cart = await this.entityManager.findOneBy(Carts, { user_id: userId });
    let items = await this.entityManager.findBy(CartItemsEntity, { cart_id: cart?.id});

    if (items?.length > 0) {
      cart.items = items;
    }

    return cart;
  }

  async createByUserId(user_id: string): Promise<Cart> {

    const userCart = {
      id: randomUUID(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
      status: CartStatuses.OPEN,
      items: [],
    };

    await this.entityManager.save(Carts, userCart);

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.entityManager.findOneBy(Carts, { user_id: userId })

    if (userCart) {
      const items = await this.entityManager.findBy(CartItemsEntity, {cart_id: userCart.id});

      if (items?.length > 0) {
        userCart.items = items;
      }

      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: any): Promise<Cart> {
    const userCart = await this.findOrCreateByUserId(userId);

    /* const index = userCart.items.findIndex(
      ({ product }) => product.id === payload.product.id,
    ); */

    if (payload.count === 0) {
      await this.entityManager.delete(CartItemsEntity, { product_id: payload.product.id });
    } else {
      await this.entityManager.save(CartItemsEntity, {
        cart_id: userCart.id,
        product_id: payload.product.id ? payload.product.id : payload.product.product_id,
        count: payload.count,
        title: payload.product.title,
        description: payload.product.description,
        price: payload.product.price
      });
    }

    return userCart;
  }

  async removeByUserId(userId): Promise<void> {
    await this.entityManager.delete(Carts, { user_id: userId});
  }
}
