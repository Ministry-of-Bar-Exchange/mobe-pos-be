import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CommonObjectType } from "types";
import { CreateHostDto } from "./dto/create-host.dto";
import { UpdateHostDto } from "./dto/update-host.dto";

@Injectable()
export class HostService {
  constructor(private prisma: PrismaService) {}

  async create(createHostDto: CreateHostDto) {
    try {
      const createdHost = await this.prisma.host.create({
        data: createHostDto,
      });

      return createdHost;
    } catch (error) {
      throw new Error(`Failed to create Host: ${error.message}`);
    }
  }

  async findAll(filters: CommonObjectType) {
    try {
      const hosts = await this.prisma.host.findMany({
        where: filters,
      });

      return hosts;
    } catch (error) {
      throw new Error(`Failed to fetch Hosts: ${error.message}`);
    }
  }

  findOne(phone: string) {
    return this.prisma.host.findUnique({
      where: {
        phone,
      },
    });
  }

  async update(id: string, updateHostDto: UpdateHostDto) {
    const updatedHost = await this.prisma.host.update({
      where: {
        id,
      },
      data: updateHostDto,
    });
    return updatedHost;
  }
}
