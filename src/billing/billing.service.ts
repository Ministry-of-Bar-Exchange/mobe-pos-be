import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Billing } from "@prisma/client";
import { KotService } from "kot/kot.service";
import { printBilReceipt } from "utils/printer";
import { generateRandomNumber } from "utils/common";
import { CommonObjectType, UpdateKotItemListType } from "types";

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

  async shiftItem(updateBillingDto) {
    try {
      const fromTable = await this.prisma.tables.findFirst({
        where: {
          code: String(updateBillingDto?.from),
        },
      });
      if (!fromTable) {
        throw new HttpException("No current table found", 400);
      }

      const toTable = await this.prisma.tables.findFirst({
        where: {
          code: String(updateBillingDto?.to),
        },
      });

      if (!toTable) {
        throw new HttpException("No bill found to shift table", 400);
      }

      const billingFromShift: any = await this.prisma.billing.findFirst({
        where: {
          tableId: fromTable?.id,
          status: "UNSETTLED",
          isBillPrinted: false,
        },
      });
      if (!billingFromShift) {
        throw new HttpException(
          `Table No.${updateBillingDto?.from} bill is printed.`,
          400
        );
      }
      const tableAlreadyOccupied = await this.prisma.billing.findFirst({
        where: {
          tableId: toTable?.id,
          status: "UNSETTLED",
          isBillPrinted: false,
        },
      });
      if (!tableAlreadyOccupied) {
        throw new HttpException(
          `Person at table ${updateBillingDto?.to} has left the bar.`,
          400
        );
      }

      const kotInfo = await this.prisma.kot.findFirst({
        where: {
          billingId: billingFromShift?.id,
        },
      });
      const deletedData = [];
      if (kotInfo) {
        kotInfo.kotData = kotInfo.kotData.filter((kotItem) => {
          const isDeleted = updateBillingDto.kotData.some((updateItem) => {
            if (updateItem.productId === kotItem.productId) {
              deletedData.push(kotItem);
              return true;
            }
            return false;
          });

          return !isDeleted;
        });

        await this.prisma.kot.update({
          where: {
            id: kotInfo.id,
          },
          data: {
            kotData: kotInfo.kotData,
          },
        });
      }

      const kotToData = await this.prisma.kot.findFirst({
        where: {
          billingId: tableAlreadyOccupied?.id,
        },
      });

      if (kotToData) {
        const updatedKotData = [...kotToData.kotData, ...deletedData];

        await this.prisma.kot.update({
          where: {
            id: kotToData.id,
          },
          data: {
            kotData: updatedKotData,
          },
        });
      }
      const status = "Item shifted sucessfully";
      return { status };
    } catch (e) {
      const { message, status } = e;
      throw new HttpException(message, status);
    }
  }

  async shiftBillingTable(updateBillingDto) {
    try {
      const fromTable = await this.prisma.tables.findFirst({
        where: {
          code: String(updateBillingDto?.from),
        },
      });
      if (!fromTable) {
        throw new HttpException("No current table found", 400);
      }

      const toTable = await this.prisma.tables.findFirst({
        where: {
          code: String(updateBillingDto?.to),
        },
      });

      if (!toTable) {
        throw new HttpException("No table to shift found", 400);
      }

      const billingToShift: any = await this.prisma.billing.findFirst({
        where: {
          tableId: fromTable?.id,
          status: "UNSETTLED",
          isBillPrinted: false,
        },
      });
      if (!billingToShift) {
        throw new HttpException("Select other current table.", 400);
      }

      const tableAlreadyOccupied = await this.prisma.billing.findFirst({
        where: {
          tableId: toTable?.id,
          status: "UNSETTLED",
        },
      });
      if (tableAlreadyOccupied) {
        throw new HttpException(
          "Table already Occupied. Cannot shift billing table.",
          400
        );
      }

      const updatedBilling = await this.prisma.billing.update({
        where: {
          id: billingToShift?.id,
        },
        data: {
          tableId: toTable?.id,
        },
      });

      const kotInfo = await this.prisma.kot.findFirst({
        where: {
          billingId: billingToShift?.id,
        },
      });

      const updatedKot: any = await this.prisma.kot.update({
        where: {
          id: kotInfo?.id,
        },
        data: {
          tableId: toTable?.id,
        },
      });

      const Status = "Table shifted succesfully";

      return { Status };
    } catch (e) {
      const { message, status } = e;
      throw new HttpException(message, status);
    }
  }
}
