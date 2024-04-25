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
import { UpdateItemDto } from "./dto/update-item.dto";
import { toJSON } from "utils/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "Auth/auth.public";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("bulk-upload/:id")
  @ApiBearerAuth("access-token")
  @UseInterceptors(FileInterceptor("products"))
  createBulkTeamMember(@UploadedFile() file: any, @Param("id") id: string) {
    const stringifyData = file?.buffer?.toString();
    const itemsListToCreate = toJSON(stringifyData);

    return this.productsService.handleItemsUpload(itemsListToCreate, id);
  }

  @Get()
  @ApiBearerAuth("access-token")
  getAllItems() {
    return this.productsService.getAllItems();
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  readCategory(@Param("id") id: string) {
    return this.productsService.read(id);
  }

  @Public()
  @Post()
  @ApiBearerAuth("access-token")
  createProduct(@Body() createItemDto: CreateItemDto) {
    return this.productsService.createProduct(createItemDto);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  updateItem(@Param("id") id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.productsService.updateItem(id, updateItemDto);
  }

  // @Public()
  // @Post("update-quantity")
  // updateItemQuantity(@Body() updateItemDto: UpdateItemQuantity) {
  //   return this.productsService.handleUpdateItemQuantity(updateItemDto);
  // }

  @Patch("delete/:id")
  @ApiBearerAuth("access-token")
  deleteItem(@Param("id") id: string) {
    return this.productsService.deleteItem(id);
  }

  @Delete()
  @ApiBearerAuth("access-token")
  deleteAll() {
    return this.productsService.deleteAll();
  }
}
