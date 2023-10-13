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

@Controller("kot")
export class KotController {
  constructor(private readonly kotService: KotService) {}

  @Get()
  getAllItems() {
    return this.kotService.getAllItems();
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

  @Patch(":id")
  updateItem(@Param("id") id: string, @Body() updateItemDto: Partial<Kot>) {
    return this.kotService.updateItem(id, updateItemDto);
  }

  @Patch("delete/:id")
  deleteItem(@Param("id") id: string) {
    return this.kotService.deleteItem(id);
  }

  @Delete()
  deleteAll() {
    return this.kotService.deleteAll();
  }
}
