import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./create-category.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({ required: true })
  name: string;
}
