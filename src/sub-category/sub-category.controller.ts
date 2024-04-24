import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SubCategoryService } from "./sub-category.service";
import { CreateSubCategoryDto } from "./dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("sub-category")
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  getCategory() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  readCategory(@Param("id") id: string) {
    return this.subCategoryService.read(id);
  }

  @Post()
  createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.createSubCategory(createSubCategoryDto);
  }

  @Post('bulk-create')
  createBulkSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto[]) {
    return this.subCategoryService.bulkCreate(createSubCategoryDto);
  }

  @Patch(":id")
  @ApiBearerAuth('access-token')
  updateSubCategory(
    @Param("id") id: string,
    @Body() updateSubCategory: UpdateSubCategoryDto
  ) {
    return this.subCategoryService.updateSubCategory(id, updateSubCategory);
  }

  @Patch("delete/:id")
  deleteSubCategory(@Param("id") id: string) {
    return this.subCategoryService.deleteSubCategory(id);
  }
  @Delete()
  deleteAll(){
    return this.subCategoryService.deleteAll();
  }
}
