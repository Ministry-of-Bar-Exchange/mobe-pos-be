import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Billing } from "@prisma/client";
import { KotService } from "kot/kot.service";

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService, private kotService: KotService) {}

  create(createBillingDto: Billing) {
    return this.prisma.billing.create({ data: createBillingDto });
  }

  findAll() {
    return this.prisma.billing.findMany({
      include: {
        kotList: true,
        table: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.billing.findUnique({
      where: {
        id,
      },
      include: {
        kotList: true,
        table: true,
      },
    });
  }

  async findBillFromTableCode(code: string) {
    const billing = await this.prisma.billing.findFirst({
      where: {
        table: {
          code,
        },
      },
    });

    const list = await this.kotService.getProductListFromBillingId(billing.id);
    return { ...billing, products: list };
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

  async handlePrintBill(id: string, updateBillingDto: Partial<Billing>) {
    const list = await this.kotService.getProductListFromBillingId(id);

    await this.prisma.billing.update({
      where: {
        id,
      },
      data: { ...updateBillingDto, products: list },
    });

    return list;
  }
}
