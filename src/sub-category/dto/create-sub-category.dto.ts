import { ApiProperty } from "@nestjs/swagger";

export class CreateSubCategoryDto {
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  categoryId: string;
}
