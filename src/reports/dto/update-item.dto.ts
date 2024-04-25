import { ApiProperty } from "@nestjs/swagger";

export class CreateItemDto {
  @ApiProperty()
  fromDate: Date;
  @ApiProperty()
  toDate: Date;
}
