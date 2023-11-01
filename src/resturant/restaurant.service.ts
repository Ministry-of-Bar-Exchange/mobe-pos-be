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
}
