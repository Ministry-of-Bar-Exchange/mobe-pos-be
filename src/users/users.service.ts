import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "prisma/prisma.service";
import { User as UserDto } from "@prisma/client";
import { generateRandomNumber } from "utils/common";
import { Restaurant as RestaurantDto } from "@prisma/client";
import {
  UpdatePasswordDto,
  restaurantAuthenticateDto,
} from "./dto/user-restaurant.dto";

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

  /**
   * Restaurant Services
   */

  async authenticate(restaurantAuthenticateDto: restaurantAuthenticateDto) {
    try {
      if (restaurantAuthenticateDto) {
        const particularUser = await this.prisma.user.findFirst({
          where: {
            id: restaurantAuthenticateDto?.userId,
          },
        });
        const matchPassword = await bcrypt.compare(
          restaurantAuthenticateDto?.discountPassword,
          particularUser?.restaurant.discountPassword
        );
        const response = {
          isAuthenticate: matchPassword,
        };

        return response;
      }
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  private async findUserRestaurant(id: string): Promise<RestaurantDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException("Could not find User");
      }
      return user.restaurant as RestaurantDto;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async createRestaurant(createRestaurantDto: restaurantAuthenticateDto) {
    let userId = createRestaurantDto.userId;
    delete createRestaurantDto.userId;

    const hash = await bcrypt.hash(
      createRestaurantDto?.discountPassword || "",
      10
    );
    createRestaurantDto.discountPassword = hash;
    try {
      const response = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          restaurant: createRestaurantDto,
        },
      });
      return response;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async findAllRestaurant() {
    try {
      const allRestaurant = await this.prisma.user.findMany({});
      return allRestaurant;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async updateRestaurant(userId: string, restaurantData: any) {
    try {
      const selectedUser = await this.findUserRestaurant(userId);

      const updatedRestaurant = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          restaurant: { ...selectedUser, ...restaurantData },
        },
      });

      return updatedRestaurant;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async updateRestaurantPassword(
    userId: string,
    updatePasswordDto: Partial<UpdatePasswordDto>
  ) {
    try {
      const oldPassword = await updatePasswordDto?.currentPassword;
      const newPassword = await updatePasswordDto?.newPassword;
      const selectedUser = await this.findUserRestaurant(userId);
      const hash = await bcrypt.hash(newPassword || "", 10);

      if (!selectedUser?.discountPassword) {
        throw new UnauthorizedException("wrong password");
      }
      const matchPassword = await bcrypt.compare(
        oldPassword,
        selectedUser?.discountPassword as string
      );

      if (matchPassword) {
        const updatedRestaurant = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            restaurant: {
              ...selectedUser,
              discountPassword: hash,
            },
          },
        });
        return updatedRestaurant;
      } else {
        return "password doesn't match";
      }
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async removeRestaurant(userId: string) {
    try {
      let response = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          restaurant: null,
        },
      });
      return response;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async getAllTaxList(userId) {
    try {
      const response = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      return response?.restaurant.taxes;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }

  async createTax(taxData: any) {
    const { userId } = taxData;
    delete taxData.userId;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      const response = await this.prisma.user.update({
        where: { id: userId },
        data: {
          restaurant: {
            ...user.restaurant,
            taxes: [...user.restaurant.taxes, taxData],
          },
        },
      });
      return response;
    } catch (error) {
      const { message, status } = error;
      throw new HttpException(message, status);
    }
  }
}
