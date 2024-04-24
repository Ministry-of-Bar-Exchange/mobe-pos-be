import { ApiProperty } from "@nestjs/swagger";

export class restaurantAuthenticateDto {
  @ApiProperty({ required: true })
  discountPassword: string;
  @ApiProperty({ required: true })
  restaurantId: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ required: true })
  currentPassword: string;
  @ApiProperty({ required: true })
  newPassword: string;
}