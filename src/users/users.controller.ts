import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { UsersService } from "./users.service";

import { toJSON } from "../utils/common";
import { Taxes, User as UserDto } from "@prisma/client";
import { Public } from "Auth/auth.public";
import {
  UpdatePasswordDto,
  restaurantAuthenticateDto,
  updateRestaurant,
} from "./dto/user-restaurant.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly teamMemberService: UsersService) {}

  @Post("bulk-upload")
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor("users"))
  createBulkTeamMember(@UploadedFile() file: any) {
    const stringifyData = file?.buffer?.toString();
    const userListToCreate = toJSON(stringifyData);
    this.teamMemberService.handleBulkUpload(userListToCreate);
    return userListToCreate;
  }

  @Post()
  @ApiBearerAuth('access-token')
  create(@Body() createTeamMemberDto: UserDto) {
    return this.teamMemberService.create(createTeamMemberDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  findAll() {
    return this.teamMemberService.findAll();
  }

  @Get("/restaurant")
  @ApiBearerAuth('access-token')
  findAllRestaurant() {
    return this.teamMemberService.findAllRestaurant();
  }
  @Get("/steward")
  @ApiBearerAuth('access-token')
  getSteward() {
    return this.teamMemberService.getSteward();
  }

  @Get(":id")
  @ApiBearerAuth('access-token')
  findOne(@Param("id") id: string) {
    return this.teamMemberService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth('access-token')
  update(@Param("id") id: string, @Body() updateTeamMemberDto: any) {
    return this.teamMemberService.update(id, updateTeamMemberDto);
  }

  @Patch("delete/:id")
  @ApiBearerAuth('access-token')
  remove(@Param("id") id: string) {
    return this.teamMemberService.remove(id);
  }

  @Patch("delete/:id")
  @ApiBearerAuth('access-token')
  deleteItem(@Param("id") id: string) {
    return this.teamMemberService.deleteItem(id);
  }

  @Patch("restaurant/:id")
  @ApiBearerAuth('access-token')
  updateRestaurant(
    @Param("id") userId: string,
    @Body() updateRestaurantDto: updateRestaurant
  ) {
    return this.teamMemberService.updateRestaurant(userId, updateRestaurantDto);
  }

  @Patch("restaurant/updatePassword/:id")
  @ApiBearerAuth('access-token')
  updatePassword(
    @Param("id") userId: string,
    @Body() updateRestaurantDto: UpdatePasswordDto
  ) {
    return this.teamMemberService.updateRestaurantPassword(
      userId,
      updateRestaurantDto
    );
  }

  @Public()
  @Post("/user")
  @ApiBearerAuth('access-token')
  createUser(@Body() createItemDto: UserDto) {
    return this.teamMemberService.createUser(createItemDto);
  }

  @Post("/restaurant/validate")
  @ApiBearerAuth('access-token')
  authenticate(@Body() restaurantAuthenticateDto: restaurantAuthenticateDto) {
    return this.teamMemberService.authenticate(restaurantAuthenticateDto);
  }

  // @Post("/restaurant")
  // createRestaurant(@Body() createRestaurantDto: restaurantAuthenticateDto) {
  //   return this.teamMemberService.createRestaurant(createRestaurantDto);
  // }

  // Tax
  @Post("restaurant/tax")
  @ApiBearerAuth('access-token')
  createTax(@Body() createItemDto: Taxes) {
    return this.teamMemberService.createTax(createItemDto);
  }

  @Post("restaurant/tax/:id")
  @ApiBearerAuth('access-token')
  getAllTaxList(@Param("id") userId: string) {
    return this.teamMemberService.getAllTaxList(userId);
  }

  @Delete("restaurant/delete/:id")
  @ApiBearerAuth('access-token')
  removeRestaurant(@Param("id") id: string) {
    return this.teamMemberService.removeRestaurant(id);
  }
  @Delete("remove/:id")
  @ApiBearerAuth('access-token')
  removeSteward(@Param("id") id: string) {
    return this.teamMemberService.removeSteward(id);
  }
}
