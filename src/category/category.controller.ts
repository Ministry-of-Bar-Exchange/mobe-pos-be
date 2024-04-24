import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategory() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  readCategory(@Param("id") id: string) {
    return this.categoryService.read(id);
  }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch("delete/:id")
  @ApiBearerAuth('access-token')
  deleteCategory(@Param("id") id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Patch(":id")
  @ApiBearerAuth('access-token')
  updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }
  @Delete()
  deleteAll(){
    return this.categoryService.deleteAll();
  }
}
