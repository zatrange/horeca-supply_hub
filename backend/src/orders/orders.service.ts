import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new BadRequestException(`Not enough stock for ${product.name}`);

      totalPrice += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });

      // Update stock
      await this.prisma.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity }
      });
    }

    return this.prisma.order.create({
      data: {
        restaurantId: userId,
        totalPrice,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });
  }

  findAll(user: any) {
    if (user.role === Role.RESTAURANT) {
      return this.prisma.order.findMany({
        where: { restaurantId: user.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else if (user.role === Role.SUPPLIER) {
      // Supplier sees orders that contain their products
      return this.prisma.order.findMany({
        where: {
          items: {
            some: {
              product: { supplierId: user.id }
            }
          }
        },
        include: { 
          restaurant: { select: { name: true, email: true } },
          items: { include: { product: true } } 
        },
        orderBy: { createdAt: 'desc' }
      }).then(orders => orders.map(order => {
        // Filter items to only show the supplier's products
        const filteredItems = order.items.filter(item => item.product.supplierId === user.id);
        const supplierTotal = filteredItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        return { ...order, items: filteredItems, supplierTotal };
      }));
    }
  }

  async updateStatus(userId: number, orderId: number, dto: UpdateOrderStatusDto) {
    // Only supplier can update. Check if order contains their products.
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });
    if (!order) throw new NotFoundException('Order not found');

    const hasSupplierProduct = order.items.some(item => item.product.supplierId === userId);
    if (!hasSupplierProduct) throw new ForbiddenException('Not authorized to update this order');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });
  }
}
