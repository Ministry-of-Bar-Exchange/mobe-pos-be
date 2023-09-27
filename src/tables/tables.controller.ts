import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TablesService } from "./tables.service";
import { Tables } from "@prisma/client";

@Controller("tables")
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Body() createTableDto: Tables) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTableDto: Partial<Tables>) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tablesService.remove(id);
  }
}