import { ApiProperty } from "@nestjs/swagger";

class KotItem {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  quantity: string;
}

export class CreateItemDto {
  @ApiProperty()
  billingId: string;
  @ApiProperty()
  kotData: KotItem;
  @ApiProperty()
  stewardNo: string;
  @ApiProperty()
  tableId: string;
  @ApiProperty()
  userId: string;
}
