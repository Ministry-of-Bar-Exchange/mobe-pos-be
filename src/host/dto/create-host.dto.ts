import { ApiProperty } from "@nestjs/swagger";

export class CreateHostDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  tableCode?: string;
  @ApiProperty()
  amount?: string;
  @ApiProperty()
  tableId?: string; 
  @ApiProperty()
  status ?: boolean
}
