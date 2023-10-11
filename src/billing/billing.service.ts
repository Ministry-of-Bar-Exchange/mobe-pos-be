import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Billing } from "@prisma/client";
import { KotService } from "kot/kot.service";
import { ProductsService } from "products/products.service";

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private kotService: KotService,
    private productService: ProductsService
  ) {}

  create(createBillingDto: Billing) {
    return this.prisma.billing.create({ data: createBillingDto });
  }

  findAll() {
    return this.prisma.billing.findMany({
      include: {
        kotList: true,
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

  async handlePrintBill(id: string, updateBillingDto: Partial<Billing>) {
    const KotDataForBill = await this.kotService.getKotForBillingId(id);

    let productsOrdered = [];

    KotDataForBill.forEach((kot) => {
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

    await this.prisma.billing.update({
      where: {
        id,
      },
      data: { ...updateBillingDto, products: list },
    });

    return list;
  }
}
