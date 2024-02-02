import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { BillingService } from "./billing.service";
import { Billing } from "@prisma/client";
import { CommonObjectType } from "types";

@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  create(@Body() createBillingDto: Billing) {
    return this.billingService.create(createBillingDto);
  }

  @Get()
  findAll(@Query() filters: CommonObjectType) {
    return this.billingService.findAll(filters);
  }

  @Get('/sale')
  findSale(@Query() filters: CommonObjectType) {
    return this.billingService.findSale(filters);
  }


  @Get("table-code/:code")
  findBillFromTableCode(
    @Param("code") code: string,
    @Query() filters: CommonObjectType
  ) {
    return this.billingService.findBillFromTableCode(code, filters);
  }
 
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.billingService.findOne(id);
  }


  @Post("print/:id")
  handlePrintBill(
    @Param("id") id: string,
    @Body() updateBillingDto: Partial<Billing>
  ) {
    return this.billingService.handlePrintBill(id, updateBillingDto);
  }

  @Post("shift")
  updateTables(@Body() updateBillingDto: any) {
    return this.billingService.shiftBillingTable(updateBillingDto);
  }

  @Post("shiftItem")
  updateItem(@Body() updateBillingDto: any) {
    return this.billingService.shiftItem(updateBillingDto);
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
