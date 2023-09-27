import { Injectable } from "@nestjs/common";
import { OrderItem } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  create(createTableDto: OrderItem) {
    return this.prisma.orderItem.create({ data: createTableDto });
  }

  findAll() {
    return this.prisma.orderItem.findMany({});
  }

  findOne(id: string) {
    return this.prisma.orderItem.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateTableDto: Partial<OrderItem>) {
    const updatedTable = await this.prisma.orderItem.update({
      where: {
        id,
      },
      data: updateTableDto,
    });
    return updatedTable;
  }

  remove(id: string) {
    return this.prisma.orderItem.update({
      where: {
        id,
      },
      data: { isDeleted: true },
    });
  }
}
