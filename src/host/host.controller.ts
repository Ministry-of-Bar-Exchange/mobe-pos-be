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

@Controller("host")
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Post("/create")
  create(@Body() createBillingDto: Host) {
    return this.hostService.create(createBillingDto);
  }

  @Get()
  findAll(@Query() filters: CommonObjectType) {
    return this.hostService.findAll(filters);
  }
  @Get(":phone")
  findOne(@Param("phone") phone: string) {
    return this.hostService.findOne(phone);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateHostDto: UpdateHostDto) {
    return this.hostService.update(id, updateHostDto);
  }
}
