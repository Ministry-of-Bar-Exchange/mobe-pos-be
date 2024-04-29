import { PartialType } from "@nestjs/mapped-types";
import { CreateSubCategoryDto } from "./create-sub-category.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  categoryId: string;
}
