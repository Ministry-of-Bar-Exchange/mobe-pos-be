export class CreateBillingDto {
  name: string;
  customerId ?: string
  phone: string;
  itemList: String[];
  status: "void" | "complementary" | "checkout";
}
