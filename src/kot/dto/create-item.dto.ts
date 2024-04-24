import { ApiProperty } from "@nestjs/swagger";

class KotItem {
  @ApiProperty({ required: false })
  productId: string;
  @ApiProperty({ required: false })
  quantity: string;
}

export class CreateItemDto {
  @ApiProperty({ required: false })
  billingId: string;
  @ApiProperty({ required: false })
  kotData: KotItem;
  @ApiProperty({ required: false })
  stewardNo: string;
  @ApiProperty({ required: false })
  tableId: string;
  @ApiProperty({ required: false })
  userId: string;
}
