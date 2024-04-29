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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("Billing")
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiBearerAuth('access-token')
  create(@Body() createBillingDto: Billing) {
    return this.billingService.create(createBillingDto);
  }



  @Get()
  @ApiBearerAuth('access-token')
  findAll(@Query() filters: CommonObjectType) {
    return this.billingService.findAll(filters);
  }
  @Post("/rePrintBill")
  @ApiBearerAuth('access-token')
  rePrintBilling(@Body() reprintBill: string[]) {
    return this.billingService.rePrintBilling(reprintBill);
  }


  @Get('/sale')
  @ApiBearerAuth('access-token')
  findSale(@Query() filters: CommonObjectType) {
    return this.billingService.findSale(filters);
  }

  @Get("table-code/:code")
  @ApiBearerAuth('access-token')
  findBillFromTableCode(
    @Param("code") code: string,
    @Query() filters: CommonObjectType
  ) {
    return this.billingService.findBillFromTableCode(code, filters);
  }

  @Get(":id")
  @ApiBearerAuth('access-token')
  findOne(@Param("id") id: string) {
    return this.billingService.findOne(id);
  }

  @Post("print/:id")
  @ApiBearerAuth('access-token')
  handlePrintBill(
    @Param("id") id: string,
    @Body() updateBillingDto: Partial<Billing>
  ) {
    return this.billingService.handlePrintBill(id, updateBillingDto);
  }

  @Post("shift")
  @ApiBearerAuth('access-token')
  updateTables(@Body() updateBillingDto: any) {
    return this.billingService.shiftBillingTable(updateBillingDto);
  }

  @Post("shiftItem")
  @ApiBearerAuth('access-token')
  updateItem(@Body() updateBillingDto: any) {
    return this.billingService.shiftItem(updateBillingDto);
  }

  @Patch(":id")
  @ApiBearerAuth('access-token')
  update(@Param("id") id: string, @Body() updateBillingDto: Partial<Billing>) {
    return this.billingService.update(id, updateBillingDto);
  }

  @Delete(":id")
  @ApiBearerAuth('access-token')
  remove(@Param("id") id: string) {
    return this.billingService.remove(id);
  }
}
