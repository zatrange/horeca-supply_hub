import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, ProductsModule, OrdersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
