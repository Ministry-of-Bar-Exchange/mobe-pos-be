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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiBearerAuth("access-token")
  getCategory() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  readCategory(@Param("id") id: string) {
    return this.categoryService.read(id);
  }

  @Post()
  @ApiBearerAuth("access-token")
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch("delete/:id")
  @ApiBearerAuth("access-token")
  deleteCategory(@Param("id") id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }
  @Delete()
  @ApiBearerAuth("access-token")
  deleteAll() {
    return this.categoryService.deleteAll();
  }
}
