import { Injectable } from "@nestjs/common";
import { Tables } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  create(createTableDto: Tables) {
    return this.prisma.tables.create({ data: createTableDto });
  }

  findAll() {
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
