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
import { CreateMultipleTableDto } from "./dto/create-table.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("tables")
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Body() createTableDto: Tables) {
    return this.tablesService.create(createTableDto);
  }

  @Post('multi')
  createMultipleTables(@Body() createMultipleTableDto: CreateMultipleTableDto) {
    return this.tablesService.createMultipleTables(createMultipleTableDto);
  }

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(":id")
  @ApiBearerAuth('access-token')
  findOne(@Param("id") id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth('access-token')
  update(@Param("id") id: string, @Body() updateTableDto: Partial<Tables>) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(":id")
  @ApiBearerAuth('access-token')
  remove(@Param("id") id: string) {
    return this.tablesService.remove(id);
  }
}
