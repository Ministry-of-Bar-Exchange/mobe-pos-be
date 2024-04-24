import {
  Controller,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Get,
  NotFoundException,
} from "@nestjs/common";
import { restaurantAuthenticateService } from "./restaurant.service";
import { restaurantAuthenticateDto } from "./dto/restaurant.dto";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Restaurant as RestaurantDto } from "@prisma/client";
import { UpdatePasswordDto } from "./dto/restaurant.dto";

import { Taxes } from "@prisma/client";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("/restaurant")
export class restaurantAuthenticateController {
  constructor(
    private readonly restaurantAuthenticate: restaurantAuthenticateService
  ) {}

  // @Post("validate")
  // authenticate(@Body() restaurantAuthenticateDto: restaurantAuthenticateDto) {
  //   return this.restaurantAuthenticate.authenticate(restaurantAuthenticateDto);
  // }

  // @Post()
  // create(@Body() createRestaurntDto:RestaurantDto ) {
  //   return this.restaurantAuthenticate.create(createRestaurntDto);
  // }

  // @Get()
  // findAll() {
  //   return this.restaurantAuthenticate.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.restaurantAuthenticate.findOne(id);
  // }

  @Patch("/user/:id")
  @ApiBearerAuth('access-token')
  update(@Param("id") id: string, @Body() updateRestaurantDto: any) {
    return this.restaurantAuthenticate.update(id, updateRestaurantDto);
  }

  // @Patch("updatePassword/:id")
  // updatePassword(@Param("id") id: string, @Body() updateRestaurantDto: any) {
  //   return this.restaurantAuthenticate.updatePassword(id, updateRestaurantDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.restaurantAuthenticate.remove(id);
  // }

  // @Post("/tax")
  // createTax(@Body() createItemDto: Taxes) {
  //   return this.restaurantAuthenticate.createTax(createItemDto);
  // }

  // @Post(":id")
  // getAllTaxList(@Param("id") id : string) {
  //   return this.restaurantAuthenticate.getAllTaxList(id);
  // }

  // @Get(':id')
  // async getRestaurantById(@Param('id') id: string) {
  //   const restaurant = await this.getRestaurantById.findOne(id);
  //   if (!restaurant) {
  //     throw new NotFoundException('Restaurant not found');
  //   }
  //   return restaurant;
  // }

  @Get(":id")
  @ApiBearerAuth('access-token')
  async getRestaurantById(@Param("id") id: string) {
    const restaurant = await this.restaurantAuthenticate.getRestaurantById(id);
    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }
    return restaurant;
  }
}
