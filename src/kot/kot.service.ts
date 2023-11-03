import { Injectable } from "@nestjs/common";
import { Kot, KotItem } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import { ProductsService } from "products/products.service";
import { CancelKotItemPayloadType } from "types";
import { generateRandomNumber } from "utils/common";
import { printBillReciept } from "utils/printer";

@Injectable()
export class KotService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductsService
  ) {}

  async createKot(itemData: Kot) {
    try {
      // const billingId = itemData?.billingId;

      // const kotList: Kot[] = await this.prisma.kot.findMany({
      //   where: {
      //     isDeleted: {
      //       equals: false,
      //     },
      //     billingId,
      //   },
      //   orderBy: {
      //     updatedAt: "desc",
      //   },
      // });

      // const kotPayload = [];

      // console.debug({ itemData })

      // itemData?.kotData.forEach((kotItem: KotItem) => {
      //   const productOrderedBefore = kotList.find(
      //     (kot: Kot) => kot.billingId === itemData.billingId
      //   );

      //   const existingKotItem = productOrderedBefore?.kotData.find(
      //     (kotInfo) => kotInfo?.productId === kotItem?.productId
      //   );

      //   if (existingKotItem?.productId) {
      //     const hasDifferentQuantity =
      //        kotItem?.quantity - existingKotItem?.quantity;
      //        console.debug({ hasDifferentQuantity })
      //     if (hasDifferentQuantity) {
      //       kotPayload.push({
      //         productId: existingKotItem?.productId,
      //         quantity: hasDifferentQuantity,
      //       });
      //     }
      //   }
      //   if (!existingKotItem?.productId) {
      //     kotPayload.push(kotItem);
      //   }
      // });

      // itemData.kotData = kotPayload
      itemData.kotNo = generateRandomNumber(8);

      const response = await this.prisma.kot.create({
        data: itemData,
      });
      const list = await this.addProductsDataInKotInfo([response]);
      response.kotData = list;
      await printBillReciept(response, "kot");
      return response;
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

      // ToDo -- need to test,
      // const filteredKotList = kot.map((kotInfo) => {
      //   kotInfo.kotData = kotInfo.kotData.filter(
      //     (kotItem) => !kotItem.isCanceled
      //   );
      //   return kotInfo;
      // });

      // return filteredKotList;
      return kot
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
        const list = await this.addProductsDataInKotInfo([kotData]);
        return { ...kotData, kotData: list };
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
    const list = await this.addProductsDataInKotInfo(KotDataForBill);
    return list;
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

      const requests = updateKotItemPayload?.kotData?.map(async (info) => {
        const { id, ...rest } = info;

        const foundKot = await this.prisma.kot.findFirst({
          where: {
            id,
          },
        });
        const kotData = foundKot?.kotData;

        const kotDataIndex = foundKot.kotData.findIndex(
          (kotInfo) => kotInfo.productId === rest.productId
        );

        const isQuantityReduced =
          info.quantity < foundKot?.kotData[kotDataIndex]?.quantity;

        if (isQuantityReduced) {
          kotData[kotDataIndex].quantity = info.quantity;
        } else {
          kotData[kotDataIndex].isCanceled = true;
          kotData[kotDataIndex].canceledBy = updateKotItemPayload?.canceledBy;
          kotData[kotDataIndex].canceledReason =
            updateKotItemPayload?.canceledReason;
        }

        return this.prisma.kot.update({
          where: {
            id: foundKot.id,
          },
          data: {
            kotData,
          },
        });
      });

      return (await Promise.allSettled(requests)).map(
        (data: any) => data?.value
      );
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
}
