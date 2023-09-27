export class CreateBillingDto {
  name: string;
  phone: string;
  itemList: String[];
  status: "void" | "complementary" | "checkout";
}
