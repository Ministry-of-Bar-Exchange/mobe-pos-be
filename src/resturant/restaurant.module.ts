import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { restaurantAuthenticateService } from "./restaurant.service";
import { restaurantAuthenticateController } from "./restaurant.controller";

@Module({
  imports: [PrismaModule],
  controllers: [restaurantAuthenticateController],
  providers: [restaurantAuthenticateService],
  exports: [restaurantAuthenticateService],
})
export class RestaurantModule {}
