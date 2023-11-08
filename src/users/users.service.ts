import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "prisma/prisma.service";
import { EmailService } from "email/email.service";
import { User as UserDto } from "@prisma/client";
import { generateRandomNumber } from "utils/common";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async bulkCreate(bulkUsersList) {
    try {
      const existingUsers = await this.prisma.user.findMany({});
      const filteredUsersList = bulkUsersList.filter(
        (department) =>
          !existingUsers?.some(
            (existingDpt) => existingDpt.email === department?.email
          )
      );

      if (!filteredUsersList?.length) return;

      const updatedFilteredUsersList = filteredUsersList.map((userInfo) => ({
        ...userInfo,
        stewardNo: generateRandomNumber(4),
      }));

      const response: any = await this.prisma.user
        .createMany({ data: updatedFilteredUsersList })
        .then((res) => {
          console.debug("\n res \n", res);
          return res;
        })
        .catch((error) => {
          console.error("\n error \n", error);
          return error;
        });

      const insertedDocsCount = response?.count;

      if (!insertedDocsCount) return;

      const bulkUploadAdminReport = { failed: [], successful: bulkUsersList };

      return bulkUploadAdminReport;
    } catch (error) {
      console.debug(error, "\n error \n");
      return error;
    }
  }

  async handleBulkUpload(csvData: { [key: string]: string }[] = []) {
    // const departmentData = csvData?.map(
    //   (rowData: { [key: string]: string }) => ({
    //     name: rowData?.department,
    //     organizationId,
    //   }),
    // );

    // // create departments
    // await this.departmentService.bulkCreate(departmentData, organizationId);

    // const departmentResult = await this.departmentService.findAll(
    //   organizationId,
    // );

    // console.debug(JSON.stringify(departmentResult), '\n departmentResult \n');

    // const rolesData = [];

    // csvData?.forEach((rowData: { [key: string]: string }) => {
    //   const departmentInfo = departmentResult.find(
    //     (department) => department.name === rowData?.department,
    //   );

    //   if (!departmentInfo?.id) return;
    //   return rolesData.push({
    //     name: rowData?.role,
    //     departmentId: departmentInfo?.id,
    //     organizationId,
    //   });
    // });

    // console.debug(JSON.stringify(rolesData), '\n rolesData \n');

    // // create roles with departmentId
    // await this.rolesService.bulkCreate(rolesData, organizationId);

    // const rolesResult = await this.rolesService.findAll(organizationId);
    // console.debug(JSON.stringify(rolesResult), '\n rolesResult \n');

    // const userListToCreate = csvData.map((rowData) => {
    //   const { role, department, ...dataToInclude } = rowData;
    //   const roleData = rolesResult.find(
    //     (roleInfo) => roleInfo.name === rowData?.role,
    //   );
    //   return {
    //     ...dataToInclude,
    //     roleId: roleData?.id,
    //     departmentId: roleData?.departmentId,
    //     organizationId,
    //   };
    // });

    // console.debug(JSON.stringify(userListToCreate), '\n userListToCreate \n');

    // create user
    return this.bulkCreate(csvData);
  }

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
