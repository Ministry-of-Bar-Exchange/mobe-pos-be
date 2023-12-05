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
}
