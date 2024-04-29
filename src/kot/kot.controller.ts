import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { KotService } from "./kot.service";
import { Kot } from "@prisma/client";
import { CancelKotItemPayloadType } from "types";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("kot")
export class KotController {
  constructor(private readonly kotService: KotService) {}

  @Get()
   @ApiBearerAuth("access-token")
  getAllItems() {
    return this.kotService.getAllItems();
  }
  @Get("all")
   @ApiBearerAuth("access-token")
  getAllKots() {
    return this.kotService.getAllKots();
  }

  @Get(":id")
   @ApiBearerAuth("access-token")
  @ApiBearerAuth('access-token')
  readCategory(@Param("id") id: string) {
    return this.kotService.read(id);
  }

  @Get("table/:code")
   @ApiBearerAuth("access-token")
  readKotByTableCode(@Param("code") code: string) {
    return this.kotService.readByTableCode(code);
  }

  @Get('table-kot/:code')
   @ApiBearerAuth("access-token")
  readKotDataByTableCode(@Param('code') code: string) {
    return this.kotService.readKotDataByTableCode(code);
  }

  @Post()
   @ApiBearerAuth("access-token")
  createKot(@Body() createItemDto: any) {
    return this.kotService.createKot(createItemDto);
  }

  @Post("/rePrintKot")
   @ApiBearerAuth("access-token")
  rePrintBilling(@Body() reprintKot: string[]) {
    return this.kotService.rePrintKot(reprintKot);
  }


  @Post("cancel-kot-item")
   @ApiBearerAuth("access-token")
  cancelKotItem(
    @Body() updateKotItemPayload: Partial<CancelKotItemPayloadType>
  ) {
   
    return this.kotService.updateKotItem(updateKotItemPayload);
  }

  @Patch(":id")
   @ApiBearerAuth("access-token")
  @ApiBearerAuth('access-token')
  updateItem(@Param("id") id: string, @Body() updateItemDto: Partial<Kot>) {
    return this.kotService.updateItem(id, updateItemDto);
  }

  @Delete(":id")
   @ApiBearerAuth("access-token")
  @ApiBearerAuth('access-token')
  deleteItem(@Param("id") id: string) {
    return this.kotService.deleteItem(id);
  }

  @Delete()
   @ApiBearerAuth("access-token")
  deleteAll() {
    return this.kotService.deleteAll();
  }
}
