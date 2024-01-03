import { KotItem } from "@prisma/client";

export interface UpdateKotItemListType extends KotItem {
  id: string;
}

export interface CancelKotItemPayloadType {
  canceledBy: string;
  canceledReason: string;
  kotData: UpdateKotItemListType[];
}

export interface CommonObjectType {
  [key: string]: string;
}
