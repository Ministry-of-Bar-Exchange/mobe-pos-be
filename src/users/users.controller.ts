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
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-team-member.dto";

import { UpdateUserDto } from "./dto/update-team-member.dto";
import { toJSON } from "../utils/common";
import { User as UserDto } from "@prisma/client";
import { Public } from "Auth/auth.public";

@Controller("users")
export class UsersController {
  constructor(private readonly teamMemberService: UsersService) {}

  // @Post('bulk-create')
  // @UseInterceptors(FileInterceptor('users'))
  // createBulkTeamMember(@UploadedFile() file: any) {
  //   const stringifyData = file?.buffer?.toString();
  //   const userListToCreate = toJSON(stringifyData);
  //   this.teamMemberService.handleBulkUpload(userListToCreate);
  //   return userListToCreate;
  // }

  @Post()
  create(@Body() createTeamMemberDto: UserDto) {
    return this.teamMemberService.create(createTeamMemberDto);
  }
  @Get()
  findAll() {
    return this.teamMemberService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.teamMemberService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTeamMemberDto: UpdateUserDto) {
    return this.teamMemberService.update(id, updateTeamMemberDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.teamMemberService.remove(id);
  }
}
