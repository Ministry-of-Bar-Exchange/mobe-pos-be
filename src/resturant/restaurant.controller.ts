import { Controller, Post, Body } from "@nestjs/common";
import { restaurantAuthenticateService } from "./restaurant.service";
import { restaurantAuthenticateDto } from "./dto/restaurant-authenticate.dto";

@Controller("/restaurantAuthenticate")
export class restaurantAuthenticateController {
  constructor(
    private readonly restaurantAuthenticate: restaurantAuthenticateService
  ) {}

  @Post("")
  authenticate(@Body() restaurantAuthenticateDto: restaurantAuthenticateDto) {
    return this.restaurantAuthenticate.authenticate(restaurantAuthenticateDto);
  }
}
