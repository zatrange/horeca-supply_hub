import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: {
        supplier: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        supplier: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(userId: number, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        supplierId: userId,
      },
    });
  }

  async update(userId: number, productId: number, dto: UpdateProductDto) {
    const product = await this.findOne(productId);
    if (product.supplierId !== userId) throw new ForbiddenException('Not your product');

    return this.prisma.product.update({
      where: { id: productId },
      data: dto,
    });
  }

  async remove(userId: number, productId: number) {
    const product = await this.findOne(productId);
    if (product.supplierId !== userId) throw new ForbiddenException('Not your product');

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }
}
