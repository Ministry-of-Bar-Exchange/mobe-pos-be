import { ApiProperty } from "@nestjs/swagger";

export class restaurantAuthenticateDto {
  @ApiProperty({ required: false })
  discountPassword: string;
  @ApiProperty({ required: false })
  userId: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ required: false })
  currentPassword: string;
  @ApiProperty({ required: false })
  newPassword: string;
}

export class updateRestaurant {
  firmName?: string;
  @ApiProperty({ required: false })
  outletName?: string;
  @ApiProperty({ required: false })
  address?: string;
  @ApiProperty({ required: false })
  taxId?: string;
  @ApiProperty({ required: false })
  taxIdType?: string;
}
