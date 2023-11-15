import { Injectable } from "@nestjs/common";
import { Tables } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateMultipleTableDto } from "./dto/create-table.dto";

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  create(createTableDto: Tables) {
    return this.prisma.tables.create({ data: createTableDto });
  }

  async createMultipleTables(createMultipleTableDto: CreateMultipleTableDto) {
    const { toCreate, toHide, toUnhide } = createMultipleTableDto;

    const presentTables = await this.prisma.tables.findMany({});

    const defaultArray = new Array(50).fill(null);

    const tablesListToCreate = toCreate?.length
      ? toCreate
          .filter((info) => !toHide.includes(info))
          .filter((info) => !presentTables.some((table) => table.code === info))
          .map((info) => ({
            code: info,
          }))
      : defaultArray.map((info, index) => ({
          code: `${index + 1}`,
        }));

    if (tablesListToCreate?.length) {
      await this.prisma.tables.createMany({
        data: tablesListToCreate,
      });
    }

    const dataToHideUpdate = toHide
      .filter((info) => presentTables.some((table) => table.code === info))
      .map(async (infoToHide) => {
        const foundTable = presentTables.find(
          (table) => table.code === infoToHide
        );

        if (!foundTable.code) return;

        return this.prisma.tables.update({
          where: {
            id: foundTable.id,
          },
          data: { isDeleted: true },
        });
      });

    if (dataToHideUpdate?.length) {
      (await Promise.allSettled(dataToHideUpdate)).map(
        (data: any) => data.value
      );
    }

    const dataToUnhideUpdate = toUnhide
      .filter((info) => presentTables.some((table) => table.code === info))
      .map(async (infoToHide) => {
        const foundTable = presentTables.find(
          (table) => table.code === infoToHide
        );

        if (!foundTable.code) return;

        return this.prisma.tables.update({
          where: {
            id: foundTable.id,
          },
          data: { isDeleted: false },
        });
      });

    if (dataToUnhideUpdate?.length) {
      (await Promise.allSettled(dataToUnhideUpdate)).map(
        (data: any) => data.value
      );
    }

    return { success: true };
  }

  async findAll() {
    return this.prisma.tables.findMany({});
  }

  findOne(id: string) {
    return this.prisma.tables.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateTableDto: Partial<Tables>) {
    const updatedTable = await this.prisma.tables.update({
      where: {
        id,
      },
      data: updateTableDto,
    });
    return updatedTable;
  }

  remove(id: string) {
    return this.prisma.tables.update({
      where: {
        id,
      },
      data: { isDeleted: true },
    });
  }
}
