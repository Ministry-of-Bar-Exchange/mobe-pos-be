import { PartialType } from "@nestjs/mapped-types";
import { CreateHostDto } from "./create-host.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateHostDto extends PartialType(CreateHostDto) {
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
  status?: boolean;
}
