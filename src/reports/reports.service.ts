import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CommonObjectType } from "types";
import { formatDate } from "utils/common";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAllItems(filters: CommonObjectType) {
    try {
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        status: "SETTLED",
      };

      if (filters?.fromDate !== "") {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        stewardNo: filters?.stewardNo,
      };

      if (filters?.fromDate !== "") {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
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
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        status: "VOID",
      };

      if (filters?.fromDate !== "") {
        whereClause.lastVoidBillAt = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.lastVoidBillAt) {
          whereClause.lastVoidBillAt = {};
        }
        whereClause.lastVoidBillAt.lte = formattedToDate;
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
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        status: "SETTLED",
      };

      if (filters?.fromDate !== "") {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {};

      if (filters?.fromDate) {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate) {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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
        const { dayCloseDate, kotNo, kotData, ...rest } = item;
        const filteredKotData = kotData?.filter(
          (cancelKot) => cancelKot?.isCanceled === true
        );
        return filteredKotData?.length
          ? [{ dayCloseDate, kotNo, kotData: filteredKotData, ...rest }]
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
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);

      const whereClause: any = {
        isBillPrinted: true,
      };
      const findClause: any = {
        isBillPrinted: false,
        status: "SETTLED",
      };

      if (filters && filters.fromDate !== "") {
        whereClause.lastPrinted = {
          gte: formattedFromDate,
        };
        findClause.lastPrinted = {
          gte: formattedToDate,
        };
      }

      if (filters && filters.toDate !== "") {
        if (!whereClause.lastPrinted) {
          whereClause.lastPrinted = {};
          findClause.lastPrinted = {};
        }
        whereClause.lastPrinted.lte = formattedToDate;
        findClause.lastPrinted.lte = formattedToDate;
      }

      const billingData = await this.prisma.billing.findMany({
        where: whereClause,
        include: {
          table: true,
        },
      });

      const settledBillingData = await this.prisma.billing.findMany({
        where: findClause,
        include: {
          table: true,
        },
      });

      const mergedData = billingData.concat(settledBillingData);

      return mergedData;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getComplimentaryDataByDate(filters: CommonObjectType) {
    try {
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        status: "COMPLEMENTARY",
      };

      if (filters?.fromDate !== "") {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        status: "SETTLED",
      };

      if (filters?.fromDate !== "") {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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

  async getAllItemComplementary(filters: CommonObjectType) {
    try {
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        status: "COMPLEMENTARY",
      };

      if (filters?.fromDate !== "") {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
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

  async getAllItemSummaryComplementary(filters: CommonObjectType) {
    try {
      const formattedFromDate = formatDate(filters.fromDate);
      const formattedToDate = formatDate(filters.toDate);
      const whereClause: any = {
        status: "COMPLEMENTARY",
      };

      if (filters?.fromDate !== "") {
        whereClause.dayCloseDate = {
          gte: formattedFromDate,
        };
      }

      if (filters?.toDate !== "") {
        if (!whereClause.dayCloseDate) {
          whereClause.dayCloseDate = {};
        }
        whereClause.dayCloseDate.lte = formattedToDate;
      }

      const response: any = await this.prisma.billing.findMany({
        where: whereClause,
        select: {
          products: true,
          table: true,
        },
      });

      // Passing only values that required/displaying on Frontend
      let result = [];
      response.map((item) => {
        item?.products?.map((prod) => {
          result.push({
            ...prod,
            table: item.table,
          });
        });
      });

      return result;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getAllOptions() {
    try {
      const category = await this.prisma.category.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      });
      const products = await this.prisma.products.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      });
      const subCategory = await this.prisma.subcategory.findMany({
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
        },
      });

      const response = {
        category,
        products,
        subCategory,
      };

      return response;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
