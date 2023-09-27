import { PartialType } from "@nestjs/mapped-types";
import { CreateItemDto } from "./create-item.dto";

export class UpdateItemDto {
  name: string;
  requirement: string;
  measuredIn: string;
  categoryId: string;
  amount: string;
  price: string;
  quantity: number;
  subcategoryId: string;
  vendorId: string;
}

export class UpdateItemQuantity {
  itemId: string;
  quantity: number;
  action: "increment" | "decrement";
}
