import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CommonObjectType } from "types";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAllItems(filters: CommonObjectType) {
    try {
      const whereClause: any = {
        status: "SETTLED",
      };

      if (filters?.fromDate !== "") {
        whereClause.createdAt = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.createdAt) {
          whereClause.createdAt = {};
        }
        whereClause.createdAt.lte = filters?.toDate;
      }

      const response = await this.prisma.billing.findMany({
        where: whereClause,
        include: {
          table: true,
        },
      });

      return response;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getAllSaleBySteward(filters: CommonObjectType) {
    try {
      const whereClause: any = {
        stewardNo: filters?.stewardNo,
      };

      if (filters?.fromDate !== "") {
        whereClause.createdAt = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.createdAt) {
          whereClause.createdAt = {};
        }
        whereClause.createdAt.lte = filters?.toDate;
      }

      const kotData = await this.prisma.kot.findMany({
        where: whereClause,
      });

      const billingIds = kotData.map((item) => item.billingId);
      const billingData = await Promise.all(
        billingIds.map(async (billingId) =>
          this.prisma.billing.findMany({
            where: {
              id: billingId,
              status: "SETTLED",
            },
          })
        )
      );

      const flattenedBillingData = billingData.flat();
      return flattenedBillingData;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getAllSaleByTable(filters: CommonObjectType) {
    try {
      const table = await this.prisma.tables.findFirst({
        where: {
          code: filters?.code,
        },
      });

      const whereClause: any = {
        status: "SETTLED",
      };

      if (table.id) {
        whereClause.tableId = table.id;
      }

      if (filters?.fromDate !== "") {
        whereClause.createdAt = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.createdAt) {
          whereClause.createdAt = {};
        }
        whereClause.createdAt.lte = filters?.toDate;
      }

      const response = await this.prisma.billing.findMany({
        where: whereClause,
      });

      return response;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getAllVoidReports(filters: CommonObjectType) {
    try {
      const whereClause: any = {
        status: "VOID",
      };

      if (filters?.fromDate !== "") {
        whereClause.lastVoidBillAt = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.lastVoidBillAt) {
          whereClause.lastVoidBillAt = {};
        }
        whereClause.lastVoidBillAt.lte = filters?.toDate;
      }

      const billingData = await this.prisma.billing.findMany({
        where: whereClause,
      });

      return billingData;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
  async getAllDiscountReports(filters: CommonObjectType) {
    try {
      const whereClause: any = {
        status: "SETTLED",
      };

      if (filters?.fromDate !== "") {
        whereClause.updatedAt = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.updatedAt) {
          whereClause.updatedAt = {};
        }
        whereClause.updatedAt.lte = filters?.toDate;
      }

      const billingData = await this.prisma.billing.findMany({
        where: whereClause,
      });

      return billingData;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getCancelKotAllItems(filters: CommonObjectType) {
    try {
      const whereClause: any = {};

      if (filters?.fromDate) {
        whereClause.createdAt = {
          gte: new Date(filters.fromDate),
        };
      }

      if (filters?.toDate) {
        if (!whereClause.createdAt) {
          whereClause.createdAt = {};
        }
        whereClause.createdAt.lte = new Date(filters.toDate);
      }

      if (filters?.kotNo) {
        whereClause.kotNo = filters.kotNo;
      }

      const response = await this.prisma.kot.findMany({
        where: {
          ...whereClause,
          kotData: {
            some: {
              isCanceled: true,
            },
          },
        },
        include: {
          table: true,
          billing: true,
        },
      });
      const unsettledKots = response.filter((kot) => {
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

      const data = unsettledKots?.flatMap((item) => {
        const { createdAt, kotNo, kotData, ...rest } = item;
        const filteredKotData = kotData?.filter(
          (cancelKot) => cancelKot?.isCanceled === true
        );
        return filteredKotData?.length
          ? [{ createdAt, kotNo, kotData: filteredKotData, ...rest }]
          : [];
      });

      return data;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

   async getReprintedByDate(filters: CommonObjectType) {
    try {
      const whereClause: any = {
        isBillPrinted: true,
      };

      if (filters?.fromDate !== "") {
        whereClause.lastPrinted = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.lastPrinted) {
          whereClause.lastPrinted = {};
        }
        whereClause.lastPrinted.lte = filters?.toDate;
      }

      const billingData = await this.prisma.billing.findMany({
        where: whereClause,
      });

      return billingData;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getComplimentaryDataByDate(filters: CommonObjectType) {
    try {
      const whereClause: any = {
        status: "COMPLEMENTARY",
      };

      if (filters?.fromDate !== "") {
        whereClause.createdAt = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.createdAt) {
          whereClause.createdAt = {};
        }
        whereClause.createdAt.lte = filters?.toDate;
      }

      const billingData = await this.prisma.billing.findMany({
        where: whereClause,
      });

      return billingData;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getAllItemSummary(filters: CommonObjectType) {
    try {
      const whereClause: any = {
        status: "SETTLED",
      };

      if (filters?.fromDate !== "") {
        whereClause.createdAt = {
          gte: filters.fromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.createdAt) {
          whereClause.createdAt = {};
        }
        whereClause.createdAt.lte = filters?.toDate;
      }

      const response = await this.prisma.billing.findMany({
        where: whereClause,
      });

      const itemSummary = response
        .map((billing: any) => {
          return billing?.products?.map((product) => {
            return {
              category: product.product.category.name,
              itemCode: product.product.code,
              itemName: product.product.name,
              quantity: product.quantity,
              amount: product.amount,
            };
          });
        })
        .flat();

      return itemSummary;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
