import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from "@nestjs/common";
import { HostService } from "./host.service";
import { Host } from "@prisma/client";
import { CommonObjectType } from "types";
import { UpdateHostDto } from "./dto/update-host.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("host")
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Post("/create")
  @ApiBearerAuth("access-token")
  create(@Body() createBillingDto: Host) {
    return this.hostService.create(createBillingDto);
  }

  @Get()
  @ApiBearerAuth("access-token")
  findAll(@Query() filters: CommonObjectType) {
    return this.hostService.findAll(filters);
  }
  @Get(":phone")
  @ApiBearerAuth("access-token")
  findOne(@Param("phone") phone: string) {
    return this.hostService.findOne(phone);
  }
  @Get("/table/:table")
  @ApiBearerAuth("access-token")
  findTable(@Param("table") table: string) {
    return this.hostService.findTable(table);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  update(@Param("id") id: string, @Body() updateHostDto: UpdateHostDto) {
    return this.hostService.update(id, updateHostDto);
  }
}
