import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto, UpdateItemQuantity } from "./dto/update-item.dto";
import { toJSON } from "utils/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "Auth/auth.public";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("bulk-upload")
  @UseInterceptors(FileInterceptor("products"))
  createBulkTeamMember(@UploadedFile() file: any) {
    const stringifyData = file?.buffer?.toString();
    const itemsListToCreate = toJSON(stringifyData);

    this.productsService.handleItemsUpload(itemsListToCreate);
    return itemsListToCreate;
  }

  @Get()
  getAllItems() {
    return this.productsService.getAllItems();
  }

  @Get(":id")
  readCategory(@Param("id") id: string) {
    return this.productsService.read(id);
  }

  @Public()
  @Post()
  createOneItem(@Body() createItemDto: CreateItemDto) {
    return this.productsService.createOneItem(createItemDto);
  }

  @Patch(":id")
  updateItem(@Param("id") id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.productsService.updateItem(id, updateItemDto);
  }

  // @Public()
  // @Post("update-quantity")
  // updateItemQuantity(@Body() updateItemDto: UpdateItemQuantity) {
  //   return this.productsService.handleUpdateItemQuantity(updateItemDto);
  // }

  @Patch("delete/:id")
  deleteItem(@Param("id") id: string) {
    return this.productsService.deleteItem(id);
  }

  @Delete()
  deleteAll() {
    return this.productsService.deleteAll();
  }
}
