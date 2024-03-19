import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Billing } from "@prisma/client";
import { KotService } from "kot/kot.service";
import { printBilReceipt } from "utils/printer";
import { CommonObjectType } from "types";

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService, private kotService: KotService) {}

  async create(createBillingDto: any) {
    try {
      if (!createBillingDto?.stewardNo) {
        return {
          message: "Please enter steward number",
          code: 200,
          success: false,
        };
      }
      const steward = await this.findOneByStewardNo(
        createBillingDto?.stewardNo
      );

      if (!steward) {
        return {
          message: "Please enter correct steward number",
          code: 200,
          success: false,
        };
      }

      const LastBillingData = await this.prisma.billing.findFirst({
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!LastBillingData?.billNo) {
        createBillingDto.billNo = "1";
      } else {
        createBillingDto.billNo = `${Number(LastBillingData.billNo) + 1}`;
      }
      const user = await this.prisma.user.findFirst({
        where: { id: createBillingDto?.userId },
      });
      const restuarant = await this.prisma.restaurant.findFirst({
        where: { id: user?.restaurantId },
      });
      const { userId, ...newPayload } = createBillingDto;
      newPayload.dayCloseDate = restuarant?.dayClosingDate;
      return this.prisma.billing.create({
        data: newPayload,
      });
    } catch (e) {
      if (e.message === "Please enter correct steward no") {
        throw new Error("Please enter correct steward no");
      }
    }
  }

  async findOneByStewardNo(stewardNo: string) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        stewardNo,
      },
    });

    return foundUser;
  }

  async getKotForBillingId(billingId: string) {
    try {
      const kot = await this.prisma.kot.findMany({
        where: {
          isDeleted: {
            equals: false,
          },
          billingId,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          billing: true,
        },
      });

      return kot;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
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

  async rePrintBilling(rePrintBilling) {
    let billData = [];
    for (let i = 0; i < rePrintBilling.length; i++) {
      const billingData = await this.prisma.billing.findFirst({
        where: {
          id: rePrintBilling[i],
        },
      });
      billData?.push(billingData);
    }

    for (let j = 0; j < billData?.length; j++) {
      const { isBillPrinterSuccess: isPrinted } = await printBilReceipt(
        billData[j],
        null,
        "bill"
      );
    }
    return billData;
  }

  async findSale(filters: CommonObjectType) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    const billingData = await this.prisma.billing.findMany({
      where: {
        dayCloseDate: formattedDate,
        status: "SETTLED",
      },
    });

    let cashSale = 0;
    let cardSale = 0;

    billingData?.forEach((item: any) => {
      cashSale += item?.payment?.cashAmount || 0;
      cardSale += item?.payment?.cards[0]?.amount || 0;
    });

    const unsettledPrintedData = await this.prisma.billing.findMany({
      where: {
        dayCloseDate: formattedDate,
        isBillPrinted: true,
      },
    });
    const settledData = await this.prisma.billing.findMany({
      where: {
        dayCloseDate: formattedDate,
        status: "SETTLED",
      },
    });
    let todaySale = 0;
    unsettledPrintedData?.forEach((item: any) => {
      todaySale += Number(item?.netAmount) || 0;
    });
    settledData?.forEach((item: any) => {
      todaySale += Number(item?.netAmount) || 0;
    });

    const kotBillData = await this.prisma.billing.findMany({
      where: {
        dayCloseDate: formattedDate,
        status: "UNSETTLED",
        isBillPrinted: false,
      },
      include: {
        kotList: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    const kotDetails = [];
    kotBillData?.forEach((billingItem: any) => {
      const billingId = billingItem.id;
      const kotList = billingItem.kotList;

      kotList?.forEach((kotItem: any) => {
        kotDetails.push({
          kotData: kotItem?.kotData,
        });
      });
    });
    const flattenedKotDetails = kotDetails.flatMap((kot) =>
      kot.kotData.flatMap((item) => Array(item.quantity).fill(item.productId))
    );

    const uniqueProductIds = Array.from(new Set(flattenedKotDetails));

    const products = await this.prisma.products.findMany({
      where: {
        id: {
          in: uniqueProductIds,
        },
      },
    });

    const duplicatedProducts = kotDetails.flatMap((kot) =>
      kot.kotData.flatMap((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          return [];
        }
        return Array(item.quantity).fill(product);
      })
    );
    let unbilled = 0;
    duplicatedProducts?.map((item: any) => {
      unbilled += Number(item?.price);
    });
    const saleData = todaySale + unbilled;
    return {
      cashSale,
      cardSale,
      todaySale: saleData,
      unbilled,
    };
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
      include: {
        table: true,
      },
      where: {
        id,
      },

      data: { ...updateBillingDto, isBillPrinted: false },
    });
    if (updatedBilling.table) {
      const tableId = updatedBilling.table.id;
      const host = await this.prisma.tables.update({
        where: { id: tableId },
        data: { status: "AVAILABLE" },
      });
    }
    const hostData = await this.prisma.host.findFirst({
      where: {
        tableCode: updatedBilling?.table?.code,
        status: false,
      },
    });
    if (hostData) {
      await this.prisma.host.update({
        where: { id: hostData?.id },
        data: { status: true },
      });
    }

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

      const updateHost = await this.prisma.host.update({
        where: {
          id: updatedKot?.customerId,
        },
        data: {
          status: true,
        },
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

      const kotInfo = await this.prisma.kot.findMany({
        where: {
          billingId: billingFromShift?.id,
        },
      });

      const deletedData = [];

      if (kotInfo.length > 0) {
        for (const kot of kotInfo) {
          kot.kotData = kot.kotData.filter((kotItem) => {
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
              id: kot.id,
            },
            data: {
              kotData: kot.kotData,
            },
          });
        }
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
      const hostToUpdate = await this.prisma.host.findFirst({
        where: {
          tableCode: updateBillingDto?.from,
          status: false,
        },
      });
      if (hostToUpdate) {
        await this.prisma.host.update({
          where: { id: hostToUpdate?.id },
          data: { tableCode: updateBillingDto?.to },
        });
      }
      if (fromTable) {
        await this.prisma.tables.update({
          where: { id: fromTable?.id },
          data: { status: "AVAILABLE" },
        });
      }
      if (toTable) {
        await this.prisma.tables.update({
          where: { id: toTable?.id },
          data: { status: "OCCUPIED" },
        });
      }

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
