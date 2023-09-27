import { Module } from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { OrderItemController } from './orderItem.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderItemController],
  providers: [OrderItemService]
})
export class OrderModule {}
