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

@Controller("users")
export class UsersController {
  constructor(private readonly teamMemberService: UsersService) {}

  @Post("bulk-upload")
  @UseInterceptors(FileInterceptor("users"))
  createBulkTeamMember(@UploadedFile() file: any) {
    const stringifyData = file?.buffer?.toString();
    const userListToCreate = toJSON(stringifyData);
    this.teamMemberService.handleBulkUpload(userListToCreate);
    return userListToCreate;
  }

  @Post()
  create(@Body() createTeamMemberDto: UserDto) {
    return this.teamMemberService.create(createTeamMemberDto);
  }

  @Get()
  findAll() {
    return this.teamMemberService.findAll();
  }

  @Get("/restaurant")
  findAllRestaurant() {
    return this.teamMemberService.findAllRestaurant();
  }
  @Get("/steward")
  getSteward() {
    return this.teamMemberService.getSteward();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.teamMemberService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTeamMemberDto: any) {
    return this.teamMemberService.update(id, updateTeamMemberDto);
  }

  @Patch("delete/:id")
  remove(@Param("id") id: string) {
    return this.teamMemberService.remove(id);
  }

  @Patch("delete/:id")
  deleteItem(@Param("id") id: string) {
    return this.teamMemberService.deleteItem(id);
  }

  @Patch("restaurant/:id")
  updateRestaurant(
    @Param("id") userId: string,
    @Body() updateRestaurantDto: updateRestaurant
  ) {
    return this.teamMemberService.updateRestaurant(userId, updateRestaurantDto);
  }

  @Patch("restaurant/updatePassword/:id")
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
  createUser(@Body() createItemDto: UserDto) {
    return this.teamMemberService.createUser(createItemDto);
  }

  @Post("/restaurant/validate")
  authenticate(@Body() restaurantAuthenticateDto: restaurantAuthenticateDto) {
    return this.teamMemberService.authenticate(restaurantAuthenticateDto);
  }

  // @Post("/restaurant")
  // createRestaurant(@Body() createRestaurantDto: restaurantAuthenticateDto) {
  //   return this.teamMemberService.createRestaurant(createRestaurantDto);
  // }

  // Tax
  @Post("restaurant/tax")
  createTax(@Body() createItemDto: Taxes) {
    return this.teamMemberService.createTax(createItemDto);
  }

  @Post("restaurant/tax/:id")
  getAllTaxList(@Param("id") userId: string) {
    return this.teamMemberService.getAllTaxList(userId);
  }

  @Delete("restaurant/delete/:id")
  removeRestaurant(@Param("id") id: string) {
    return this.teamMemberService.removeRestaurant(id);
  }
  @Delete("remove/:id")
  removeSteward(@Param("id") id: string) {
    return this.teamMemberService.removeSteward(id);
  }
}
