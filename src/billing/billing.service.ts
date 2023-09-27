import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Billing } from "@prisma/client";

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  create(createBillingDto: Billing) {
    return this.prisma.billing.create({ data: createBillingDto });
  }

  findAll() {
    return this.prisma.billing.findMany({
      include: {
        itemList: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.billing.findUnique({
      where: {
        id,
      },
      include: {
        itemList: true,
      },
    });
  }

  async update(id: string, updateBillingDto: Partial<Billing>) {
    const updatedBilling = await this.prisma.billing.update({
      where: {
        id,
      },
      data: updateBillingDto,
    });
    return updatedBilling;
  }

  remove(id: string) {
    return this.prisma.billing.update({
      where: {
        id,
      },
      data: { isDeleted: true },
    });
  }
}
