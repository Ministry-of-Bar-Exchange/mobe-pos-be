import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { restaurantAuthenticateDto } from "./dto/restaurant-authenticate.dto";

@Injectable()
export class restaurantAuthenticateService {
  constructor(private prisma: PrismaService) {}

  async authenticate(restaurantAuthenticateDto: restaurantAuthenticateDto) {
    try {
      if (restaurantAuthenticateDto) {
        const particularUser = await this.prisma.restaurant.findFirst({
          where: {
            id: restaurantAuthenticateDto?.restaurantId,
          },
        });
        const matchPassword = await bcrypt.compare(
          restaurantAuthenticateDto?.discountPassword,
          particularUser?.discountPassword
        );
        const response = {
          isAuthenticate: matchPassword,
        };

        return response;
      }
    } catch (err) {
      return err;
    }
  }

  async getAllTaxList(id) {
    try {
      const response = await this.prisma.restaurant.findFirst({
        where: {
          id
        }
      });
      return response;
    } catch (err) {
      console.debug(err, "Cannot get all taxs");
    }
  }

  async createTax(taxData: any) {
    const { restaurantId } = taxData;
    delete taxData.restaurantId;
    try {
      const restaurant = await this.prisma.restaurant.findFirst({
        where: { 
          id: restaurantId 
        },
      });
  
      const response = await this.prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          taxes: [...restaurant.taxes, taxData],
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Cannot create new tax");
    }
  }
    
}
