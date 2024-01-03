import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { restaurantAuthenticateDto } from "./dto/restaurant.dto";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Restaurant as RestaurantDto } from "@prisma/client";
// import { User as UserDto } from "@prisma/client";.
import { UpdatePasswordDto } from "./dto/restaurant.dto";

@Injectable()
export class restaurantAuthenticateService {
  constructor(private prisma: PrismaService) {}

  // async authenticate(restaurantAuthenticateDto: restaurantAuthenticateDto) {
  //   try {
  //     if (restaurantAuthenticateDto) {
  //       const particularUser = await this.prisma.restaurant.findFirst({
  //         where: {
  //           id: restaurantAuthenticateDto?.restaurantId,
  //         },
  //       });
  //       const matchPassword = await bcrypt.compare(
  //         restaurantAuthenticateDto?.discountPassword,
  //         particularUser?.discountPassword
  //       );
  //       const response = {
  //         isAuthenticate: matchPassword,
  //       };

  //       return response;
  //     }
  //   } catch (err) {
  //     return err;
  //   }
  // }

  // create(createRestaurantDto: RestaurantDto) {
  //   return this.prisma.restaurant.create({ data: createRestaurantDto });
  // }

  // async findAll() {
  //   const allRestaurant = await this.prisma.restaurant.findMany({
  //     where: {
  //       isDeleted: false,
  //     },
  //   });
  //   return allRestaurant;
  // }

  // async findOne(RestaurantId: string) {
  //   const foundRestaurant = await this.prisma.restaurant.findUnique({
  //     where: {
  //       id: RestaurantId,
  //     },
  //   });
  //   return foundRestaurant;
  // }

  // async update(
  //   RestaurantId: string,
  //   updateRestaurantDto: Partial<RestaurantDto>
  // ) {
  //   console.log(RestaurantId, "resid");
  //   console.log(updateRestaurantDto, "upddDTo");
  //   try {
  //     const updatedRestaurant = await this.prisma.restaurant.update({
  //       where: {
  //         id: RestaurantId,
  //       },
  //       data: updateRestaurantDto,
  //     });
  //     console.log({ updateRestaurantDto });
  //     return updatedRestaurant;
  //   } catch (error) {
  //     console.debug(error, "\n cannot update restaurant \n");
  //     return error;
  //   }
  // }

  // async updatePassword(
  //   restaurantId: string,
  //   updatePasswordDto: Partial<UpdatePasswordDto>
  // ) {
  //   console.log(updatePasswordDto, "updated");
  //   try {
  //     const oldPassword = await updatePasswordDto?.currentPassword;
  //     const newPassword= await updatePasswordDto?.newPassword
  //     const dbPassword = await this.findId(restaurantId);
  //     const hash = await bcrypt.hash(newPassword || "", 10);
  //     if (!dbPassword) {
  //       throw new UnauthorizedException("wrong password");
  //     }
  //     console.log(newPassword,"databasepass")
  //     const matchPassword = await bcrypt.compare(oldPassword, dbPassword as string);
  //     if (matchPassword) {
  //       const updatedRestaurant = await this.prisma.restaurant.update({
  //         where: {
  //           id: restaurantId,
  //         },
  //         data: { discountPassword: hash },
  //       });
  //       return updatedRestaurant;
  //     } else {
  //       return "password doesn't match";
  //     }
  //   } catch (error) {
  //     console.debug(error, "\n cannot update restaurant \n");
  //     return error;
  //   }
  // }

  
  // async remove(RestaurantId: string) {
  //   const deleteRestaurant = await this.prisma.restaurant.delete({
  //     where: {
  //       id: RestaurantId,
  //     },
  //   });
  //   return deleteRestaurant;
  // }

  // private async findId(id: string): Promise<String> {
  //   let restaurantid;
  //   try {
  //     restaurantid = await this.prisma.restaurant.findUnique({
  //       where: {
  //         id: id,
  //       },
  //     });
  //     if (!restaurantid) {
  //       throw new NotFoundException("Could not find User");
  //     }
  //     console.log(restaurantid.discountPassword, "db passs");
  //     return restaurantid.discountPassword as string;
  //   } catch (error) {
  //     throw new NotFoundException("Could not find User");
  //   }
  // }

  // async getAllTaxList(id) {
  //   try {
  //     const response = await this.prisma.restaurant.findFirst({
  //       where: {
  //         id
  //       }
  //     });
  //     return response;
  //   } catch (err) {
  //     console.debug(err, "Cannot get all taxs");
  //   }
  // }

  // async createTax(taxData: any) {
  //   const { restaurantId } = taxData;
  //   delete taxData.restaurantId;
  //   try {
  //     const restaurant = await this.prisma.restaurant.findFirst({
  //       where: { 
  //         id: restaurantId 
  //       },
  //     });
  
  //     const response = await this.prisma.restaurant.update({
  //       where: { id: restaurantId },
  //       data: {
  //         taxes: [...restaurant.taxes, taxData],
  //       },
  //     });
  //     return response;
  //   } catch (err) {
  //     console.debug(err, "Cannot create new tax");
  //   }
  // }
    
}
