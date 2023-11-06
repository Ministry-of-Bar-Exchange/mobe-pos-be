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
    const allUsers = await this.prisma.user.findMany({
      where: {
        isDeleted : false
      }
    });
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
    try {
      const hash = await bcrypt.hash(updateUserDto?.password || "", 10);
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: { ...updateUserDto, password: hash },
      });
      return updatedUser;
    } catch(error) {
      console.debug(error, "\n cannot update user \n");
      return error;
    }
    
  }

  async remove(userId: string) {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deletedUser;
  }
  async createUser(itemData: any) {
    try {
      const hash = await bcrypt.hash(itemData?.password || "", 10);
      itemData.password = hash;
      itemData.stewardNo = generateRandomNumber(4);
      const createdUser = await this.prisma.user.create({
        data: itemData,
      });

      return createdUser;
    } catch (error) {
      console.debug(error, "\n cannot create user \n");
      return error;
    }
  }

  async deleteItem(userId: string) {
    try {
      const response = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data : {
          isDeleted : true
        }
      });
      return response;
    } catch (err) {
      console.debug(err, "Delete item failed");
    }
  }
}
