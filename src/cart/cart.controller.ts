import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { Order, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { CartItem } from './models';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  //@UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CartItem[]> {
    const cart = await this.cartService.findOrCreateByUserId(
      "28f2c392-2daf-4680-b780-73bab87c7b43" //For now my shop does not support registering users, so I use only one user.
      //getUserIdFromRequest(req),
    );

    return cart.items || [];
  }

  // @UseGuards(JwtAuthGuard)
  //@UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() body: PutCartPayload,
  ): Promise<CartItem[]> {
    // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId(
      "28f2c392-2daf-4680-b780-73bab87c7b43",
      body,
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  //@UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId("28f2c392-2daf-4680-b780-73bab87c7b43");
  }

  // @UseGuards(JwtAuthGuard)
  //@UseGuards(BasicAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = "28f2c392-2daf-4680-b780-73bab87c7b43";
    const cart = await this.cartService.findByUserId(userId);
    

    if (!(cart && cart.items.length)) {
      throw new BadRequestException('Cart is empty');
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(items);
    const order = await this.orderService.create({
      userId,
      cartId,
      address: body.address,
      total,
      items: JSON.stringify(items)
    });
    //this.cartService.removeByUserId(userId);

    return {
      order,
    };
  }

  //@UseGuards(BasicAuthGuard)
  @Get('order')
  async getOrder(): Promise<any> {
    return await this.orderService.getAll();
  }

  @Get('order/:id')
  async getOrderById(@Param('id') id: string): Promise<any> {
    return await this.orderService.getOrderById(id);
  }

  @Put('order/:id/status')
  async updateOrderById(@Param('id') id: string, @Body() body: any): Promise<any> {
    return await this.orderService.update(id, body);
  }

  @Delete('order/:id')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Param('id') id: string) {
    await this.orderService.removeById(id);
  }
}
