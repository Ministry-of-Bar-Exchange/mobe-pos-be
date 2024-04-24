import { ApiProperty } from "@nestjs/swagger";

export class KotDto {
   @ApiProperty({ required: true })
  status: string;
   @ApiProperty({ required: true })
  kotData: KotItem[];
   @ApiProperty({ required: true })
  billingId: string;
   @ApiProperty({ required: true })
  isDeleted: boolean;
   @ApiProperty({ required: true })
  createdAt: string;
   @ApiProperty({ required: true })
  updatedAt: string;
}

export class KotItem {
  @ApiProperty({ required: true })
  productId: string;
  @ApiProperty({ required: true })
  quantity: string;
}
