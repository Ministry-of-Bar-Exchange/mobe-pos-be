import { ApiProperty } from "@nestjs/swagger";

export class CreateMultipleTableDto {
  @ApiProperty({ required: false })
  toCreate?: string[];
  @ApiProperty({ required: false })
  toHide?: string[];
  @ApiProperty({ required: false })
  toUnhide?: string[];
  @ApiProperty({ required: false })
  defaultTable?: string[];
}
