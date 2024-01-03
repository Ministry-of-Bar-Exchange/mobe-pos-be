export class restaurantAuthenticateDto {
    discountPassword: string;
    userId: string;
  }
  
export class UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export class updateRestaurant {
  firmName?: string;
  outletName?: string;
  address?: string;
  taxId?: string;
  taxIdType?: string;
}