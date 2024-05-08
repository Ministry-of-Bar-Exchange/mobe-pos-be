import { ApiProperty } from "@nestjs/swagger";

export class CreateBillingDto {
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  customerId?: string;
  @ApiProperty({ required: false })
  phone?: string;
  @ApiProperty({ required: false })
  itemList: String[];
  @ApiProperty({ required: false })
  gst?: string;
  @ApiProperty({ required: false })
  vat?: string;
  @ApiProperty({ required: false })
  status?: "void" | "complementary" | "checkout";
  @ApiProperty({ required: false })
  dayCloseDate?: string

}
