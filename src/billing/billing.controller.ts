import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BillingService } from "./billing.service";
import { Billing } from "@prisma/client";

@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  create(@Body() createBillingDto: Billing) {
    return this.billingService.create(createBillingDto);
  }

  @Get()
  findAll() {
    return this.billingService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.billingService.findOne(id);
  }

  @Get("table-code/:code")
  findBillFromTableCode(@Param("code") code: string) {
    return this.billingService.findBillFromTableCode(code);
  }

  @Post("print/:id")
  handlePrintBill(
    @Param("id") id: string,
    @Body() updateBillingDto: Partial<Billing>
  ) {
    return this.billingService.handlePrintBill(id, updateBillingDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBillingDto: Partial<Billing>) {
    return this.billingService.update(id, updateBillingDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.billingService.remove(id);
  }
}
