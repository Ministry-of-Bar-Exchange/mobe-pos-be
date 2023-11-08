import { Controller, Param, Post, Body } from "@nestjs/common";
import { restaurantAuthenticateService } from "./restaurant.service";
import { restaurantAuthenticateDto } from "./dto/restaurant-authenticate.dto";
import { Taxes } from "@prisma/client";

@Controller("/restaurantAuthenticate")
export class restaurantAuthenticateController {
  constructor(
    private readonly restaurantAuthenticate: restaurantAuthenticateService
  ) {}

  @Post("")
  authenticate(@Body() restaurantAuthenticateDto: restaurantAuthenticateDto) {
    return this.restaurantAuthenticate.authenticate(restaurantAuthenticateDto);
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
