export class KotDto {
  status: string;
  kotData: KotItem[];
  billingId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export class KotItem {
  productId: string;
  quantity: string;
}
