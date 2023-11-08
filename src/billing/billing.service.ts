import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Billing } from "@prisma/client";
import { KotService } from "kot/kot.service";
import { printBillReciept } from "utils/printer";
import { generateRandomNumber } from "utils/common";
import { CommonObjectType } from "types";

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService, private kotService: KotService) {}

  create(createBillingDto: Billing) {
    createBillingDto.billNo = generateRandomNumber(8);
    return this.prisma.billing.create({ data: createBillingDto });
  }

  async findAll(filters: CommonObjectType) {
    const billingList = await this.prisma.billing.findMany({
      where:{
        ...filters
      },
      include: {
        kotList: true,
        table: true,
      },
    });
    const billingResponse = billingList?.map(async (billing: Billing) => {
      const billingId = billing?.id;

      if (!billingId) {
        return {};
      }

      const list = await this.kotService.getProductListFromBillingId(billingId);
      return { ...billing, products: list };
    });
    return (await Promise.allSettled(billingResponse)).map(
      (info: any) => info?.value
    );
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

  async findBillFromTableCode(code: string, filters: CommonObjectType) {
    try {
      const billing = await this.prisma.billing.findFirst({
        where: {
          table: {
            code,
          },
          ...filters
        },
      });

      const billingId = billing?.id;

      if (!billingId) {
        return {};
      }

      const list = await this.kotService.getProductListFromBillingId(billingId);
      return { ...billing, products: list };
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
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

    const updatedKot = await this.prisma.billing.update({
      where: {
        id,
      },
      data: { ...updateBillingDto, products: list },
    });
    await printBillReciept(updatedKot, null, "bill");
    return updatedKot;
  }
}
