import { Injectable } from "@nestjs/common";
import { Kot, KotItem } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import { ProductsService } from "products/products.service";
import { CancelKotItemPayloadType } from "types";
import { generateRandomNumber } from "utils/common";
import { printBilReceipt } from "utils/printer";

@Injectable()
export class KotService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductsService
  ) {}
  async createKot(itemData: Kot) {
    try {
      const steward = await this.findOneByStewardNo(itemData.stewardNo);
      let billingProcessed = false;

      if (steward) {
        itemData.kotNo = generateRandomNumber(8);

        const response = await this.prisma.kot.create({
          data: itemData,
          include: {
            table: true,
            billing: true,
            // billing:true
          },
        });
        if (response.billing) {
          const billingId = response.billing.id;
          await this.prisma.billing.update({
            where: { id: billingId },
            data: { lastVoidBillAt: new Date() },
          });
        }

        if (response.billing && !billingProcessed) {
          const tableId = response.table.id;
          await this.prisma.tables.update({
            where: { id: tableId },
            data: { status: "OCCUPIED" },
          });
          billingProcessed = true;
        }

        // if (response.billing) {
        //   const billingId = response.billing.id;
        //   await this.prisma.billing.update({
        //     where: { id: billingId },
        //     data: { lastVoidBillAt: new Date() },
        //   });
        // }

        const list = await this.addProductsDataInKotInfo([response]);
        response.kotData = list;

        const { isKitchenPrinterSuccess, isBarPrinterSuccess } =
          await printBilReceipt(response, steward, "kot");
        return { ...response, isKitchenPrinterSuccess, isBarPrinterSuccess };
      } else {
        let response = {
          message: "Incorrect steward number!",
          error: true,
        };
        return { ...response };
      }
    } catch (error) {
      console.debug(error, "\n cannot create Kot \n");
      return error;
    }
  }

  async getAllItems() {
    try {
      const kot = await this.prisma.kot.findMany({
        where: {
          isDeleted: {
            equals: false,
          },
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
      console.debug(err, "Cannot get all kot");
    }
  }

  async getAllKots() {
    try {
      const kotsWithTables = await this.prisma.kot.findMany({
        include: {
          table: true,
          billing: true,
        },
      });

      const unsettledKots = kotsWithTables.filter((kot) => {
        return kot.billing?.status !== "SETTLED";
      });

      for (const kot of unsettledKots) {
        if (kot.kotData && kot.kotData.length > 0) {
          const populatedKotData = await Promise.all(
            kot.kotData.map(async (kotItem) => {
              const product = await this.prisma.products.findUnique({
                where: {
                  id: kotItem.productId,
                },
              });

              if (product) {
                return {
                  ...kotItem,
                  product: product,
                };
              } else {
                return kotItem;
              }
            })
          );
          kot.kotData = populatedKotData;
        }
      }

      return unsettledKots;
    } catch (err) {
      console.debug(err, "Cannot get all kot with tables");
    }
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
      console.debug(err, "Cannot get all kot");
    }
  }

  async read(id: string) {
    try {
      const response = await this.prisma.kot.findUnique({
        where: {
          id,
        },
        include: {
          billing: true,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not find kot");
    }
  }

  async readByTableCode(code: string) {
    try {
      const response = await this.prisma.kot.findMany({
        include: {
          table: true,
        },
        where: {
          table: {
            code,
          },
        },
      });

      const structuredResponse = response?.map(async (kotData) => {
        const list = await this.addProductsDataInKotWithDuplicateRecords([
          kotData,
        ]);
        const filteredKotList = list.filter((kotItem) => {
          return !kotItem.isCanceled;
        });
        return { ...kotData, kotData: filteredKotList };
      });

      return (await Promise.allSettled(structuredResponse)).map(
        (info: any) => info?.value
      );
    } catch (err) {
      console.debug(err, "Could not find kot");
    }
  }

  async findOneItem(itemId: string) {
    try {
      const response = await this.prisma.kot.findMany({
        where: {
          id: itemId,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Cannot find item");
    }
  }

  async getProductListFromKotId(kotId: string) {
    const KotData = await this.read(kotId);
    const list = await this.addProductsDataInKotInfo([KotData]);
    return list;
  }

  async getProductListFromBillingId(billingId: string) {
    const KotDataForBill = await this.getKotForBillingId(billingId);
    const list = await this.addProductsDataInKotWithDuplicateRecords(
      KotDataForBill
    );
    return list;
  }

  async findOneByStewardNo(stewardNo: string) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        stewardNo,
      },
    });
    return foundUser;
  }

  async addProductsDataInKotInfo(KotListForBillId: Kot[]) {
    let productsOrdered = [];

    KotListForBillId?.forEach((kot) => {
      const hasKotProductsLength = kot.kotData?.length;
      if (hasKotProductsLength) {
        productsOrdered = [...productsOrdered, ...kot?.kotData];
      }
    });

    let filteredProductsOrdered = [];
    productsOrdered.forEach((orderItem) => {
      const alreadyPresent = filteredProductsOrdered?.findIndex(
        (productOrdered) => productOrdered.productId === orderItem.productId
      );

      if (alreadyPresent > -1) {
        filteredProductsOrdered.splice(alreadyPresent, 1, {
          ...filteredProductsOrdered[alreadyPresent],
          quantity:
            orderItem?.quantity +
            filteredProductsOrdered[alreadyPresent]?.quantity,
        });
      } else {
        filteredProductsOrdered.push(orderItem);
      }
    });

    const productsIds = filteredProductsOrdered?.map(
      (product) => product.productId
    );

    const products = await this.productService.getProductsFromIdsArray(
      productsIds
    );

    const list = filteredProductsOrdered?.map((info) => {
      const productData = products?.find(
        (product) => product.id === info.productId
      );

      const amount = Number(info?.quantity) * Number(productData?.price);

      return {
        ...info,
        product: productData,
        amount,
      };
    });

    return list;
  }

  async addProductsDataInKotWithDuplicateRecords(KotListForBillId: Kot[]) {
    let productsOrdered = [];

    KotListForBillId?.forEach((kot) => {
      const hasKotProductsLength = kot.kotData?.length;
      if (hasKotProductsLength) {
        productsOrdered = [...productsOrdered, ...kot?.kotData];
      }
    });

    let filteredProductsOrdered = [];
    productsOrdered.forEach((orderItem) => {
      filteredProductsOrdered.push(orderItem);
    });

    const productsIds = filteredProductsOrdered?.map(
      (product) => product.productId
    );

    const products = await this.productService.getProductsFromIdsArray(
      productsIds
    );

    const list = filteredProductsOrdered?.map((info) => {
      const productData = products?.find(
        (product) => product.id === info.productId
      );

      const amount = Number(info?.quantity) * Number(productData?.price);

      return {
        ...info,
        product: productData,
        amount,
      };
    });

    return list;
  }

  async updateItem(itemId: string, KotDto: Partial<Kot>) {
    try {
      const response = await this.prisma.kot.update({
        where: {
          id: itemId,
        },
        data: KotDto,
      });
      return response;
    } catch (err) {
      console.debug("Failed to update item", err);
    }
  }

  async updateKotItem(updateKotItemPayload: Partial<CancelKotItemPayloadType>) {
    try {
      const hasPayloadToUpdate = !updateKotItemPayload?.kotData?.length;
      if (hasPayloadToUpdate) return;

      const commonId = updateKotItemPayload.kotData[0]?.id;

      if (!commonId) {
        console.error("Common id not found in the payload.");
        return;
      }

      const foundKot = await this.prisma.kot.findFirst({
        where: {
          id: commonId,
        },
      });

      const kotData = foundKot?.kotData;

      updateKotItemPayload.kotData.forEach((item) => {
        const kotDataIndex = kotData.findIndex(
          (kotInfo) => kotInfo.productId === item.productId
        );

        if (kotDataIndex !== -1) {
          kotData[kotDataIndex].isCanceled = true;
          kotData[kotDataIndex].canceledBy = updateKotItemPayload?.canceledBy;
          kotData[kotDataIndex].canceledReason =
            updateKotItemPayload?.canceledReason;
        }
      });

      return this.prisma.kot.update({
        where: {
          id: foundKot.id,
        },
        data: {
          kotData,
        },
      });
    } catch (err) {
      console.error("Failed to update item", err);
    }
  }

  async deleteItem(itemId: string) {
    try {
      const response = await this.prisma.kot.update({
        where: {
          id: itemId,
        },
        data: {
          isDeleted: true,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Delete item failed");
    }
  }

  async deleteAll() {
    const response = await this.prisma.kot.deleteMany();
    return response;
  }

  async readKotDataByTableCode(code: string) {
    try {
      const response = await this.prisma.kot.findMany({
        include: {
          table: true,
        },
        where: {
          table: {
            code,
          },
          billing: {
            status: "UNSETTLED",
            isBillPrinted: false,
          },
        },
      });

      const structuredResponse = response?.map(async (kotData) => {
        const list = await this.addProductsDataInKotWithDuplicateRecords([
          kotData,
        ]);
        const filteredKotList = list.filter((kotItem) => {
          return !kotItem.isCanceled;
        });
        return { ...kotData, kotData: filteredKotList };
      });

      return (await Promise.allSettled(structuredResponse)).map(
        (info: any) => info?.value
      );
    } catch (err) {
      console.debug(err, "Could not find kot");
    }
  }
}
