import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Billing } from "@prisma/client";
import { KotService } from "kot/kot.service";
import { printBilReceipt } from "utils/printer";
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
    try {
      const billingList = await this.prisma.billing.findMany({
        where: {
          ...filters,
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

        const list = await this.kotService.getProductListFromBillingId(
          billingId
        );
        return { ...billing, products: list };
      });
      return (await Promise.allSettled(billingResponse)).map(
        (info: any) => info?.value
      );
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
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
          ...filters,
        },
        include: {
          table: true,
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
      data: { ...updateBillingDto, isBillPrinted: false },
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
    try {
      const list = await this.kotService.getProductListFromBillingId(id);

      const updatedKot = await this.prisma.billing.update({
        where: {
          id,
        },
        data: { ...updateBillingDto, products: list, isBillPrinted: true },
      });
      const { isBillPrinterSuccess: isPrinted } = await printBilReceipt(
        updatedKot,
        null,
        "bill"
      );
      return { ...updatedKot, isPrinted };
    } catch (error) {
      console.log("Unable to print bill", error);
    }
  }
  async updateTables(updateBillingDto) {
    try {
      const fromTable = await this.prisma.tables.findFirst({
        where: {
          code: String(updateBillingDto?.from),
        },
      });
      const toTable = await this.prisma.tables.findFirst({
        where: {
          code: String(updateBillingDto?.to),
        },
      });

      

      return { fromTable, toTable };
    } catch (e) {
      console.log("error occurred during shifting table.");
    }
    // try {
    //   const fromTable = await this.prisma.tables.findFirst({
    //     where: {
    //       code: String(updateBillingDto?.from),
    //     },
    //   });

    //   const updateCurrentTable = await this.prisma.kot.findMany({
    //     where: {
    //       tableId: fromTable?.id,
    //     },
    //   });

    //   // Filter kotData array for each item in updateCurrentTable
    //   let array = [];
    //   updateCurrentTable.map((item) => {
    //     updateBillingDto?.kotData?.map(async (kot: any) => {
    //       if (kot.kotId != item.id) {
    //         item.kotData.map((prod:any) => {
    //           if(kot.productId != prod.productId) {
    //             array.push(prod)
    //           }
    //         })
    //       }
    //     });
    //   });

    //   return array;
    // } catch (error) {
    //   const { message, status } = error;
    //   throw new HttpException(message, status);
    // }
  }
}
