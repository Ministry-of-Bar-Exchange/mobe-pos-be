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
    const { toCreate, toHide, toUnhide, defaultTable } = createMultipleTableDto;
    const presentTables = await this.prisma.tables.findMany({});

    await Promise.all([
      (toCreate || defaultTable) && this.createTables(toCreate, toHide, presentTables, defaultTable),
      toHide && this.hideTables(toHide, presentTables),
      toUnhide && this.unhideTables(toUnhide, presentTables),
    ]);

    return { success: true };
  }
  
  async createTables(toCreate, toHide, presentTables, defaultTable) {
    const defaultArray = new Array(defaultTable).fill(null);
    let tablesListToCreate;
  
    if (toCreate?.length) {
      tablesListToCreate = toCreate
        .filter((info) => !toHide.includes(info) && !presentTables.some((table) => table.code === info))
        .map((info) => ({
          code: info,
        }));
    }
    if (defaultTable) {
      tablesListToCreate = defaultArray.map((_, index) => ({
        code: `${index + 1}`,
      }));
    }
  
    if (tablesListToCreate?.length) {
      await this.prisma.tables.createMany({
        data: tablesListToCreate,
      });
    }
  }
  
  async hideTables(toHide, presentTables) {
    const dataToHideUpdate = toHide
      .filter((info) => presentTables.some((table) => table.code === info))
      .map(async (infoToHide) => {
        const foundTable = presentTables.find((table) => table.code === infoToHide);
  
        return this.prisma.tables.update({
          where: {
            id: foundTable.id,
          },
          data: { isDeleted: true },
        });
      });
  
    if (dataToHideUpdate?.length) {
      await Promise.all(dataToHideUpdate);
    }
  }
  
  async unhideTables(toUnhide, presentTables) {
    const dataToUnhideUpdate = toUnhide
      .filter((info) => presentTables.some((table) => table.code === info))
      .map(async (infoToUnhide) => {
        const foundTable = presentTables.find((table) => table.code === infoToUnhide);
  
        return this.prisma.tables.update({
          where: {
            id: foundTable.id,
          },
          data: { isDeleted: false },
        });
      });
  
    if (dataToUnhideUpdate?.length) {
      await Promise.all(dataToUnhideUpdate);
    }
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
