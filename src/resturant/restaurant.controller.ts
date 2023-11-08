import { Controller, Param, Post, Body, Patch, Delete, Get } from "@nestjs/common";
import { restaurantAuthenticateService } from "./restaurant.service";
import { restaurantAuthenticateDto } from "./dto/restaurant.dto";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Restaurant as RestaurantDto  } from "@prisma/client";
import { UpdatePasswordDto } from "./dto/restaurant.dto";

import { Taxes } from "@prisma/client";

@Controller("/restaurant")
export class restaurantAuthenticateController {
  constructor(
    private readonly restaurantAuthenticate: restaurantAuthenticateService
  ) {}

  @Post("validate")
  authenticate(@Body() restaurantAuthenticateDto: restaurantAuthenticateDto) {
    return this.restaurantAuthenticate.authenticate(restaurantAuthenticateDto);
  }

  @Post()
  create(@Body() createRestaurntDto:RestaurantDto ) {
    return this.restaurantAuthenticate.create(createRestaurntDto);
  }

  @Get()
  findAll() {
    return this.restaurantAuthenticate.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.restaurantAuthenticate.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRestaurantDto: any) {
    return this.restaurantAuthenticate.update(id, updateRestaurantDto);
  }

  @Patch("updatePassword/:id")
  updatePassword(@Param("id") id: string, @Body() updateRestaurantDto: any) {
    return this.restaurantAuthenticate.updatePassword(id, updateRestaurantDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.restaurantAuthenticate.remove(id);
  }



  

  @Post("/tax")
  createTax(@Body() createItemDto: Taxes) {
    return this.restaurantAuthenticate.createTax(createItemDto);
  }

  @Post(":id")
  getAllTaxList(@Param("id") id : string) {
    return this.restaurantAuthenticate.getAllTaxList(id);
  }
}
