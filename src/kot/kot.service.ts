import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { KotDto } from "./dto/update-item.dto";
import { Kot } from "@prisma/client";

@Injectable()
export class KotService {
  constructor(private prisma: PrismaService) {}

  async createKot(itemData: Kot) {

    try {
      const response = await this.prisma.kot.create({
        data: itemData,
      });
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
      });
      return response;
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
