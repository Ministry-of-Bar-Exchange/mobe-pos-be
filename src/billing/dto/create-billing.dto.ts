export class CreateBillingDto {
  name: string;
  customerId?: string;
  phone: string;
  itemList: String[];
  gst?: string;
  vat?: string;
  status: "void" | "complementary" | "checkout";
  dayCloseDate?: string;

}
