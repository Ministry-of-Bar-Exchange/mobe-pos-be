import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { TablesService } from "./tables.service";
import { Tables } from "@prisma/client";
import { CreateMultipleTableDto } from "./dto/create-table.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("Tables")
@Controller("tables")
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiBearerAuth("access-token")
  create(@Body() createTableDto: Tables) {
    return this.tablesService.create(createTableDto);
  }
  @Post('multi')
  async createMultipleTables(@Body() createMultipleTableDto: CreateMultipleTableDto) {
    try {
      await this.tablesService.createMultipleTables(createMultipleTableDto);
      return { success: true };
    } catch (error) {
      if (error.message === "Cannot hide tables that are not available.") {
        throw new HttpException('Cannot hide tables that are not available.', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Get()
  @ApiBearerAuth("access-token")
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  findOne(@Param("id") id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  update(@Param("id") id: string, @Body() updateTableDto: Partial<Tables>) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(":id")
  @ApiBearerAuth("access-token")
  remove(@Param("id") id: string) {
    return this.tablesService.remove(id);
  }
}
