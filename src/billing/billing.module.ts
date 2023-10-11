import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { KotModule } from 'kot/kot.module';
import { ProductsModule } from 'products/products.module';

@Module({
  imports: [PrismaModule, KotModule, ProductsModule],
  controllers: [BillingController],
  providers: [BillingService]
})
export class BillingModule {}
