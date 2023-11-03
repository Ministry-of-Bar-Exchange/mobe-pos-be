import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "prisma/prisma.service";
import { EmailService } from "email/email.service";
import { User as UserDto } from "@prisma/client";
import { generateRandomNumber } from "utils/common";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  async create(createUserDto: UserDto) {
    const hash = await bcrypt.hash(createUserDto?.password || "", 10);
    createUserDto.password = hash;
    createUserDto.stewardNo = generateRandomNumber(4);
    const createdUser = await this.prisma.user.create({
      data: createUserDto,
    });

    return createdUser;
  }

  async findAll() {
    const allUsers = await this.prisma.user.findMany({});
    return allUsers;
  }

  async findOne(userId: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return foundUser;
  }

  async update(userId: string, updateUserDto: Partial<UserDto>) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
    });
    return updatedUser;
  }

  async remove(userId: string) {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deletedUser;
  }
}
