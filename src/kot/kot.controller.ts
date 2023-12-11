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

@Controller("kot")
export class KotController {
  constructor(private readonly kotService: KotService) {}

  @Get()
  getAllItems() {
    return this.kotService.getAllItems();
  }

  @Get("all")
  getAllKots() {
    return this.kotService.getAllKots();
  }

  @Get(":id")
  readCategory(@Param("id") id: string) {
    return this.kotService.read(id);
  }

  @Get("table/:code")
  readKotByTableCode(@Param("code") code: string) {
    return this.kotService.readByTableCode(code);
  }

  @Post()
  createKot(@Body() createItemDto: Kot) {
    return this.kotService.createKot(createItemDto);
  }

  @Post("cancel-kot-item")
  cancelKotItem(
    @Body() updateKotItemPayload: Partial<CancelKotItemPayloadType>
  ) {
    console.debug("payload", updateKotItemPayload);
    return this.kotService.updateKotItem(updateKotItemPayload);
  }

  @Patch(":id")
  updateItem(@Param("id") id: string, @Body() updateItemDto: Partial<Kot>) {
    return this.kotService.updateItem(id, updateItemDto);
  }

  @Delete(":id")
  deleteItem(@Param("id") id: string) {
    return this.kotService.deleteItem(id);
  }

  @Delete()
  deleteAll() {
    return this.kotService.deleteAll();
  }
}
