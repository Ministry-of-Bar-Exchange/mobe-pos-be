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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("Sub-category")
@Controller("sub-category")
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  @ApiBearerAuth("access-token")
  getCategory() {
    return this.subCategoryService.findAll();
  }

  @Get(":id")
  @ApiBearerAuth("access-token")
  readCategory(@Param("id") id: string) {
    return this.subCategoryService.read(id);
  }

  @Post()
  @ApiBearerAuth("access-token")
  createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.createSubCategory(createSubCategoryDto);
  }

  @Post("bulk-create")
  @ApiBearerAuth("access-token")
  createBulkSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto[]) {
    return this.subCategoryService.bulkCreate(createSubCategoryDto);
  }

  @Patch(":id")
  @ApiBearerAuth("access-token")
  updateSubCategory(
    @Param("id") id: string,
    @Body() updateSubCategory: UpdateSubCategoryDto
  ) {
    return this.subCategoryService.updateSubCategory(id, updateSubCategory);
  }

  @Patch("delete/:id")
  @ApiBearerAuth("access-token")
  deleteSubCategory(@Param("id") id: string) {
    return this.subCategoryService.deleteSubCategory(id);
  }
  @Delete()
  @ApiBearerAuth("access-token")
  deleteAll() {
    return this.subCategoryService.deleteAll();
  }
}
