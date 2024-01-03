export class restaurantAuthenticateDto {
  discountPassword: string;
  restaurantId: string;
}

export class UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}