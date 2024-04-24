import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
  @ApiProperty({ required: true })
  fromDate: Date;
  @ApiProperty({ required: true })
  toDate: Date;
}
